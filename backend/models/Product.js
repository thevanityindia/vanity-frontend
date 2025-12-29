const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Keeping ID for compatibility with existing frontend logic
    brand: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true }, // Now required for better organization
    subcategory: { type: String }, // Optional subcategory
    description: { type: String }
});

module.exports = mongoose.model('Product', productSchema);
