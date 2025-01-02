import joi from 'joi';

const notificationSchema = joi.object({
    adminId: joi
        .string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Admin ID must be a valid 24-character hex string.',
            'any.required': 'Admin ID is required.'
        }),
    instructorId: joi
        .string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Instructor ID must be a valid 24-character hex string.',
            'any.required': 'Instructor ID is required.'
        }),
    message: joi
        .string()
        .required()
        .messages({
            'any.required': 'Message is required.'
        }),
})
    .strict()
    .unknown(false)
    .messages({
        'object.unknown': 'You have used an invalid key.'
    });

export default notificationSchema;