import joi from 'joi';

const courseUser = joi.object({
    course: joi
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Course ID must be a valid 24 character hex string.',
            'any.required': 'Course ID is required.'
        }),
    user: joi
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'User ID must be a valid 24 character hex string.',
            'any.required': 'User ID is required.'
        }),
    signUpPrice: joi
        .number()
        .required()
        .messages({
            'number.base': 'Sign Up Price must be a number.',
            'any.required': 'Sign Up Price is required.'
        })
}).strict();

export default courseUser;