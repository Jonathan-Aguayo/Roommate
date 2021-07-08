const passport = require( 'passport');
const GoogleStrategy = require ( 'passport-google-oauth2' ).Strategy;
const User = require('./models/User');

passport.serializeUser( (message, done) =>
{
    done(null,message);
});

passport.deserializeUser( (message, done) =>
{
    done(null,message); 
} )

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback   : true,
    proxy: true,
  },
  function(request, accessToken, refreshToken, profile, done) {
      User.findOne({googleID:profile.id})
      .then( user => 
        {
            if(!user)
            {
               User.create({googleID: profile.id, firstName: profile.name.givenName, lastName: profile.name.familyName, email:profile.email, picture:profile.picture })
               .then( user => {
                   return done(null,{user,'accessToken': accessToken });
               })
               .catch( err => {
                    return done(null, false, {message: err});
               });
            }
            else
            {
                return done(null, {user,'accessToken': accessToken })
            }
        })
      .catch( err => 
        {
            return done(null, false, {message: err});
        });
  }
)); 