const ApiError = require("../Utils/ApiError");
const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../Utils/apiFeatures");

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getById = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) return next(new ApiError("document not found", 404));
    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    const features = new ApiFeatures(Model.find(), req.query)
      .filter(req.filter)
      .search(modelName)
      .limitFields()
      .sort();

    // Apply pagination after filtering and searching
    await features.paginate();

    const { mongooseQuery, paginationResults } = features;
    const documents = await mongooseQuery;

    res.status(200).json({
      count: documents.length,
      result: paginationResults,
      data: documents,
    });
  });
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) return next(new ApiError("document not found", 404));
    res.status(200).json({ data: document });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) return next(new ApiError("document not found", 404));
    res.status(204).json({ msg: "document deleted successfully" });
  });
