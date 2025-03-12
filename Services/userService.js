const factoryHandlers = require("./factoryHandlers");
const User = require("../models/user");

exports.createUser = factoryHandlers.createOne(User);

exports.getUsers = factoryHandlers.getAll(User);

exports.getUserById = factoryHandlers.getById(User);

exports.updateUser = factoryHandlers.updateOne(User);

exports.deleteUser = factoryHandlers.deleteOne(User);
