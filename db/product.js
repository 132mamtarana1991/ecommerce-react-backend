const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    categories: String,
    title: String,
    price: String,
    rating: Number,
    detail: String,
    image: String
});

module.exports = mongoose.model("products", productSchema);