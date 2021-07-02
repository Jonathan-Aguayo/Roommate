import express, { response } from 'express';
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
import array from 'lodash/array'
require('dotenv').config();
require('../passport-setup')
const mongoose = require('mongoose');
let port = process.env.PORT || 3000;
//app.set('port', (process.env.PORT || 5000));
SourceMapSupport.install();
//INITIALIZE DB
mongoose.connect('mongodb+srv://JonathanA:Alpha4086465832@roommatecluster.wjtg8.mongodb.net/Roommates?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true })
.then(connection => 
    {
        let server = app.listen(port, () => 
        {
            console.log(`app started on port ${port}`)
            console.log('Database connected successfully');
        });

        server.setTimeout(1200000000);
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

app.post('/api/v1/createHousehold', isLoggedIn, (req,res) => 
{
    let currentUser;
    User.findById(req.session.passport.user.user._id).then(user => 
    {
        currentUser = user;
        if(currentUser.household)
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
                                User.updateOne(queryFilter, {household:newHousehold._id} ).then( () => 
                                {
                                    res.status(200).json(newHousehold)
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

app.post('/api/v1/events', isLoggedIn, (req,res) => 
{
    HouseHold.findById(req.session.passport.user.user.household).then(house => 
    {
        console.log(house);
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
    console.log(message);
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
            res.status(200).json(houseHold);xxxz
        })
        .catch(err => 
        {
            res.status(501).json({'message': err})
        })
})

app.get('/api/v1/users', isLoggedIn, (req,res) => 
{
    User.findById(req.session.passport.user.user._id).then( user => 
    {
        res.status(200).json(user);
    })
    .catch(err => 
    {
        res.status(500).json(err);
    })
})

app.get('/api/v1/houseHolds/', isLoggedIn, (req,res) => 
{
    let userHousehold;

    User.findById(req.session.passport.user.user._id).then(user => 
        {
            HouseHold.findById(user.household).then(house => 
                {
                    userHousehold = house;
                    res.status(200).json({message: userHousehold});
                })
        })
        .catch(err => 
        {
            res.status(500).json({message: err})
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
                User.updateOne({_id:req.session.passport.user.user._id}, {household: null})
                    .then( () => res.status(200).json({message: 'Household deleted successfully'}))
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
app.get('/auth/loggedinonly',isLoggedIn, (req,res) =>
{
    res.send('you are logged in!')
})
app.get('/auth/google', passport.authenticate('google', { scope:[ 'profile','email','https://www.googleapis.com/auth/calendar',] }
));
app.get('/api/v1/logout', (req,res) =>
{
    req.session = null;
    req.logout();
    res.send(req.session);
    res.redirect('/');
});
app.get('/auth/google/failure',(req,res) => {res.send('Unable to login')});
app.get( '/auth/google/callback',passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));
app.get('/auth/google/success',(req,res) => 
{
    res.send(req.session.passport);
})

//Static page route
app.get('*', (req,res) =>
{
    res.sendFile(path.resolve('static/index.html'));
});

