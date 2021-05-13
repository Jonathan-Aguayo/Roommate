'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _issues = require('./issues.js');

var _issues2 = _interopRequireDefault(_issues);

require('babel-polyfill');

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _cookieSession = require('cookie-session');

var _cookieSession2 = _interopRequireDefault(_cookieSession);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MongoClient = require('mongodb').MongoClient;

require('../passport-setup');
var db = void 0;
_sourceMapSupport2.default.install();
//INITIALIZE DB
var client = MongoClient('mongodb+srv://JonathanA:Aguayo1@cluster0.id5hf.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true });
client.connect().then(function (connection) {
    db = connection;
    app.listen(3000, function () {
        console.log('app started on port 8000');
        console.log('Database connected successfully');
    });
}).catch(function (error) {
    console.log('ERROR when connecting:', error);
});

var app = (0, _express2.default)();
//MIDDLEWARE
app.use(_express2.default.static('static'));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _cookieSession2.default)({
    name: 'Roomies-sesion',
    keys: ['key1', 'key2']
}));
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

//ROUTES
app.get('/api/v1/issues/:issueID', function (req, res) {
    db.db('test').collection('issues').findOne({ "_id": _mongodb2.default.ObjectID(req.params.issueID) }).then(function (issue) {
        console.log('Issue:' + issue);
        res.json({ record: issue });
    }).catch(function (err) {
        res.json(400).send('Issue ID is not valid');
    });
});

app.get('/api/v1/issues', function (req, res) {
    db.db('test').collection('issues').find().toArray().then(function (issues) {
        var metadata = { total_count: issues.length };
        res.json({ _metadata: metadata, records: issues });
    }).catch(function (error) {
        console.log(error);res.status(500).json({ message: 'Internal server error: ' + error });
    });
});

app.post('/api/v1/issues', function (req, res) {
    var newIssue = req.body;
    newIssue.created = new Date();
    if (!newIssue.status) {
        newIssue.status = 'New';
    }
    var error = _issues2.default.validateIssue(newIssue);
    if (error.message) {
        //res.json(400).send(error.message);
    }

    db.db('test').collection('issues').insertOne(newIssue, function (err, db) {
        if (err) res.json(400).send(err);else res.json(newIssue);
    });
});

app.delete('/api/v1/issues/:issueID', function (req, res) {
    db.db('test').collection('issues').findOne({ "_id": _mongodb2.default.ObjectID(req.params.issueID) }).then(function () {
        db.db('test').collection('issues').deleteOne({ '_id': _mongodb2.default.ObjectID(req.params.issueID) }).then(function () {
            res.send(200);
        });
    }).catch(function (err) {
        res.json(400).send('Issue ID is not valid');
    });
});

app.get('/auth/google', _passport2.default.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/logout', function (req, res) {
    req.session = null;
    req.logout();
    res.redirect('/');
});

app.get('/auth/google/failure', function (req, res) {
    res.send('Failed to log in');
});
app.get('/auth/google/success', function (req, res) {
    console.log(req.user);
    res.send('Welcome home, ' + JSON.stringify(req.user) + '!');
});
app.get('/auth/google/callback', _passport2.default.authenticate('google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure'

}));
//# sourceMappingURL=server.js.map