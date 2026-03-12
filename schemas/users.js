const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username không được trùng"],
        required: [true, "username là bắt buộc"]
    },
    password: {
        type: String,
        required: [true, "password là bắt buộc"]
    },
    email: {
        type: String,
        unique: [true, "email không được trùng"],
        required: [true, "email là bắt buộc"]
    },
    fullName: {
        type: String,
        default: ""
    },
    avatarUrl: {
        type: String,
        default: "https://i.sstatic.net/l60Hf.png"
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: mongoose.Types.ObjectId,
        ref: 'role'
    },
    loginCount: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('user', userSchema);
