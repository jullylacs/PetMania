const db = require('../database/database');

class Adoption {
    static async findAll() {
        const pool = await db;
        const [rows] = await pool.execute(
            `SELECT a.*, p.name as pet_name, u.name as user_name 
             FROM adoptions a 
             JOIN pets p ON a.pet_id = p.id 
             JOIN users u ON a.user_id = u.id`
        );
        return rows;
    }

    static async findByUser(userId) {
        const pool = await db;
        const [rows] = await pool.execute(
            `SELECT a.*, p.name as pet_name, p.image as pet_image 
             FROM adoptions a 
             JOIN pets p ON a.pet_id = p.id 
             WHERE a.user_id = ?`,
            [userId]
        );
        return rows;
    }

    static async create({ userId, petId, status = 'pending' }) {
        const pool = await db;
        const [result] = await pool.execute(
            'INSERT INTO adoptions (user_id, pet_id, status, created_at) VALUES (?, ?, ?, NOW())',
            [userId, petId, status]
        );
        return result.insertId;
    }

    static async updateStatus(id, status) {
        const pool = await db;
        await pool.execute(
            'UPDATE adoptions SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, id]
        );
    }

    static async findById(id) {
        const pool = await db;
        const [rows] = await pool.execute(
            `SELECT a.*, p.name as pet_name, u.name as user_name 
             FROM adoptions a 
             JOIN pets p ON a.pet_id = p.id 
             JOIN users u ON a.user_id = u.id 
             WHERE a.id = ?`,
            [id]
        );
        return rows[0];
    }
}

module.exports = Adoption;