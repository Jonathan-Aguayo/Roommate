const Joi = require('joi')
let v;
const Issueschema = Joi.object({
    owner: Joi.string().required(),
    title: Joi.string().required(),
    id: Joi.number().required(),
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
        return validationResult.error;   
    }
}

export default
{ 

    Issue: Issueschema,
    validateIssue : validateIssue
};
