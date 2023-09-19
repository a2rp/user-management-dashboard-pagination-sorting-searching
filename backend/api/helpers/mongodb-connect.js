const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DBNAME }).then(() => {
    console.log("connected to mongodb");
}).catch((error) => {
    console.log(`Error: ${error.message}`);
});

mongoose.connection.on("connected", () => {
    console.log("connected to database");
});

mongoose.connection.on("error", () => {
    console.log();
});

mongoose.connection.on("disconnected", () => {
    console.log("mongoose disconnected");
});

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
});
