const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const ApiError = require("../Utils/ApiError");

exports.getProducts = asyncHandler(async (req, res) => {
  //   const queryString = { ...req.query };
  //   const excludesFields = ["page", "limit", "sort", "fields"];
  //   excludesFields.forEach((field) => delete queryString[field]);
  //   let expresion = JSON.stringify(queryString);
  //   expresion = expresion.replace(
  //     /\b(gt|gte|lt|lte|in)\b/g,
  //     (match) => `$${match}`
  //   );
  //   console.log(expresion);
  if (!req.query.minPrice) req.query.minPrice = 1;
  if (!req.query.maxPrice) req.query.maxPrice = Number.MAX_SAFE_INTEGER;
  if (!req.query.minRating) req.query.minRating = 1;
  if (!req.query.maxRating) req.query.maxRating = 5;
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 2;
  const skip = (page - 1) * limit;
  let mongooseQuery = Product.find({
    price: { $gte: req.query.minPrice, $lte: req.query.maxPrice },
    ratingAverage: { $gte: req.query.minRating, $lte: req.query.maxRating },
  })
    .skip(skip)
    .limit(limit)
    .populate({ path: "categoryId", select: "name" });
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort("-createdAt");
  }
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select("-__v");
    }
  if (req.query.keywords) {
      let query = {};
      query.$or = [
        { title: { $regex: req.query.keywords, $options: "i" } },
        { description: { $regex: req.query.keywords, $options: "i" } },
      ];
    mongooseQuery = mongooseQuery.find(query);
  } 
    

  const products = await mongooseQuery;
  res
    .status(200)
    .json({ results: products.length, page: page, data: products });
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
