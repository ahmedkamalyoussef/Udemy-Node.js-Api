const factoryHandlers = require("./factoryHandlers");
const Brand = require("../models/brand");


exports.createBrand = factoryHandlers.createOne(Brand);

exports.getBrands = factoryHandlers.getAll(Brand);

exports.getBrandById = factoryHandlers.getById(Brand);

exports.updateBrand = factoryHandlers.updateOne(Brand);

exports.deleteBrand = factoryHandlers.deleteOne(Brand);
