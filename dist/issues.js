'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Joi = require('joi');
var v = void 0;
var Issueschema = Joi.object({
    owner: Joi.string().required(),
    title: Joi.string().required(),
    id: Joi.number().required(),
    status: Joi.string().valid('New', 'Open', 'Assigned', 'Fixed', 'Verified', 'Closed').required(),
    created: Joi.date().required(),
    effort: Joi.number().min(1).max(5),
    completionDate: Joi.date()

});

var validateIssue = function validateIssue(Issue) {
    var validationResult = Issueschema.validate(Issue);
    if (validationResult.error) {
        return validationResult.error;
    }
};

exports.default = {

    Issue: Issueschema,
    validateIssue: validateIssue
};
//# sourceMappingURL=issues.js.map