const slugify = require('slugify');
const ApiError = require('../Utils/ApiError');
const asyncHandler = require('express-async-handler');
const Brand = require('../models/brand');
const ApiFeatures = require("../Utils/apiFeatures");

exports.createBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const brand = await Brand.create({ name, slug: slugify(name) });
    res.status(201).json({ data: brand });
 })

exports.getBrands = asyncHandler(async (req, res) => {
    const features = new ApiFeatures(Brand.find(), req.query)
      .filter()
      .search()
      .limitFields()
      .sort();

    // Apply pagination after filtering and searching
    await features.paginate();

    const { mongooseQuery, paginationResults } = features;
    const brands = await mongooseQuery;

    res.status(200).json({
      count: brands.length,
      result: paginationResults,
      data: brands,
    });
 })

exports.getBrandById = asyncHandler(async (req, res,next) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand)
        return next(new ApiError('Brand not found', 404));
    res.status(200).json({ data: brand });
 })

exports.updateBrand = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const { name } = req.body;
    const brand = await Brand.findOneAndUpdate({ _id: id }, { name: name, slug: slugify(name) }, { new: true });
    if (!brand)
        return next(new ApiError('Brand not found', 404));
    res.status(200).json({ data: brand });
 })

exports.deleteBrand = asyncHandler(async (req, res,next) => {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand)
        return next(new ApiError('Brand not found', 404));
    res.status(204).json({ msg: 'Brand deleted successfully' });
 })