import db from '../config/db.js';
import bcrypt from 'bcrypt';

class userModel {
    constructor(userData) {
        if (!userData || !userData.username || !userData.email || !userData.password || !userData.first_name) {
            throw new Error('Invalid user data');
        }
        this.first_name = userData.first_name;
        this.last_name  = userData.last_name;
        this.username   = userData.username;
        this.email      = userData.email;
        this.password   = userData.password;
    }

    async save() {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        const sql = 'INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.query(sql, [this.first_name, this.last_name, this.username, this.email, hashedPassword], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.insertId);
            });
        });
    }

    static async findById(userId) {
        const sql = 'SELECT * FROM users WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [userId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0]); // Assuming there's only one user with the given ID
            });
        });
    }

    static async findOne(object) {
        const { key, value } = object;
        const sql = `SELECT * FROM users WHERE ${key} = ?`;
        return new Promise((resolve, reject) => {
            db.query(sql, [value], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0]); // Assuming there's only one user with the given criteria
            });
        });
    }
    

    static async getAllUsers() {
        const sql = 'SELECT * FROM users';
        return new Promise((resolve, reject) => {
            db.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static async updateUserById(userId, updatedUserData) {
        const { username, email, password } = updatedUserData;
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [username, email, hashedPassword, userId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.affectedRows > 0);
            });
        });
    }

    static async deleteUserById(userId) {
        const sql = 'DELETE FROM users WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [userId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.affectedRows > 0);
            });
        });
    }
}

export default userModel;
