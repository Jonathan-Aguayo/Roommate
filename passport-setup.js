const passport =require( 'passport');
const GoogleStrategy =require ( 'passport-google-oauth2' ).Strategy;

passport.serializeUser( (user, done) =>
{
    console.log('passport.serialize function: '+user);
    done(null,user);
});

passport.deserializeUser( (user, done) =>
{
    console.log('passport.deserialize function: '+user);
    done(null,user); 
} )

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback   : true,
    proxy: true,
  },
  function(request, accessToken, refreshToken, profile, done) {
      //one I get profile, check if user exists in my database if and if not create one and if yes, log in 
        console.log('passport.use function: ')
      return done(null, profile);
  }
));