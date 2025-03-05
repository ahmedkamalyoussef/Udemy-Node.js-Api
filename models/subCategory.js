const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'name must be unique'],
        minlength: [3, 'name is too short'],
        maxlength: [32, 'name is too long']
    },
    slug: {
        type: String,
        lowercase: true
    },
    categoryId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'category id is required']
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('SubCategory', subCategorySchema);