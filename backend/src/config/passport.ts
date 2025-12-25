import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  findUserByEmail,
  findUserByProviderId,
  createOAuthUser,
  addProviderToUser,
} from "../models/auth_model";

// github
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      scope: ["user:email"],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        let user = await findUserByProviderId("github", profile.id);

        if (!user) {
          const email = profile.emails?.[0]?.value;

          if (email) {
            user = await findUserByEmail(email);
          }

          if (!user) {
            user = await createOAuthUser({
              name: profile.displayName || profile.username,
              email: email,
              provider: "github",
              providerId: profile.id,
            });
          } else {
            user = await addProviderToUser(
              user._id.toString(),
              "github",
              profile.id
            );
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

//google
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
      done: any
    ) => {
      try {
        let user = await findUserByProviderId("google", profile.id);

        if (!user) {
          const email = profile.emails?.[0]?.value;

          if (email) {
            user = await findUserByEmail(email);
          }

          if (!user) {
            user = await createOAuthUser({
              name:
                profile.displayName || profile.name?.givenName || "Google User", // 增加備案
              email: profile.emails?.[0]?.value,
              provider: "google",
              providerId: profile.id,
            });
          } else {
            user = await addProviderToUser(
              user._id.toString(),
              "google",
              profile.id
            );
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
