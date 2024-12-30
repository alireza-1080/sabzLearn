import Joi from "joi";

const commentValidator = Joi.object({
    body: Joi
        .string()
        .required()
        .trim()
        .min(3),
    course: Joi
        .string()
        .required()
        .trim()
        .pattern(new RegExp('^[0-9a-fA-F]{24}$'))
        .messages({
            'string.pattern.base': 'Course ID must be a valid ObjectId',
        }),
    creator: Joi
        .string()
        .required()
        .trim()
        .pattern(new RegExp('^[0-9a-fA-F]{24}$'))
        .messages({
            'string.pattern.base': 'Creator ID must be a valid ObjectId',
        }),
    rate: Joi
        .number()
        .required()
        .min(1)
        .max(5)
        .messages({
            'number.min': 'Rate should be a minimum of 1',
            'number.max': 'Rate should be a maximum of 5',
            'number.base': 'Rate should be a number',
        }),
    isItReply: Joi
        .boolean()
        .required(),
    mainComment: Joi
        .string()
        .trim()
        .pattern(new RegExp('^[0-9a-fA-F]{24}$'))
        .messages({
            'string.pattern.base': 'Main Comment ID must be a valid ObjectId',
        })
}).strict().when(Joi.object({ isItReply: Joi.boolean().valid(true) }), {
    then: Joi.object({
        mainComment: Joi.string().required()
    })
});

commentValidator.options({ abortEarly: false });

export default commentValidator;