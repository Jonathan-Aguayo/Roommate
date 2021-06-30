'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _cookieSession = require('cookie-session');

var _cookieSession2 = _interopRequireDefault(_cookieSession);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _Household = require('../models/Household');

var _Household2 = _interopRequireDefault(_Household);

require('babel-polyfill');

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _array = require('lodash/array');

var _array2 = _interopRequireDefault(_array);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();
require('../passport-setup');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
//app.set('port', (process.env.PORT || 5000));
_sourceMapSupport2.default.install();
//INITIALIZE DB
mongoose.connect('mongodb+srv://JonathanA:Alpha4086465832@roommatecluster.wjtg8.mongodb.net/Roommates?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(function (connection) {
    var server = app.listen(port, function () {
        console.log('app started on port ' + port);
        console.log('Database connected successfully');
    });

    server.setTimeout(1200000000);
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
var isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.session.passport) {
        next();
    } else {
        res.status(401).json({ message: 'Route only accessible to logged in users' });
    }
};

var isAuthorized = function isAuthorized(houseHold) {
    if (houseHold.owner === req.session.passport.user.user._id) {
        return true;
    } else {
        return false;
    }
};

app.post('/api/v1/createHousehold', isLoggedIn, function (req, res) {
    var currentUser = void 0;
    _User2.default.findById(req.session.passport.user.user._id).then(function (user) {
        currentUser = user;
        if (currentUser.household) {
            res.status(500).json({ message: 'Users are only allowed to be a part of one household at a time' });
        } else {
            (0, _nodeFetch2.default)('https://www.googleapis.com/calendar/v3/calendars?key=' + process.env.APIKEY, {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + req.session.passport.user.accessToken, 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'summary': req.body.houseName })
            }).then(function (response) {
                if (response.ok) {
                    response.json().then(function (message) {
                        var queryFilter = { googleID: req.session.passport.user.user.googleID };
                        _User2.default.findOne(queryFilter).then(function (user) {
                            _Household2.default.create({
                                houseName: JSON.stringify(req.body.houseName),
                                calendarID: message.id,
                                owner: user._id,
                                members: [user]
                            }).then(function (newHousehold) {
                                _User2.default.updateOne(queryFilter, { household: newHousehold._id }).then(function () {
                                    res.status(200).json(newHousehold);
                                });
                            });
                        });
                    });
                } else {
                    res.status(500).send({ message: 'Error when creating calendar' });
                }
            }).catch(function (err) {
                res.status(500).send(err);
            });
        }
    });
});

app.post('/api/v1/events', isLoggedIn, function (req, res) {
    _Household2.default.findById(req.session.passport.user.user.household).then(function (house) {
        console.log(house);
        (0, _nodeFetch2.default)('https://www.googleapis.com/calendar/v3/calendars/' + house.calendarID + '/events?key=' + process.env.APIKEY, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + req.session.passport.user.accessToken, 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body.eventBody)
        }).then(function (response) {
            if (response.ok) {
                response.json().then(function (message) {
                    res.status(200).json({ 'message': message });
                });
            } else {
                res.status(501).json({ message: 'problem creating google calendar event' });
            }
        }).catch(function (err) {
            res.status(500).json({ message: err });
        });
    });
});

app.get('/api/v1/houseHolds/:houseID', function (req, res) {
    _Household2.default.findById(req.params.houseID).then(function (houseHold) {
        res.status(200).json(houseHold);xxxz;
    }).catch(function (err) {
        res.status(501).json({ 'message': err });
    });
});

app.get('/api/v1/users', isLoggedIn, function (req, res) {
    _User2.default.findById(req.session.passport.user.user._id).then(function (user) {
        res.status(200).json(user);
    }).catch(function (err) {
        res.status(500).json(err);
    });
});

app.get('/api/v1/houseHolds/', isLoggedIn, function (req, res) {
    var userHousehold = void 0;

    _User2.default.findById(req.session.passport.user.user._id).then(function (user) {
        _Household2.default.findById(user.household).then(function (house) {
            userHousehold = house;
            res.status(200).json({ userHousehold: userHousehold });
        });
    }).catch(function (err) {
        res.status(500).json(err);
    });
});

app.delete('/api/v1/houseHolds/:houseID', isLoggedIn, function (req, res) {
    console.log(req.params.houseID);
    _Household2.default.findById(req.params.houseID).then(function (houseHold) {
        if (houseHold.owner == req.session.passport.user.user._id) {
            _Household2.default.deleteOne({ _id: houseHold._id }).then(function () {
                _User2.default.updateOne({ _id: req.session.passport.user.user._id }, { household: null }).then(function () {
                    return res.status(200).json({ message: 'Household deleted successfully' });
                });
            });
        } else {
            res.status(401).json({ message: 'Only owner of the house may delete the household' });
        }
    }).catch(function (err) {
        console.log(err);
        res.status(500).json({ message: err });
    });
});

//GOOGLE OAUTH2.0 ROUTES
app.get('/auth/loggedinonly', isLoggedIn, function (req, res) {
    res.send('you are logged in!');
});
app.get('/auth/google', _passport2.default.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'] }));
app.get('/api/v1/logout', function (req, res) {
    req.session = null;
    req.logout();
    res.send(req.session);
    res.redirect('/');
});
app.get('/auth/google/failure', function (req, res) {
    res.send('Unable to login');
});
app.get('/auth/google/callback', _passport2.default.authenticate('google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure'
}));
app.get('/auth/google/success', function (req, res) {
    res.send(req.session.passport);
});

//Static page route
app.get('*', function (req, res) {
    res.sendFile(_path2.default.resolve('static/index.html'));
});
//# sourceMappingURL=server.js.map