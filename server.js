const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/products", productRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`URL: http://localhost:${PORT}`);
            
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });
