import Article from '../models/article.js';
import Draft from '../models/draft.js';
import articleValidator from '../validators/articleValidator.js';
import draftValidator from '../validators/draftValidator.js';
import idValidator from '../validators/idValidator.js';

const getArticles = async (req, res) => { };

const createArticle = async (req, res) => { };

const getArticleById = async (req, res) => { };

const updateArticle = async (req, res) => { };

const deleteArticle = async (req, res) => { };

const updateArticleCover = async (req, res) => { };

const getArticleByHref = async (req, res) => { };

const getDrafts = async (req, res) => {
    try {
        //^ Get all the drafts
        const drafts = await Draft.find()
            .select({ updatedAt: 0, __v: 0 });

        //^ Return a 200 response
        return res.status(200).json(drafts);
    }
    catch (error) {
        //^ Return a 400 response if there is an error
        return res.status(400).json({ message: error.message });
    }
};

const createDraft = async (req, res) => {
    try {
        //^ Get draft title and body from the request body
        const { title, body } = req.body;

        //^ Create a draft test object
        const draftSample = {
            title,
            body,
        };

        //^ Validate the draft object
        const { error: draftValidationError } = draftValidator.validate(draftSample);

        //^ Return a 400 response if there is a validation error
        if (draftValidationError) {
            throw new Error(draftValidationError);
        }

        //^ Create a new draft object
        const newDraft = new Draft(draftSample);

        //^ Save the new draft object
        await newDraft.save();

        //^ Return a 201 response
        return res.status(201).json("Draft created successfully");
    }
    catch (error) {
        //^ Return a 400 response if there is an error
        return res.status(400).json({ message: error.message });
    }
};

const getDraftById = async (req, res) => { };

const updateDraft = async (req, res) => { };

const deleteDraft = async (req, res) => { };

export {
    getArticles,
    createArticle,
    getArticleById,
    updateArticle,
    deleteArticle,
    updateArticleCover,
    getArticleByHref,
    getDrafts,
    createDraft,
    getDraftById,
    updateDraft,
    deleteDraft
};