'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Joi = require('joi');
var v = void 0;
var Issueschema = Joi.object({
    owner: Joi.string().required(),
    title: Joi.string().required(),
    status: Joi.string().valid('New', 'Open', 'Assigned', 'Fixed', 'Verified', 'Closed').required(),
    user: Joi.string(),
    created: Joi.date().required(),
    effort: Joi.number().min(1).max(5),
    completionDate: Joi.date()
});

var validateIssue = function validateIssue(Issue) {
    var validationResult = Issueschema.validate(Issue);
    if (validationResult.error) {
        return validationResult.error.details[0].message;
    }
};

var convertIssue = function convertIssue(Issue) {
    if (Issue.created) Issue.created = new Date(Issue.created);
    if (Issue.completionDate) Issue.completionDate = new Date(Issue.completionDate);
    return Issue;
};

exports.default = {

    Issue: Issueschema,
    validateIssue: validateIssue,
    convertIssue: convertIssue
};
//# sourceMappingURL=issues.js.map