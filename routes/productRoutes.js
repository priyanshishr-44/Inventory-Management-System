const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Create Product
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create product",
      error: error.message
    });
  }
});

// Get All Products - Filtering, Sorting & Pagination
router.get("/", async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sortBy,
      order = "asc",
      page = 1,
      limit = 5
    } = req.query;

    // Filtering
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Sorting
    const sort = {};

    if (sortBy) {
      sort[sortBy] = order === "desc" ? -1 : 1;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      message: "Products fetched successfully",
      currentPage: Number(page),
      totalProducts,
      totalPages: Math.ceil(totalProducts / Number(limit)),
      products
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message
    });
  }
});

// Low Stock Report
router.get("/reports/low-stock", async (req, res) => {
  try {
    const products = await Product.find({
      quantity: { $lte: 5 }
    });

    res.status(200).json({
      message: "Low stock report generated successfully",
      count: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to generate low stock report",
      error: error.message
    });
  }
});

// Category-wise Inventory Summary
router.get("/reports/category-summary", async (req, res) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalInventoryValue: {
            $sum: {
              $multiply: ["$price", "$quantity"]
            }
          }
        }
      },
      {
        $sort: {
          totalInventoryValue: -1
        }
      }
    ]);

    res.status(200).json({
      message: "Category-wise inventory summary generated successfully",
      summary
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to generate category summary",
      error: error.message
    });
  }
});

// Get Single Product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product
    });

  } catch (error) {
    res.status(400).json({
      message: "Invalid product ID",
      error: error.message
    });
  }
});

// Update Product Details
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    res.status(400).json({
      message: "Failed to update product",
      error: error.message
    });
  }
});

// Adjust Stock
router.patch("/:id/stock", async (req, res) => {
  try {
    const { type, quantity } = req.body;

    if (!["restock", "sale"].includes(type)) {
      return res.status(400).json({
        message: "Type must be restock or sale"
      });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0"
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    if (type === "restock") {
      product.quantity += Number(quantity);
    }

    if (type === "sale") {
      if (product.quantity < Number(quantity)) {
        return res.status(400).json({
          message: "Insufficient stock"
        });
      }

      product.quantity -= Number(quantity);
    }

    await product.save();

    res.status(200).json({
      message: `Stock ${type} successful`,
      product
    });

  } catch (error) {
    res.status(400).json({
      message: "Stock adjustment failed",
      error: error.message
    });
  }
});

// Delete Product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product
    });

  } catch (error) {
    res.status(400).json({
      message: "Failed to delete product",
      error: error.message
    });
  }
});

// Delete Product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product
    });

  } catch (error) {
    res.status(400).json({
      message: "Failed to delete product",
      error: error.message
    });
  }
});

module.exports = router;