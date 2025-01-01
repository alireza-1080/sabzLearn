import joi from 'joi';

export const contactUsReplyValidator = joi.object({
    subject: joi.string().required(),
    message: joi.string().required(),
    contactEmail: joi.string().email().required()
});

export default contactUsReplyValidator;