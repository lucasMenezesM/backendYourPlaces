// authMiddleware.js
import passport from "../passport-config.js";

const requireAuth = passport.authenticate("jwt", { session: false });

export default requireAuth;
