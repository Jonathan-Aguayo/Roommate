import express from 'express';
import bodyParser from 'body-parser';
import Issue from './issues.js';
import 'babel-polyfill';
import SourceMapSupport from 'source-map-support';
import passport from 'passport';
import cookieSession from 'cookie-session'
const MongoClient = require('mongodb').MongoClient;
import mongoDB from 'mongodb';
require('../passport-setup')
let db;
SourceMapSupport.install();
//INITIALIZE DB
const client = MongoClient('mongodb+srv://JonathanA:Aguayo1@cluster0.id5hf.mongodb.net/test',{ useNewUrlParser: true, useUnifiedTopology: true });
client.connect().then(connection => {
db = connection;
app.listen(3000, () => {
console.log('app started on port 8000')
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
            console.log('Issue:'+issue);
            res.json({record: issue});
        })
        .catch(err=>
            {
            res.json(400).send('Issue ID is not valid')
            });   
});

app.get('/api/v1/issues', (req,res) =>
{
    db.db('test').collection('issues').find().toArray().then(issues => 
        {
            const metadata = { total_count: issues.length };
            res.json({_metadata: metadata, records: issues});
        }).catch(error => {console.log(error); res.status(500).json({message: `Internal server error: ${error}`}); });
});

app.post('/api/v1/issues', (req,res) => 
{
    const newIssue = req.body;
    newIssue.created = new Date();
    if (!newIssue.status)
    {
        newIssue.status = 'New';
    }   
    let error = Issue.validateIssue(newIssue);
    if(error.message)
    {
        //res.json(400).send(error.message);
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


app.get('/auth/google', passport.authenticate('google', { scope:[ 'profile','email'] }
));

app.get('/logout', (req,res) =>
{
    req.session=null;
    req.logout();
    res.redirect('/');
});

app.get('/auth/google/failure',(req,res) => {res.send('Failed to log in')});
app.get('/auth/google/success',(req,res) => 
{
    console.log(req.user)
    res.send(`Welcome home, ${JSON.stringify(req.user)}!`);
});
app.get( '/auth/google/callback',passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
        
}));
