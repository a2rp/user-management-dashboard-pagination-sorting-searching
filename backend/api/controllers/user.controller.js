const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("node:crypto");
const UserModel = require("../models/user.model");
const { clearSessionCookie, setSessionCookie } = require("../helpers/session-cookie");

const ALLOWED_ROLES = new Set(["administrator", "editor", "viewer"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normalizeRole = (role) => role === "admin" ? "administrator" : role;

const publicUser = (user) => ({
    userid: user.userid,
    name: user.name,
    email: user.email,
    role: normalizeRole(user.role),
});

const login = async (req, res, next) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    try {
        const user = await UserModel.findOne({ email });
        const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;

        if (!passwordMatches) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({}, process.env.JWT_SECRET, {
            algorithm: "HS256",
            subject: user.id,
            expiresIn: "8h",
        });

        setSessionCookie(res, token);
        return res.json({ success: true, user: publicUser(user), message: "Login successful" });
    } catch (error) {
        return next(error);
    }
};

const getSession = (req, res) => res.json({ success: true, user: publicUser(req.user) });

const logout = (req, res) => {
    clearSessionCookie(res);
    return res.json({ success: true, message: "Logged out" });
};

const allUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find({})
            .select({ userid: 1, name: 1, email: 1, role: 1, _id: 0 })
            .sort({ name: 1, email: 1 })
            .lean();
        return res.json(users);
    } catch (error) {
        return next(error);
    }
};

const getOneUser = async (req, res, next) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (!email || !EMAIL_PATTERN.test(email)) {
        return res.status(400).json({ success: false, message: "A valid email is required" });
    }

    try {
        const user = await UserModel.findOne({ email }).select("userid name email role").lean();
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.json({ success: true, ...user });
    } catch (error) {
        return next(error);
    }
};

const addUser = async (req, res, next) => {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const { password, password_confirm: passwordConfirm, role } = req.body || {};

    if (!name || name.length > 100 || !EMAIL_PATTERN.test(email)) {
        return res.status(400).json({ success: false, message: "Enter a name and valid email address" });
    }
    if (typeof password !== "string" || Array.from(password).length < 12 || Buffer.byteLength(password) > 72) {
        return res.status(400).json({ success: false, message: "Password must be at least 12 characters and no more than 72 UTF-8 bytes" });
    }
    if (password !== passwordConfirm) {
        return res.status(400).json({ success: false, message: "Passwords do not match" });
    }
    if (!ALLOWED_ROLES.has(role)) {
        return res.status(400).json({ success: false, message: "Select a valid role" });
    }

    try {
        const user = await UserModel.create({
            userid: `user${randomUUID().replaceAll("-", "").slice(0, 12)}`,
            name,
            email,
            password,
            role,
        });
        return res.status(201).json({ success: true, message: "User added successfully", user: publicUser(user) });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "A user with that email already exists" });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({ success: false, message: error.message });
        }
        return next(error);
    }
};

const updateUser = async (req, res, next) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const requestedRole = req.body?.role;

    if (!EMAIL_PATTERN.test(email) || !name || name.length > 100) {
        return res.status(400).json({ success: false, message: "Enter a valid email and name" });
    }

    try {
        const target = await UserModel.findOne({ email });
        if (!target) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const updates = { name };
        if (req.user.role === "administrator") {
            if (!ALLOWED_ROLES.has(requestedRole)) {
                return res.status(400).json({ success: false, message: "Select a valid role" });
            }
            if (target.id === req.user.id && requestedRole !== normalizeRole(target.role)) {
                return res.status(403).json({ success: false, message: "You cannot change your own role" });
            }
            updates.role = requestedRole;
        } else if (requestedRole !== normalizeRole(target.role)) {
            return res.status(403).json({ success: false, message: "Only administrators can change roles" });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(target.id, updates, {
            new: true,
            runValidators: true,
        });
        return res.json({ success: true, ...publicUser(updatedUser) });
    } catch (error) {
        return next(error);
    }
};

const deleteOneUser = async (req, res, next) => {
    const email = typeof req.params.email === "string" ? req.params.email.trim().toLowerCase() : "";
    if (!EMAIL_PATTERN.test(email)) {
        return res.status(400).json({ success: false, message: "A valid email is required" });
    }

    try {
        const target = await UserModel.findOne({ email });
        if (!target) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (target.id === req.user.id) {
            return res.status(403).json({ success: false, message: "You cannot delete your own account" });
        }
        await target.deleteOne();
        return res.json({ success: true, message: "User deleted" });
    } catch (error) {
        return next(error);
    }
};

module.exports = { login, getSession, logout, allUsers, getOneUser, addUser, updateUser, deleteOneUser };
