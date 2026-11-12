const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        maxlength: 254,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type: String,
        required: true,
        minlength: 12,
        maxlength: 72,
    },
    role: {
        type: String,
        required: true,
        enum: ["administrator", "editor", "viewer"],
    },
}, { timestamps: true });

userSchema.pre("save", async function hashPassword() {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
});

module.exports = mongoose.model("user", userSchema);
