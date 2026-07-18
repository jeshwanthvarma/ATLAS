require("dotenv").config();

const app = require("./app");
const { connectDatabase } = require("./config/database");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectDatabase();

        app.listen(PORT, () => {
            console.log("=======================================");
            console.log("🚀 ATLAS Backend Started");
            console.log(`🌐 Server : http://localhost:${PORT}`);
            console.log(`📦 Environment : ${process.env.NODE_ENV}`);
            console.log("=======================================");
        });
    } catch (error) {
        console.error("❌ Failed to start server:");
        console.error(error);
    }
}

startServer();