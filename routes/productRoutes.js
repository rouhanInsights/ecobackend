const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');
const pool=require("../Db")

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,search,
} = require('../controllers/productController');

// Public Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/search',search);


// Admin Routes
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
//Category

router.get('/category', async (req, res) => {
  const { name } = req.query;
  console.log("Received category name:", name); // ✅ Debug log

  try {
    const result = await pool.query(
      `SELECT p.*
       FROM cust_products p
       JOIN categories c ON p.category_id = c.category_id
       WHERE c.category_name ILIKE $1`, // ✅ Use correct column name
      [name]
      
    );
    console.log(name);
    if (!Array.isArray(result.rows)) {
      return res.status(500).json({ error: "Query result is not an array" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Category fetch error:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});
module.exports = router;
