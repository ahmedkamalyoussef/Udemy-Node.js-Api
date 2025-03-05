const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'brand name is required'],
        unique: [true, 'the name must be unique'],
        minlength: [3, 'the name is too short'],
        maxLingth: [32, 'the name is too long']
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: String
});

module.exports =mongoose.model('Brand', brandSchema);