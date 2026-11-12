require("dotenv").config();

const { randomUUID } = require("node:crypto");
const mongoose = require("mongoose");
const UserModel = require("../api/models/user.model");
const { connectToMongoDB } = require("../api/helpers/mongodb-connect");

const run = async () => {
    const name = process.env.INITIAL_ADMIN_NAME?.trim();
    const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.INITIAL_ADMIN_PASSWORD;

    if (!name || !email || !password) {
        throw new Error("Set INITIAL_ADMIN_NAME, INITIAL_ADMIN_EMAIL, and INITIAL_ADMIN_PASSWORD before creating the first administrator");
    }
    if (name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Enter a valid administrator name and email");
    }
    if (Array.from(password).length < 12 || Buffer.byteLength(password) > 72) {
        throw new Error("The administrator password must be at least 12 characters and no more than 72 UTF-8 bytes");
    }

    await connectToMongoDB();
    const existingAdministrator = await UserModel.exists({ role: { $in: ["administrator", "admin"] } });
    if (existingAdministrator) {
        throw new Error("An administrator already exists; use the dashboard to manage accounts");
    }

    await UserModel.create({
        userid: `user${randomUUID().replaceAll("-", "").slice(0, 12)}`,
        name,
        email,
        password,
        role: "administrator",
    });
    console.log(`Created initial administrator account for ${email}`);
};

run()
    .catch((error) => {
        console.error(`Admin setup failed: ${error.message}`);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.connection.close();
    });
