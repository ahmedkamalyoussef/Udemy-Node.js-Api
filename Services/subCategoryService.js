const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const SubCategory = require('../models/SubCategory');
const ApiError = require('../Utils/ApiError');
const ApiFeatures = require("../Utils/apiFeatures");



exports.SetCategoryIdToBody = (req, res, next) => {
    if (!req.body.categoryId)
        req.body.categoryId = req.params.categoryId;
    next();
}
exports.createFilter = (req, res, next) => {
    let filter = {};
    if (req.params.categoryId) {
        filter = { categoryId: req.params.categoryId };
    }
    req.filter = filter;
    next();
}
exports.createSubCategory = asyncHandler(async (req, res) => {
    const { name, categoryId } = req.body;
    const subCategory = await SubCategory.create({
        name,
        slug: slugify(name),
        categoryId
    });
    res.status(201).json({ data: subCategory });
});
exports.getSubCategories = asyncHandler(async (req, res) => {
    const features = new ApiFeatures(SubCategory.find(), req.query)
      .filter(req.filter)
      .search()
      .limitFields()
      .sort();

    // Apply pagination after filtering and searching
    await features.paginate();

    const { mongooseQuery, paginationResults } = features;
    const subCategories = await mongooseQuery;

    res.status(200).json({
      count: subCategories.length,
      result: paginationResults,
      data: subCategories,
    });

})

exports.getSubCategoryById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id).populate({ path: 'categoryId', select: 'name' });
    if (!subCategory) {
        return next(new ApiError('Subcategory not found', 404));
    }
    res.status(200).json({ data: subCategory });
});

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const subCategory = await SubCategory.findOneAndUpdate({ _id: id }, { name: name, slug: slugify(name) }, { new: true });
    if (!subCategory) {
        return next(new ApiError('Subcategory not found', 404));
    }
    res.status(200).json({ data: subCategory });
});

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await SubCategory.findOneAndDelete({ _id: id });
    if (!subCategory) {
        return next(new ApiError('Subcategory not found', 404));
    }
    res.status(204).json({ msg: 'Subcategory deleted' });
});