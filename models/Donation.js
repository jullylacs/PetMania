const db = require('../database/database');

class Donation {
    static async findAll() {
        const pool = await db;
        const [rows] = await pool.execute(
            `SELECT d.*, u.name as donor_name 
             FROM donations d 
             LEFT JOIN users u ON d.user_id = u.id`
        );
        return rows;
    }

    static async create({ userId, amount, paymentMethod, status = 'pending' }) {
        const pool = await db;
        const [result] = await pool.execute(
            'INSERT INTO donations (user_id, amount, payment_method, status, created_at) VALUES (?, ?, ?, ?, NOW())',
            [userId, amount, paymentMethod, status]
        );
        return result.insertId;
    }

    static async updateStatus(id, status) {
        const pool = await db;
        await pool.execute(
            'UPDATE donations SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, id]
        );
    }

    static async findById(id) {
        const pool = await db;
        const [rows] = await pool.execute(
            `SELECT d.*, u.name as donor_name 
             FROM donations d 
             LEFT JOIN users u ON d.user_id = u.id 
             WHERE d.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async getMonthlyTotal() {
        const pool = await db;
        const [rows] = await pool.execute(
            `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, 
             SUM(amount) as total 
             FROM donations 
             WHERE status = 'completed' 
             GROUP BY DATE_FORMAT(created_at, '%Y-%m') 
             ORDER BY month DESC 
             LIMIT 12`
        );
        return rows;
    }
}

module.exports = Donation;