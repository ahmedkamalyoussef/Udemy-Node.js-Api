const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'category name is required'],
        unique: [true, 'the name must be unique'],
        minLength: [3, 'the is too short'],
        maxLingth: [32, 'the name is too long']
    },
    slug: {
        type: String,
        lowercase: true
    },
    image:String,
},
    { timestamps: true }
);
const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;