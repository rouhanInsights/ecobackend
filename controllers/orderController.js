const pool = require('../Db');

// Place order
const placeOrder = async (req, res) => {
  const { user_id, items } = req.body;

  try {
    // 1. Calculate total price
    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
    }

    // 2. Insert into orders
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *',
      [user_id, total]
    );
    const orderId = orderResult.rows[0].order_id;

    // 3. Insert items into order_items
    const insertPromises = items.map((item) => {
      return pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    });

    await Promise.all(insertPromises);

    res.status(201).json({ message: 'Order placed successfully', order_id: orderId });
  } catch (err) {
    console.error('Place Order Error:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

// Get all orders for a user
const getUserOrders = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(`
      SELECT
        o.order_id,
        o.order_date,
        o.total_price,
        o.status,
        json_agg(json_build_object(
          'product_id', p.product_id,
          'name', p.name,
          'image_url', p.image_url,
          'price', oi.price,
          'quantity', oi.quantity
        )) AS items
      FROM cust_orders o
      JOIN cust_order_items oi ON o.order_id = oi.order_id
      JOIN cust_products p ON oi.product_id = p.product_id
      WHERE o.user_id = $1
      GROUP BY o.order_id
      ORDER BY o.order_date DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error('Get Orders Error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};


module.exports = { placeOrder, getUserOrders };
