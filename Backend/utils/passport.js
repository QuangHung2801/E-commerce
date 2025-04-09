import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../schemas/user.js';
import Role from '../schemas/role.js';
import crypto from 'crypto';

passport.use(new GoogleStrategy({
  clientID: "458882725914-at0ivp1s3rnibu0ul9d915r7e64ht6bu.apps.googleusercontent.com",
  clientSecret: "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",
callbackURL: "http://localhost:3000/auth/google/callback"
},async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
  
      if (!user) {
        // Kiểm tra xem email đã tồn tại chưa
        user = await User.findOne({ email: profile.emails[0].value });
  
        if (user) {
          // Nếu user đã có email, gán thêm googleId
          user.googleId = profile.id;
          await user.save();
        } else {
          // Tạo user mới
          const userRole = await Role.findOne({ name: 'user' });
          if (!userRole) {
            return done(new Error('Role user not found'), null);
          }
  
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            password: crypto.randomBytes(16).toString('hex'),
            email: profile.emails[0].value,
            avatarUrl: profile.photos[0].value,
            role: userRole._id
          });
          await user.save();
        }
      }
  
      return done(null, user);
    } catch (err) {
      console.error('Google Auth Error:', err);
      return done(err, null);
    }
  }));