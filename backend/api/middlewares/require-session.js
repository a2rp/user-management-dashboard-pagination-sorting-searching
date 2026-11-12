const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const { COOKIE_NAME } = require("../helpers/session-cookie");

const requireSession = async (req, res, next) => {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
        return res.status(401).json({ success: false, message: "Please sign in" });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    } catch {
        return res.status(401).json({ success: false, message: "Your session has expired. Please sign in again" });
    }

    try {
        const user = await UserModel.findById(decoded.sub).select("userid name email role");
        if (!user) {
            return res.status(401).json({ success: false, message: "Please sign in" });
        }
        if (user.role === "admin") {
            user.role = "administrator";
        }
        req.user = user;
        return next();
    } catch (error) {
        return next(error);
    }
};

const requireRoles = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role === "admin" ? "administrator" : req.user.role)) {
        return res.status(403).json({ success: false, message: "You do not have permission to do that" });
    }
    return next();
};

module.exports = { requireSession, requireRoles };
