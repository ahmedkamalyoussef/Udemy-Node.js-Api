const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Product = require('../models/product');
const ApiError = require('../Utils/ApiError');

exports.getProducts = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 2;
    const skip = (page - 1) * limit;
    const products = await Product.find({}).skip(skip).limit(limit);
    res.status(200).json({ results: products.length,page:page, data: products });
});

exports.createProduct = asyncHandler(async (req, res) => {
    req.body.slug = slugify(req.body.title);
    const product = await Product.create(req.body);
    res.status(201).json({ data: product });
});

exports.getProductById = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return next(new ApiError('Product not found', 404));
    }
    res.status(200).json({ data: product });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    req.body.slug = slugify(req.body.title);
    const product = await Product.findOneAndUpdate({ _id: id }, req.body, { new: true });
    if (!product) {
        return next(new ApiError('Product not found', 404));
    }
    res.status(200).json({ data: product });
});

exports.deleteProduct = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ _id: id });
    if (!product) {
        return next(new ApiError('Product not found', 404));
    }
    res.status(204).json();
})