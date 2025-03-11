const Category = require("../models/Category");
const factoryHandlers = require("./factoryHandlers");

exports.getCategories = factoryHandlers.getAll(Category);

exports.createCategory = factoryHandlers.createOne(Category);

exports.getCategoryById = factoryHandlers.getById(Category);

exports.updateCategory = factoryHandlers.updateOne(Category);

exports.deleteCategory = factoryHandlers.deleteOne(Category);
