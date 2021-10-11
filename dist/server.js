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

var _Message = require('../models/Message');

var _Message2 = _interopRequireDefault(_Message);

require('babel-polyfill');

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();
require('../passport-setup');
var mongoose = require('mongoose');

var port = process.env.PORT || 3000;
//app.set('port', (process.env.PORT || 5000));
_sourceMapSupport2.default.install();
//INITIALIZE DB
mongoose.connect('mongodb+srv://JonathanA:' + process.env.DBPASSWORD + '@roommatecluster.wjtg8.mongodb.net/Roommates?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(function (connection) {
    var server = app.listen(port, function () {
        console.log('app started on port ' + port);
        console.log('Database connected successfully');
    });

    server.setTimeout(120000);
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

app.post('/api/v1/households', isLoggedIn, function (req, res) {
    _User2.default.findById(req.session.passport.user.user._id).then(function (user) {
        if (user.household) {
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
                                req.session.passport.user.user.household = newHousehold._id;
                                _User2.default.updateOne(queryFilter, { household: newHousehold._id }).then(function (update) {
                                    res.status(200).json({ message: newHousehold });
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

app.get('/api/v1/households/public/:houseID', isLoggedIn, function (req, res) {
    _Household2.default.findById(req.params.houseID).then(function (house) {
        (0, _nodeFetch2.default)('https://www.googleapis.com/calendar/v3/calendars/' + house.calendarID + '/acl?key=' + process.env.APIKEY, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + req.session.passport.user.accessToken, 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ "role": "reader", "scope": { "type": "default" } })
        }).then(function (response) {
            if (response.ok) {
                res.status(200).json({ message: 'Success' });
            } else {
                res.status(500).json({ message: 'Problem making calendar public' });
            }
        }).catch(function (err) {
            res.status(500).json({ message: err });
        });
    });
});

app.put('/api/v1/houseHolds/group', isLoggedIn, function (req, res) {
    _User2.default.findById(req.session.passport.user.user._id).then(function (user) {
        if (user.household) {
            _Household2.default.findById(user.household).then(function (house) {
                var updatedGroups = req.body.groups;
                _Household2.default.updateOne({ _id: house._id }, { groups: req.body.groups }).then(function () {
                    res.status(200).json({ message: 'okay' });
                });
            });
        } else {
            res.status(400).json({ message: 'Must first join household' });
        }
    });
});

app.post('/api/v1/events', isLoggedIn, function (req, res) {
    _Household2.default.findById(req.session.passport.user.user.household).then(function (house) {
        console.dir(house.calendarID);

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
                res.status(500).json({ message: response.body });
            }
        }).catch(function (err) {
            res.status(500).json({ message: err });
        });
    });
});

app.post('/api/v1/households/groups', isLoggedIn, function (req, res) {
    _User2.default.findById(req.session.passport.user.user._id).then(function (user) {
        _Household2.default.findById(user.household).then(function (house) {
            var updatedGroups = house.groups;
            updatedGroups.push(req.body.newGroup);
            _Household2.default.updateOne({ _id: house._id }, { groups: updatedGroups }).then(function () {
                res.status(200).json({ message: 'nice' });
            });
        });
    }).catch(function (err) {
        res.status(500).json({ message: err });
    });
});

app.post('/api/v1/messages', isLoggedIn, function (req, res) {
    var message = req.body.messageBody;
    message.household = req.session.passport.user.user.household;
    message.postedBy = req.session.passport.user.user;
    _Message2.default.create(message).then(function (newMessage) {
        res.status(200).json({ message: newMessage });
    }).catch(function (err) {
        res.status(500).json({ message: err });
    });
});

app.post('/api/v1/invite/', isLoggedIn, function (req, res) {
    if (req.session.passport.user.user.household) {
        _Household2.default.findById(req.session.passport.user.user.household).then(function (house) {
            console.dir(house.calendarID);
            (0, _nodeFetch2.default)('https://www.googleapis.com/calendar/v3/calendars/' + house.calendarID + '/acl?key=' + process.env.APIKEY, {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + req.session.passport.user.accessToken, 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ "role": "writer", "scope": { "type": "user", "value": req.body.To } })
            }).then(function (response) {
                if (response.ok) {
                    var transporter = _nodemailer2.default.createTransport({
                        service: 'gmail',
                        auth: { user: process.env.MAILUSER, pass: process.env.MAILPASS }
                    });

                    var mailOptions = {
                        from: process.env.MAILUSER,
                        to: req.body.To,
                        subject: 'Invitation to Room8tes household!',
                        html: '<p> Hi, \n                                ' + req.session.passport.user.user.firstName + ' ' + req.session.passport.user.user.lastName + ' is inviting to their house. Click here to <a href="https://roomies-1.herokuapp.com/auth/google?returnTo=/join">join </a> </p>\n                                enter this code to join household: ' + req.session.passport.user.user.household
                    };

                    transporter.sendMail(mailOptions, function (err, data) {
                        if (err) {
                            res.status(500).json({ message: err });
                        } else {
                            res.status(200).json({ message: 'Email sent successfully' });
                        }
                    });
                } else {
                    response.json().then(function (message) {
                        res.status(503).json({ message: message });
                    });
                }
            }).catch(function (err) {
                res.status(500).json({ message: err });
            });
        });
    } else {
        res.status(501).json({ message: 'You must create a household before you can invite someone' });
    }
});

