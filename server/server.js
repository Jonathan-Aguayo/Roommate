import express from 'express';
import bodyParser from 'body-parser';
import { ObjectId, ObjectID } from 'mongodb';
import SourceMapSupport from 'source-map-support';
import passport from 'passport';
import cookieSession from 'cookie-session'
import path from 'path';
import User from '../models/User';
import HouseHold from '../models/Household';
import Message from '../models/Message';
import 'babel-polyfill';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
require('dotenv').config();
require('../passport-setup')
const mongoose = require('mongoose');

let port = process.env.PORT || 3000;
//app.set('port', (process.env.PORT || 5000));
SourceMapSupport.install();
//INITIALIZE DB
mongoose.connect(`mongodb+srv://JonathanA:${process.env.DBPASSWORD}@roommatecluster.wjtg8.mongodb.net/Roommates?retryWrites=true&w=majority`,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(connection => 
    {
        let server = app.listen(port, () => 
        {
            console.log(`app started on port ${port}`)
            console.log('Database connected successfully');
        });

        server.setTimeout(120000);
    })
.catch(error => 
    {
        console.log('ERROR when connecting:', error);
    });
const app = express();
//MIDDLEWARE

app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieSession({
    name:'Roomies-sesion',
    keys:['key1','key2']
}));
app.use(passport.initialize());
app.use(passport.session());


//ROUTES
const isLoggedIn = (req,res,next) =>
{
    if(req.session.passport)
    {
        next();
    }
    else
    {
        res.status(401).json({message: 'Route only accessible to logged in users'})
    }
}

const isAuthorized = (houseHold) => 
{
    if(houseHold.owner === req.session.passport.user.user._id)
    {
        return true;
    }
    else
    {
        return false;
    }
}

app.post('/api/v1/households', isLoggedIn, (req,res) => 
{
    User.findById(req.session.passport.user.user._id).then(user => 
    {
        if(user.household)
        {
            res.status(500).json({message: 'Users are only allowed to be a part of one household at a time'})
        }

        else
        {
            fetch(`https://www.googleapis.com/calendar/v3/calendars?key=${process.env.APIKEY}`, {
                method:'POST',
                headers:{'Authorization':`Bearer ${req.session.passport.user.accessToken}`, 'Accept':'application/json','Content-Type':'application/json'},
                body:JSON.stringify({'summary':req.body.houseName}),
            })                                                
            .then(response => 
            {
                if(response.ok)
                {
                    response.json().then(message => 
                    {
                        const queryFilter = {googleID: req.session.passport.user.user.googleID};
                        User.findOne(queryFilter).then(user => 
                        {
                            HouseHold.create({
                                houseName: JSON.stringify(req.body.houseName),
                                calendarID: message.id,
                                owner: user._id,
                                members: [user,]
                            })
                            .then(newHousehold => 
                            {
                                req.session.passport.user.user.household = newHousehold._id;
                                User.updateOne(queryFilter, {household:newHousehold._id}).then(update =>
                                {
                                    res.status(200).json({ message: newHousehold })
                                })
 
                            })
                        })
                    }) 
                }
                else
                {
                    res.status(500).send({message: 'Error when creating calendar'});
                }
            })
            .catch(err => 
            {
                res.status(500).send(err) 
            })
        }
    });
});

app.get('/api/v1/households/public', isLoggedIn, (req,res) => 
{
    HouseHold.findById(req.session.passport.user.user.household).then(house =>
    {
        fetch(`https://www.googleapis.com/calendar/v3/calendars/${house.calendarID}/acl?key=${process.env.APIKEY}`,  
        {
            method:'POST',
            headers:{'Authorization':`Bearer ${req.session.passport.user.accessToken}`, 'Accept':'application/json','Content-Type':'application/json'},
            body:JSON.stringify({"role":"writer","scope":{"type":"default"}}),
        })
        .then(response => 
        {
            if(response.ok)
            {
                res.status(200).json({message: 'Success'});
            }  
            else
            {
                res.status(500).json({message: 'Problem making calendar public'});
            }
        })
        .catch(err => 
        {
            res.status(500).json({message: err})
        })
    })
})

app.post('/api/v1/events', isLoggedIn, (req,res) => 
{
    HouseHold.findById(req.session.passport.user.user.household).then(house => 
    {
        fetch(`https://www.googleapis.com/calendar/v3/calendars/${house.calendarID}/events?key=${process.env.APIKEY}`, {
            method:'POST',
            headers:{'Authorization':`Bearer ${req.session.passport.user.accessToken}`, 'Accept':'application/json','Content-Type':'application/json'},
            body:JSON.stringify(req.body.eventBody),
        })
        .then(response => 
        {
            if(response.ok)
            {
                response.json().then(message => 
                {
                    res.status(200).json({'message':message});
                })
                
            }
            else
            {
                console.dir()
                res.status(501).json({message:'problem creating google calendar event'});
            }
        })
        .catch(err => 
        {
            res.status(500).json({message: err});
        })
    })
})

app.post('/api/v1/messages', isLoggedIn, (req,res) => 
{
    const message = req.body.messageBody;
    message.household = req.session.passport.user.user.household;
    message.postedBy = req.session.passport.user.user;
    Message.create(
        message
    )
    .then(newMessage => 
    {
        res.status(200).json({ message: newMessage });
    })
    .catch(err => 
    {
        res.status(500).json({ message: err });
    })
})

