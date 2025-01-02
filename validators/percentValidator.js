import joi from 'joi';

const percentValidator = joi.object({
    percentage: joi
        .number()
        .min(0)
        .max(100)
        .required()
        .messages({
            'number.base': `"percentage" should be a type of 'number'`,
            'number.min': `"percentage" should have a minimum value of {#limit}`,
            'number.max': `"percentage" should have a maximum value of {#limit}`,
            'any.required': `"percentage" is a required field`
        }),
});

export default percentValidator;