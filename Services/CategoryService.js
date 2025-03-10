const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const ApiError = require('../Utils/ApiError');
const ApiFeatures = require("../Utils/apiFeatures");

exports.getCategories = asyncHandler(async (req, res) => {
    const features = new ApiFeatures(Category.find(), req.query)
      .filter()
      .search()
      .limitFields()
      .sort();

    // Apply pagination after filtering and searching
    await features.paginate();

    const { mongooseQuery, paginationResults } = features;
    const category = await mongooseQuery;

    res.status(200).json({
      count: category.length,
      result: paginationResults,
      data: category,
    });
});

exports.createCategory = asyncHandler(async (req, res) => {
    const {name} = req.body;
    const category = await Category.create({ name, slug: slugify(name) });
    res.status(201).json({ data: category });

    // CategoryModel.create({ name, slug: slugify(name) })
    //     .then((category) => res.status(201).json({ data: category }))
    //     .catch(err => res.status(400).send(err));

    // const newCategory = new CategoryModel({ name });
    // newCategory.save().then((doc) => {
    //     res.json(doc);
    // }).catch((err) => {
    //     res.json(err);
    // });
});

exports.getCategoryById = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
        // res.status(404).json({ msg: 'category not found' });
        return next(new ApiError('category not found', 404));
    }
    res.status(200).json({ data: category });
});

exports.updateCategory = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findOneAndUpdate({ _id: id }, { name: name, slug: slugify(name) }, { new: true });
    if (!category) {
        // res.status(404).json({ msg: 'category not found' });
        return next(new ApiError('category not found', 404));
    }
    res.status(200).json({ data: category });
});

exports.deleteCategory = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const category = await Category.findOneAndDelete({ _id: id });
    if (!category) {
        // res.status(404).json({ msg: 'category not found' });
        return next(new ApiError('category not found', 404));
    }
    res.status(204).json();
})