app.post('/api/v1/invite/', isLoggedIn, (req,res) => 
{
    if(req.session.passport.user.user.household)
    {
        let transporter = nodemailer.createTransport({
            service:'gmail',
            auth: { user: process.env.MAILUSER, pass: process.env.MAILPASS},
        })

        let mailOptions = {
            from: process.env.MAILUSER,
            to: req.body.To,
            subject: 'Invitation to Room8tes household!',
            html: `<p> Hi, 
                    ${req.session.passport.user.user.firstName} ${req.session.passport.user.user.lastName} is inviting to their house. Click here to <a href="https://roomies-1.herokuapp.com/auth/google?returnTo=/join">join </a> </p>
                    enter this code to join household: ${req.session.passport.user.user.household}`
        }

        transporter.sendMail(mailOptions, (err, data) => 
        {
            if(err)
            {
                res.status(500).json({message: err})
            }
            else
            {
                res.status(200).json({message: 'Email sent successfully'})
            }
        })
    }
    else
    {
        res.status(501).json({message: 'You must create a household before you can invite someone'})
    }

});

app.get('/api/v1/user/', isLoggedIn, (req,res) => 
{
    if(req.session.passport)
    {   
        let resObject = {};
        User.findById(req.session.passport.user.user._id)
        .then(user => 
        {
            resObject.user=user;
            if(user.household)
            {
                HouseHold.findById(user.household)
                .then(house => 
                {
                    resObject.household = house;
                    res.status(200).json({message: resObject});
                })
            }
            else
            {
                resObject.household = null;
                res.status(200).json({message: resObject});
            }
            
        })
    }
    else
    {
        res.status(400);
    }

})

app.get('/api/v1/messages', isLoggedIn, (req,res) => 
{
    if(req.session.passport.user.user.household)
    {
        const filter = {household: req.session.passport.user.user.household}
        Message.find(filter).then(messages => 
        {
            res.status(200).json({message: messages})
        })
        .catch(err => 
        {
            res.status(500).json({message: err})
        })
    }
    else
    {
        res.status(400).json({message: 'You must join a house to see household messages'})
    }
})

app.get('/api/v1/houseHolds/:houseID', (req,res) => 
{
    HouseHold.findById(req.params.houseID).then(houseHold => 
        {
            res.status(200).json(houseHold);
        })
        .catch(err => 
        {
            res.status(501).json({'message': err})
        })
})

app.get('/api/v1/houseHolds/', isLoggedIn, (req,res) => 
{
    User.findById(req.session.passport.user.user._id).then(user => 
    {
        HouseHold.findById(user.household).then(house => 
        {
            res.status(200).json({message: house});
        })
    })
    .catch(err => 
    {
        res.status(500).json({message: err})
    })
})

app.patch('/api/v1/houseHolds/:houseID', isLoggedIn, (req,res) =>
{
    User.findById(req.session.passport.user.user._id).then(user =>
    {
        if(user.household)
        {
            res.status(500).json({message: 'Users are only allowed to be a part of one household at a time'})
        }
        else
        {
            HouseHold.findById(req.params.houseID, function(err,house) {
            {
                if(err)
                {
                    res.status(404).json({message: 'Not a valid House Id'});
                }
                else
                {
                    let updatedMembers = house.members;
                    updatedMembers.push(user)
                    HouseHold.updateOne({_id: house._id, }, {members: updatedMembers}).then( () => 
                    {
                        req.session.passport.user.user.household = house._id;
                        User.updateOne({_id: user._id}, {household: house._id}).then( () => 
                        {
                            res.status(200).json({message:'success'});
                        })
                    })
                }
            }})
        }
    })
    
})

app.delete('/api/v1/houseHolds/:houseID',isLoggedIn,(req,res) => 
{
    console.log(req.params.houseID);
    HouseHold.findById(req.params.houseID).then(houseHold => 
    {
        if(houseHold.owner == req.session.passport.user.user._id)
        {
            HouseHold.deleteOne({_id: houseHold._id}).then( () => 
            {
                User.updateMany({household: houseHold._id}, {household: null}).then(update =>
                {
                    req.session.passport.user.user.household = null;
                    Message.deleteMany({ household: req.params.houseID }).then(deleted=>
                    {
                        res.status(200).json({message: req.session.passport.user.user})
                    })
                })
            });
        }
        else
        {
            res.status(401).json({message: 'Only owner of the house may delete the household'});
        }
        
    })
    .catch(err => 
        {
            console.log(err);
            res.status(500).json({message: err})
        })
})

//GOOGLE OAUTH2.0 ROUTES
app.get('/auth/google', (req,res,next)=>
{
    const {returnTo} = req.query;
    const state = returnTo ? Buffer.from(returnTo).toString('base64'): undefined
    const authenticator = passport.authenticate('google', { scope:[ 'profile','email','https://www.googleapis.com/auth/calendar',], state: state});
    authenticator(req,res,next);
});

app.get('/api/v1/logout', (req,res) =>
{
    req.session = null; 
    req.logout();
    res.redirect('/');
});

app.get('/auth/google/failure',(req,res) => {res.send('Unable to login')});
app.get( '/auth/google/callback/', passport.authenticate( 'google', { failureRedirect: '/auth/google/failure' }), (req, res) =>
    {
        try
        {
            const state  = req.query.state
            const returnTo = Buffer.from(state, 'base64').toString()
            if (typeof returnTo === 'string' && returnTo.startsWith('/'))
            {
                return res.redirect(returnTo);
            }
        }
        catch (error)
        {
            //redirect normally
        }
        res.redirect('/auth/google/success')
    },
);

app.get('/auth/google/success',(req,res) => 
{
    res.send(req.session.passport);
})
app.get('/auth/google/success/:house',(req,res) => 
{
    res.send(req.params.house);
})

//Static page route
app.get('*', (req,res) =>
{
    res.sendFile(path.resolve('static/index.html'));
});

