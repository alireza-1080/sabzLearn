import joi from 'joi';

const draftValidator = joi.object({
    title: joi
        .string()
        .required()
        .messages({
            'any.required': 'Title is required',
            'string.empty': 'Title cannot be empty'
        }),
    body: joi
        .string()
        .required()
        .messages({
            'any.required': 'Body is required',
            'string.empty': 'Body cannot be empty'
        }),
});

export default draftValidator;