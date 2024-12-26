import Category from "../models/category.js";
import categoryValidator from "../validators/categoryValidator.js";

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

export { createCategory, getCategories, updateCategory, deleteCategory };