const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    name: {
        type: String,
        unique: [true, "name không được trùng"],
        required: [true, "name là bắt buộc"]
    },
    description: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('role', roleSchema);
