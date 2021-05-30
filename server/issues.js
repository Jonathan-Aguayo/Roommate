const Joi = require('joi')
let v;
const Issueschema = Joi.object({
    owner: Joi.string().required(),
    title: Joi.string().required(),
    status: Joi.string().valid('New', 'Open', 'Assigned', 'Fixed', 'Verified', 'Closed').required(),
    created: Joi.date().required(),
    effort: Joi.number().min(1).max(5),
    completionDate: Joi.date(),
});

const validateIssue = (Issue) =>
{
    const validationResult = Issueschema.validate(Issue)
    if(validationResult.error)
    {
        return validationResult.error.details[0].message;   
    }
}

const convertIssue = (Issue) => 
{
    if (Issue.created) Issue.created = new Date(Issue.created);
    if (Issue.completionDate) Issue.completionDate = new Date(Issue.completionDate);
    return Issue;
}

export default
{ 

    Issue: Issueschema,
    validateIssue: validateIssue,
    convertIssue: convertIssue,
};