app.get('/api/v1/user/', isLoggedIn, function (req, res) {
    if (req.session.passport) {
        var resObject = {};
        _User2.default.findById(req.session.passport.user.user._id).then(function (user) {
            resObject.user = user;
            if (user.household) {
                _Household2.default.findById(user.household).then(function (house) {
                    resObject.household = house;
                    res.status(200).json({ message: resObject });
                });
            } else {
                resObject.household = null;
                res.status(200).json({ message: resObject });
            }
        });
    } else {
        res.status(400);
    }
});

app.get('/api/v1/messages', isLoggedIn, function (req, res) {
    if (req.session.passport.user.user.household) {
        var filter = { household: req.session.passport.user.user.household };
        _Message2.default.find(filter).then(function (messages) {
            res.status(200).json({ message: messages });
        }).catch(function (err) {
            res.status(500).json({ message: err });
        });
    } else {
        res.status(400).json({ message: 'You must join a house to see household messages' });
    }
});

app.get('/api/v1/houseHolds/:houseID', function (req, res) {
    _Household2.default.findById(req.params.houseID).then(function (houseHold) {
        res.status(200).json(houseHold);
    }).catch(function (err) {
        res.status(501).json({ 'message': err });
    });
});

app.get('/api/v1/houseHolds/', isLoggedIn, function (req, res) {
    _User2.default.findById(req.session.passport.user.user._id).then(function (user) {
        _Household2.default.findById(user.household).then(function (house) {
            res.status(200).json({ message: house });
        });
    }).catch(function (err) {
        res.status(500).json({ message: err });
    });
});

app.patch('/api/v1/houseHolds/addMembers', isLoggedIn, function (req, res) {
    console.dir(req.body);
    _User2.default.findById(req.session.passport.user.user._id).then(function (user) {
        if (user.household) {
            res.status(500).json({ message: 'Users are only allowed to be a part of one household at a time' });
        } else {
            _Household2.default.findById(req.body.houseID, function (err, house) {
                {
                    if (err) {
                        res.status(404).json({ message: 'Not a valid House Id' });
                    } else {
                        var updatedMembers = house.members;
                        updatedMembers.push(user);
                        _Household2.default.updateOne({ _id: house._id }, { members: updatedMembers }).then(function () {
                            req.session.passport.user.user.household = house._id;
                            _User2.default.updateOne({ _id: user._id }, { household: house._id }).then(function () {
                                res.status(200).json({ message: 'success' });
                            });
                        });
                    }
                }
            });
        }
    });
});

app.patch('/api/v1/houseHolds/Chore', isLoggedIn, function (req, res) {
    _User2.default.findById(req.session.passport.user.user._id).then(function (user) {
        if (user.household) {
            _Household2.default.updateOne({ _id: user.household }, { chores: req.body.updatedChores }).then(function () {
                res.status(200);
            });
        } else {
            res.status(500).json({ message: 'Join house to add chores' });
        }
    });
});

app.delete('/api/v1/houseHolds/:houseID', isLoggedIn, function (req, res) {
    _Household2.default.findById(req.params.houseID).then(function (houseHold) {
        if (houseHold.owner == req.session.passport.user.user._id) {
            _Household2.default.deleteOne({ _id: houseHold._id }).then(function () {
                _User2.default.updateMany({ household: houseHold._id }, { household: null }).then(function (update) {
                    req.session.passport.user.user.household = null;
                    _Message2.default.deleteMany({ household: req.params.houseID }).then(function (deleted) {
                        (0, _nodeFetch2.default)('https://www.googleapis.com/calendar/v3/calendars/' + houseHold.calendarID + '?key=' + process.env.APIKEY, {
                            method: 'DELETE',
                            headers: { 'Authorization': 'Bearer ' + req.session.passport.user.accessToken, 'Accept': 'application/json', 'Content-Type': 'application/json' }
                        }).then(function (response) {
                            if (response.ok) {
                                res.status(200).json({ message: req.session.passport.user.user });
                            } else {
                                res.status(500).json({ message: 'Error occured while deleted google calendar from ' });
                            }
                        });
                    });
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
app.get('/auth/google', function (req, res, next) {
    var returnTo = req.query.returnTo;

    var state = returnTo ? Buffer.from(returnTo).toString('base64') : undefined;
    var authenticator = _passport2.default.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'], state: state });
    authenticator(req, res, next);
});

app.get('/api/v1/logout', function (req, res) {
    req.session = null;
    req.logout();
    res.redirect('/home');
});

app.get('/auth/google/failure', function (req, res) {
    res.send('Unable to login');
});
app.get('/auth/google/callback/', _passport2.default.authenticate('google', { failureRedirect: '/auth/google/failure' }), function (req, res) {
    try {
        var state = req.query.state;
        var returnTo = Buffer.from(state, 'base64').toString();
        if (typeof returnTo === 'string' && returnTo.startsWith('/')) {
            return res.redirect(returnTo);
        }
    } catch (error) {
        //redirect normally
    }
    res.redirect('/auth/google/success');
});

app.get('/auth/google/success', function (req, res) {
    res.redirect('/');
});
app.get('/auth/google/success/:house', function (req, res) {
    res.send(req.params.house);
});

//Static page route
app.get('*', function (req, res) {
    res.sendFile(_path2.default.resolve('static/index.html'));
});
//# sourceMappingURL=server.js.map