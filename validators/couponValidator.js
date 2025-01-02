import joi from 'joi';
import mongoose from 'mongoose';

const objectIdValidator = joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
}, 'ObjectId Validation');

const couponValidator = joi.object({
    code: joi
        .string()
        .required()
        .messages({
            'string.base': 'Code should be a type of text',
            'any.required': 'Code is a required field'
        }),
    percentage: joi
        .number()
        .min(0)
        .max(100)
        .required()
        .messages({
            'number.base': 'Percentage should be a type of number',
            'number.min': 'Percentage should be at least 0',
            'number.max': 'Percentage should be at most 100',
            'any.required': 'Percentage is a required field'
        }),
    course: objectIdValidator
        .required()
        .messages({
            'any.invalid': 'Course should be a valid ObjectId',
            'any.required': 'Course is a required field'
        }),
    maxRedemptions: joi
        .number()
        .required()
        .messages({
            'number.base': 'Max Redemptions should be a type of number',
            'any.required': 'Max Redemptions is a required field'
        }),
    creator: objectIdValidator
        .required()
        .messages({
            'any.invalid': 'Creator should be a valid ObjectId',
            'any.required': 'Creator is a required field'
        })
});

export default couponValidator;