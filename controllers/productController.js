const pool = require('../Db');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cust_products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get single product
const getProductById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM cust_products WHERE product_id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Create new product
const createProduct = async (req, res) => {
  const { name, description, price, stock_quantity, category_id, image_url } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO cust_products (name, description, price, stock_quantity, category_id, image_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, price, stock_quantity, category_id, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create Product Error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, description, price, stock_quantity, category_id, image_url } = req.body;
  try {
    const result = await pool.query(
      `UPDATE cust_products
       SET name = $1, description = $2, price = $3, stock_quantity = $4, category_id = $5, image_url = $6
       WHERE product_id = $7 RETURNING *`,
      [name, description, price, stock_quantity, category_id, image_url, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM cust_products WHERE product_id = $1', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
//Search Products
const search = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
    const queryText =  await pool`SELECT * FROM cust_products WHERE name ILIKE $1;`;
    const values = [`%${q}%`];

    console.log("Executing Query:", queryText, "with values:", values); // 🔍 Debugging
    const result = await pool.query(queryText, values);

    console.log("Database Response:", result.rows); // 🔍 Debugging

    res.json(result.rows);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Failed to search products" });
  }
};


module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  search
};
