import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/schema/UserSchema';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any,
    ) => {
      const email = profile.emails?.[0].value;
      const googleId = profile.id;
      try {
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            providers: [
              {
                provider: 'google',
                providerId: googleId,
              },
            ],
          });
        } else {
          const hasThisGoogleAccount = user.providers?.some(
            (p) => p.provider === 'google' && p.providerId === googleId,
          );
          if (!hasThisGoogleAccount) {
            user.providers?.push({
              provider: 'google',
              providerId: googleId,
            });
            await user.save();
          }
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);
