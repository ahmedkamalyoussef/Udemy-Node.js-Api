const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        minlength: [3, 'Product title is too short'],
        maxlength: [128, 'Product title is too long'],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        minlength: [20, 'Product description is too short'],
        maxlength: [512, 'Product description is too long']
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
        min: 1
    },
    sold: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        trim: true
    },
    discountPrice: {
        type: Number,
    },
    colors: [String],
    images: [String],
    imageCover: {
        type: String,
        required: [true, 'Product cover image is required']
    },

    categoryId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required']
    },
    subCategories: [{
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory'
    }],
    brandId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand'
    },
    ratingAverage: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
    },
    ratingQuantity: {
        type: Number,
        default: 0
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema);