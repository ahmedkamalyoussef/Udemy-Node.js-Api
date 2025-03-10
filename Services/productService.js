const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const ApiError = require("../Utils/ApiError");
const ApiFeatures = require("../Utils/apiFeatures");

exports.getProducts = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Product.find(), req.query)
    .filter()
    .search("products")
    .limitFields()
    .sort();

  // Apply pagination after filtering and searching
  await features.paginate();

  const { mongooseQuery, paginationResults } = features;
  const products = await mongooseQuery.populate({
    path: "categoryId",
    select: "name",
  });

  res
    .status(200)
    .json({
      count: products.length,
      result: paginationResults,
      data: products,
    });
});

exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});

exports.getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  res.status(200).json({ data: product });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  res.status(200).json({ data: product });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findOneAndDelete({ _id: id });
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  res.status(204).json();
});
