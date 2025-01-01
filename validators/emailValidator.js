import joi from 'joi';

const emailValidator = joi.object({
    email: joi
        .string()
        .email()
        .required(),
});

export default emailValidator;