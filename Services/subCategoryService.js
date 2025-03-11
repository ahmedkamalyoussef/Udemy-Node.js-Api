const SubCategory = require("../models/SubCategory");
const factoryHandlers = require("./factoryHandlers");

exports.SetCategoryIdToBody = (req, res, next) => {
  if (!req.body.categoryId) req.body.categoryId = req.params.categoryId;
  next();
};
exports.createFilter = (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) {
    filter = { categoryId: req.params.categoryId };
  }
  req.filter = filter;
  next();
};
exports.createSubCategory = factoryHandlers.createOne(SubCategory);

exports.getSubCategories = factoryHandlers.getAll(SubCategory);

exports.getSubCategoryById = factoryHandlers.getById(SubCategory);

exports.updateSubCategory = factoryHandlers.updateOne(SubCategory);

exports.deleteSubCategory = factoryHandlers.deleteOne(SubCategory);
