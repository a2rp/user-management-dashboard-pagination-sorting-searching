const mongoose = require("mongoose");

const connectToMongoDB = async () => {
    const { MONGODB_URI, MONGODB_DBNAME } = process.env;
    if (!MONGODB_URI || !MONGODB_DBNAME) {
        throw new Error("MONGODB_URI and MONGODB_DBNAME must be configured");
    }

    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DBNAME });
    console.log("Connected to MongoDB");
};

module.exports = { connectToMongoDB };
