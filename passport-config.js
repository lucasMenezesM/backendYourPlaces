// passport-config.js
import passport from "passport";
import { config } from "dotenv";
import User from "./models/users-model.js";

config();

import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.secretKey, // Substitua pelo seu segredo
};

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.secretKey, // Substitua pelo seu segredo
    },
    async (jwt_payload, done) => {
      console.log(jwt_payload);
      let user;
      try {
        user = await User.findById(jwt_payload.userId);
      } catch (err) {
        return done(null, false);
      }

      if (!user) return done(null, false);

      if (user._id.toString() !== jwt_payload.userId) return done(null, false);

      return done(null, user);
    }
  )
);

export default passport;
