const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');
const Pool = require("pg").Pool;

require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });

const stream_app_id = process.env.STREAM_APP_ID;
const stream_api_key = process.env.STREAM_API_KEY;
const stream_secret = process.env.STREAM_SECRET;

// implement email verification system with a database that can verify if users have not been logged in before
const signup = async (req, res) => {
    const client = await pool.connect();
    try {
        const { fullName, username, password, email } = req.body;

        // Check if email already exists
        const result_email = await client.query('SELECT * FROM pigeons WHERE email = $1', [email]);
        if (result_email.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // Check if username already exists
        const result_username = await client.query('SELECT * FROM pigeons WHERE username = $1', [username]);
        if (result_username.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        // Insert new user into the database
        await client.query(
            'INSERT INTO pigeons (username, email) VALUES ($1, $2)', 
            [username, email]
        );  

        const userId = crypto.randomBytes(16).toString('hex');
        const hashedPassword = await bcrypt.hash(password, 10);

        const serverClient = connect(stream_api_key, stream_secret, stream_app_id);
        const token = serverClient.createUserToken(userId);

        res.status(200).json({ token, fullName, username, userId, hashedPassword });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error });
    } finally {
        // Release the client back to the pool
        client.release();
    }
}

const login = async (req, res) => {
    const db_client = await pool.connect();
    try {
        const { username_email, password } = req.body;

        const result_username = await db_client.query('SELECT username FROM pigeons WHERE email = $1', [username_email]);
        let username = ""

        if (result_username.rows.length == 1) {
            username = result_username.rows[0].username;

            const serverClient = connect(stream_api_key, stream_secret, stream_app_id);

            const client = StreamChat.getInstance(stream_api_key, stream_secret);
            const { users } = await client.queryUsers({ name: username });

            const success = await bcrypt.compare(password, users[0].hashedPassword);

            if (success) {
                const token = serverClient.createUserToken(users[0].id);

                res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id});
            } else {
                res.status(500).json({ message: 'Incorrect password.' });
            }
        } else {
            username = username_email

            const serverClient = connect(stream_api_key, stream_secret, stream_app_id);

            const client = StreamChat.getInstance(stream_api_key, stream_secret);

            const { users } = await client.queryUsers({ name: username });

            if(!users.length) 
                return res.status(400).json({ message: 'Username or Email not found.' });

            const success = await bcrypt.compare(password, users[0].hashedPassword);

            if (success) {
                const token = serverClient.createUserToken(users[0].id);

                res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id});
            } else {
                res.status(500).json({ message: 'Incorrect password.' });
            }
        }
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error });
    } finally {
        db_client.release();
    }
}

module.exports = { signup, login };