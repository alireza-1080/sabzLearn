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

const getDrafts = async (_req, res) => {
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

const getDraftById = async (req, res) => {
    try {
        console.log(req.params);
        //^ Get the draft ID from the request parameters
        const { draftId } = req.params;

        //^ Validate the draft ID
        const { error: idValidationError } = idValidator.validate({ id: draftId });

        //^ Return a 400 response if there is a validation error
        if (idValidationError) {
            throw new Error(idValidationError);
        }

        //^ Find the draft by ID
        const draft = await Draft.findById(draftId)
            .select({ updatedAt: 0, __v: 0 });

            //^ Return a 404 response if the draft does not exist
        if (!draft) {
            throw new Error("Draft not found");
        }

        //^ Return a 200 response with the draft
        return res.status(200).json(draft);
    }
    catch (error) {
        //^ Return a 400 response if there is an error
        return res.status(400).json({ message: error.message });
    }
};

const updateDraft = async (req, res) => {
    try {
        //^ Get the draft ID from the request parameters
        const { draftId } = req.params;

        //^ Validate the draft ID
        const { error: idValidationError } = idValidator.validate({ id: draftId });

        //^ Return a 400 response if there is a validation error
        if (idValidationError) {
            throw new Error("Draft ID must be a valid ObjectId");
        }

        //^ Find the draft by ID
        const draft = await Draft.findById(draftId);

        //^ Return a 404 response if the draft does not exist
        if (!draft) {
            throw new Error("Draft not found");
        }

        //^ Get draft title and body from the request body
        const { title: newTitle, body: newBody } = req.body;

        //^ Create a draft test object
        const draftSample = {
            title: newTitle? newTitle : draft.title,
            body: newBody? newBody : draft.body,
        };
        console.log(draftSample);

        //^ Validate the draft object
        const { error: draftValidationError } = draftValidator.validate(draftSample);

        //^ Return a 400 response if there is a validation error
        if (draftValidationError) {
            throw new Error(draftValidationError);
        }

        //^ Update the draft object
        await draft.updateOne(draftSample);

        //^ Return a 200 response
        return res.status(200).json("Draft updated successfully");
    }
    catch (error) {
        //^ Return a 400 response if there is an error
        return res.status(400).json({ message: error.message });
    }
};

const deleteDraft = async (req, res) => {
    try {
        //^ Get the draft ID from the request parameters
        const { draftId } = req.params;

        //^ Validate the draft ID
        const { error: idValidationError } = idValidator.validate({ id: draftId });

        //^ Return a 400 response if there is a validation error
        if (idValidationError) {
            throw new Error(idValidationError);
        }

        //^ Find the draft by ID and delete it
        const draft = await Draft.findByIdAndDelete(draftId);

        //^ Return a 404 response if the draft does not exist
        if (!draft) {
            throw new Error("Draft not found");
        }

        //^ Return a 200 response
        return res.status(200).json("Draft deleted successfully");
    }
    catch (error) {
        //^ Return a 400 response if there is an error
        return res.status(400).json({ message: error.message });
    }
};

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