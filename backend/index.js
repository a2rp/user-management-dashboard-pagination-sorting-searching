require("dotenv").config();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const helmet = require("helmet");
const { connectToMongoDB } = require("./api/helpers/mongodb-connect");

const app = express();
const allowedOrigins = new Set(
    (process.env.FRONTEND_ORIGINS || "http://localhost:3000")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
);

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Origin is not allowed"));
    },
    credentials: true,
}));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(cookieParser());
app.use((req, res, next) => {
    const origin = req.get("origin");
    if (["GET", "HEAD", "OPTIONS"].includes(req.method) || !origin || allowedOrigins.has(origin)) {
        return next();
    }
    return res.status(403).json({ success: false, message: "Origin is not allowed" });
});

app.use("/api/v1", require("./api/routes/test.route"));
app.use("/api/v1", require("./api/routes/user.route"));

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    if (error.message === "Origin is not allowed") {
        return res.status(403).json({ success: false, message: "Origin is not allowed" });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: "An unexpected server error occurred" });
});

const start = async () => {
    if (typeof process.env.JWT_SECRET !== "string" || Buffer.byteLength(process.env.JWT_SECRET) < 32) {
        throw new Error("JWT_SECRET must be set to a random value with at least 32 bytes");
    }

    await connectToMongoDB();
    const port = Number(process.env.PORT) || 1198;
    const server = app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });

    const stop = async () => {
        server.close(async () => {
            const mongoose = require("mongoose");
            await mongoose.connection.close();
            process.exit(0);
        });
    };

    process.on("SIGINT", stop);
    process.on("SIGTERM", stop);
};

start().catch((error) => {
    console.error(`Server startup failed: ${error.message}`);
    process.exitCode = 1;
});
