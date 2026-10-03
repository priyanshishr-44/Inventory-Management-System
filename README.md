# Inventory Management System

A RESTful backend application for managing products, inventory, stock, and inventory reports using Node.js, Express.js, MongoDB, and Mongoose.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- Thunder Client / REST API testing

## Features

- Create a new product
- Get all products
- Filter products by category and price range
- Sort products
- Pagination
- Get a single product by ID
- Update product details
- Delete a product
- Increase stock through restocking
- Decrease stock through sales
- Prevent sales when available stock is insufficient
- Low-stock report
- Category-wise inventory summary using MongoDB aggregation
- Field-level validation using Mongoose

## Project Structure

```text
Inventory-Management-System/
│
├── models/
│   └── Product.js
│
├── routes/
│   └── productRoutes.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
