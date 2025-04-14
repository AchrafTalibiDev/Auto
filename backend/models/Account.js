import pool from "../database/db.js";

export const getAccounts = async () => {
    const res = await pool.query('SELECT id, email, password, secret2fa, proxy FROM accounts');
    return res.rows;
};


