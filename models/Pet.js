const db = require('../database/database');

class Pet {
    static async findAll() {
        const pool = await db;
        const [rows] = await pool.execute(
            'SELECT * FROM pets'
        );
        return rows;
    }

    static async findById(id) {
        const pool = await db;
        const [rows] = await pool.execute(
            'SELECT * FROM pets WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async create({ name, species, breed, age, description, image, status = 'available' }) {
        const pool = await db;
        const [result] = await pool.execute(
            'INSERT INTO pets (name, species, breed, age, description, image, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, species, breed, age, description, image, status]
        );
        return result.insertId;
    }

    static async update(id, { name, species, breed, age, description, image, status }) {
        const pool = await db;
        await pool.execute(
            'UPDATE pets SET name = ?, species = ?, breed = ?, age = ?, description = ?, image = ?, status = ? WHERE id = ?',
            [name, species, breed, age, description, image, status, id]
        );
    }

    static async delete(id) {
        const pool = await db;
        await pool.execute(
            'DELETE FROM pets WHERE id = ?',
            [id]
        );
    }

    static async search({ species, breed, age, status }) {
        const pool = await db;
        let query = 'SELECT * FROM pets WHERE 1=1';
        const params = [];

        if (species) {
            query += ' AND species = ?';
            params.push(species);
        }
        if (breed) {
            query += ' AND breed = ?';
            params.push(breed);
        }
        if (age) {
            query += ' AND age = ?';
            params.push(age);
        }
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        const [rows] = await pool.execute(query, params);
        return rows;
    }
}

module.exports = Pet;