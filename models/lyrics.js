const mongoose = require("mongoose");

const lyrics = new mongoose.Schema(
    {
        file_name: String,
        lyrics: Object,
        size: Number,
        mimetype: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("lyrics", lyrics);
