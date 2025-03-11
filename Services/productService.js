const Product = require("../models/product");
const factoryHandlers = require("./factoryHandlers");

exports.getProducts = factoryHandlers.getAll(Product, "products");

exports.createProduct = factoryHandlers.createOne(Product);

exports.getProductById = factoryHandlers.getById(Product);

exports.updateProduct = factoryHandlers.updateOne(Product);

exports.deleteProduct = factoryHandlers.deleteOne(Product);
