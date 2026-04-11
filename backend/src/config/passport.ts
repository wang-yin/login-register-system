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

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      scope: ['user:email'],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any,
    ) => {
      try {
        const name = profile.displayName || profile.username || 'GitHub User';
        const email = profile.emails?.[0].value;
        const githubId = profile.id;
        if (!email) {
          return done(new Error('GitHub 帳號未公開 Email，無法登入'), null);
        }

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: name,
            email,
            providers: [
              {
                provider: 'github',
                providerId: githubId,
              },
            ],
          });
        } else {
          const hasThisGithubAccount = user.providers?.some(
            (p) => p.provider === 'github' && p.providerId === githubId,
          );
          if (!hasThisGithubAccount) {
            user.providers?.push({
              provider: 'github',
              providerId: githubId,
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
