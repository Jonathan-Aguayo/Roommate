import express from 'express';
import bodyParser from 'body-parser';
import Issue from './issues.js';
import mongoDB, { ObjectID } from 'mongodb';
import SourceMapSupport from 'source-map-support';
import passport from 'passport';
import cookieSession from 'cookie-session'
import path from 'path';
import 'babel-polyfill';
require('dotenv').config();
require('../passport-setup')
const MongoClient = require('mongodb').MongoClient;

let db;
SourceMapSupport.install();
//INITIALIZE DB
const client = MongoClient('mongodb+srv://JonathanA:Aguayo1@cluster0.id5hf.mongodb.net/test',{ useNewUrlParser: true, useUnifiedTopology: true });
client.connect().then(connection => {
db = connection;
app.listen(process.env.PORT|| 3000, () => {
console.log(`app started on port 3000 ${process.env.PORT || 3000}`)
console.log('Database connected successfully');
});
}).catch(error => {
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
app.get('/api/v1/issues/:issueID', (req,res) =>
{
    db.db('test').collection('issues').findOne({"_id": mongoDB.ObjectID(req.params.issueID)}).then(issue =>
        {
            res.json({record: issue});
        })
        .catch(err=>
            {
            res.json(400).send('Issue ID is not valid')
            });   
});

app.get('/api/v1/issues', (req,res) =>
{
    const filter = {};
    if(req.query.status) filter.status = req.query.status;
    if (req.query.effortFrom || req.query.effortTo) filter.effort = {};
    if (req.query.effortFrom) filter.effort.$gte = parseInt(req.query.effortFrom, 10);
    if (req.query.effortTo) filter.effort.$lte = parseInt(req.query.effortTo, 10);
    if(req.session.passport)
    {
        filter.user = req.session.passport.user.id;
    }
    else
    {
        filter.user = '0000000000'
    }

    db.db('test').collection('issues').find(filter).toArray().then(issues => 
        {
            const metadata = { total_count: issues.length };
            res.json({_metadata: metadata, records: issues});
        }).catch(error => {console.log(error); res.status(500).json({message: `Internal server error: ${error}`}); });
});
app.post('/api/v1/issues', (req,res) => 
{
    const newIssue = req.body;
    newIssue.created = new Date();
    if(req.session.passport)
    {
        newIssue.user = req.session.passport.user.id
    }
    else
    {
        newIssue.user = '0000000000'
    }
    if (!newIssue.status)
    {
        newIssue.status = 'New';
    }   
    let error = Issue.validateIssue(newIssue);
    if(error)
    {
        res.status(400).json({error});
        return;
    }

    db.db('test').collection('issues').insertOne(newIssue, (err,db) => {
        if(err)
            res.json(400).send(err)
        else
            res.json(newIssue);
    });

});
app.delete('/api/v1/issues/:issueID', (req,res) =>
{
    db.db('test').collection('issues').findOne({"_id": mongoDB.ObjectID(req.params.issueID)}).then( () =>
        {
            db.db('test').collection('issues').deleteOne({'_id':mongoDB.ObjectID(req.params.issueID)}).then( () => 
            {
                res.send(200)
            })
        })
        .catch(err=>
            {
            res.json(400).send('Issue ID is not valid')
            });   
});
app.put('/api/v1/issues/:issueID', (req,res) =>
{
    let issueID;
    try 
    {
        issueID = new ObjectID(req.params.issueID);
    } 
    catch (error)
    {
        res.status(422).json({ message: `Invalid issue ID format: ${error}` })
        return;
    }

    const issue = req.body;
    delete issue._id;

    const error = Issue.validateIssue(issue);
    if(error)
    {
        res.status(400).json({ message: `Invalid request ${error}` });
        return;
    }

    db.db('test').collection('issues').update({_id: issueID}, Issue.convertIssue(issue)).then( () => 
    {
        db.db('test').collection('issues').find( {_id: issueID }).limit(1).next().then( (updatedIssue) =>{ res.json(updatedIssue) })
        .catch( error => res.status(500).json({message: `Internal server Error: ${error}`}));
    });
});
app.get('/auth/google', passport.authenticate('google', { scope:[ 'profile','email'] }
));
app.get('/api/v1/logout', (req,res) =>
{
    req.session = null;
    req.logout();
    res.redirect('/');
});
app.get('/auth/google/failure',(req,res) => {res.send('Failed to log in')});
app.get( '/auth/google/callback',passport.authenticate( 'google', {
        successRedirect: '/',
        failureRedirect: '/auth/google/failure'
}));
app.get('/homepage', (req,res) => 
{
    res.sendFile(path.resolve('static/homepage.html'))
});
app.get('*', (req,res) =>
{
    res.sendFile(path.resolve('static/index.html'));
});

