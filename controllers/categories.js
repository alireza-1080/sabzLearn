import Category from "../models/category.js";
import categoryValidator from "../validators/categoryValidator.js";
import idValidator from "../validators/idValidator.js";

const createCategory = async (req, res) => {
    try {
        //^ get request body
        const requestBody = req.body;

        //^ Validate the user input
        const { error, value } = categoryValidator.validate(requestBody);

        //^ Return a 400 response if there is an error
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        //^ process the user input when it is valid
        if (value) {
            const category = new Category(value);
            await category.save();
            return res.status(201).json({ message: "Category created successfully" });
        }
    }
    //^ Catch any error that occurs
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        //^ Get all categories
        const categories = await Category.find();

        //^ Return the categories
        return res.status(200).json(categories);
    }
    //^ Catch any error that occurs
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        //^ get request body
        const { title: newTitle, href: newHref } = req.body;

        //^ get the category id
        const categoryId = req.params.id;

        //^ Find the category by id
        const category = await Category.findById(categoryId);

        //^ Return a 404 response if the category is not found
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        //^ Create a new category object
        const updatedCategory = {
            title: newTitle ? newTitle : category.title,
            href: newHref ? newHref : category.href
        };

        //^ Validate new category object
        const { error, value } = categoryValidator.validate(updatedCategory);

        //^ Return a 400 response if there is an error
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        //^ process the user input when it is valid
        if (value) {
            await Category.findByIdAndUpdate(categoryId, value);
            return res.status(200).json({ message: "Category updated successfully" });
        }
    }
    //^ Catch any error that occurs
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        //^ get the category id
        const categoryId = req.params.id;

        //^ Find the category by id
        const category = await Category.findById(categoryId);

        //^ Return a 404 response if the category is not found
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        //^ Delete the category
        await Category.findByIdAndDelete(categoryId);

        //^ Return a 200 response if the category is deleted successfully
        return res.status(200).json({ message: "Category deleted successfully" });
    }
    //^ Catch any error that occurs
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        //^ Get the category ID from the request parameters
        const { id } = req.params;

        //^ Validate the category ID
        const { error: categoryIdValidation } = idValidator.validate({ id });

        //^ Return a 400 response if there is a validation error
        if (categoryIdValidation) {
            throw new Error("Category ID must be a valid ObjectId");
        }

        //^ Find the category by ID
        const category = await Category.findById(id);

        //^ Return a 404 response if the category is not found
        if (!category) {
            throw new Error("Category not found");
        }

        //^ Return a 200 response with the category
        return res.status(200).json(category);
    }
    //^ Catch any errors and return a 500 response
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export { createCategory, getCategories, updateCategory, deleteCategory, getCategoryById };