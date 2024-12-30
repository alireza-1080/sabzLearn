import joi from 'joi';

const idValidator = joi.object({
    id: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export default idValidator;