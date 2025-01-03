import joi from 'joi';
import mongoose from 'mongoose';

const objectIdValidator = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
};

const articleValidator = joi.object({
    title: joi
        .string()
        .required()
        .messages({
            'any.required': 'Title is required',
            'string.empty': 'Title cannot be empty'
        }),
    author: joi
        .string()
        .required()
        .custom(objectIdValidator, 'ObjectId validation')
        .messages({
            'any.required': 'Author is required',
            'string.empty': 'Author cannot be empty',
            'any.invalid': 'Author must be a valid ObjectId'
        }),
    cover: joi
        .string()
        .required()
        .messages({
            'any.required': 'Cover is required',
            'string.empty': 'Cover cannot be empty'
        }),
    body: joi
        .string()
        .required()
        .messages({
            'any.required': 'Body is required',
            'string.empty': 'Body cannot be empty'
        }),
    description: joi
        .string()
        .required()
        .messages({
            'any.required': 'Description is required',
            'string.empty': 'Description cannot be empty'
        }),
    category: joi
        .string()
        .required()
        .custom(objectIdValidator, 'ObjectId validation')
        .messages({
            'any.required': 'Category is required',
            'string.empty': 'Category cannot be empty',
            'any.invalid': 'Category must be a valid ObjectId'
        }),
    href: joi
        .string()
        .required()
        .messages({
            'any.required': 'Href is required',
            'string.empty': 'Href cannot be empty'
        }),
});

export default articleValidator;