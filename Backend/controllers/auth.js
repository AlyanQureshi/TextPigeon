const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');

require('dotenv').config();

const stream_app_id = process.env.STREAM_APP_ID;
const stream_api_key = process.env.STREAM_API_KEY;
const stream_secret = process.env.STREAM_SECRET;

const signup = async (req, res) => {
    try {
        const { fullName, username, password } = req.body;

        const userId = crypto.randomBytes(16).toString('hex');

        const serverClient = connect(stream_api_key, stream_secret, stream_app_id);

        const hashedPassword = await bcrypt.hash(password, 10);

        const token = serverClient.createUserToken(userId);

        res.status(200).json({ token, fullName, username, userId, hashedPassword });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const serverClient = connect(stream_api_key, stream_secret, stream_app_id);

        const client = StreamChat.getInstance(stream_api_key, stream_secret);

        const { users } = await client.queryUsers({ name: username });

        if(!users.length) 
            return res.status(400).json({ message: 'Username not found' });

        const success = await bcrypt.compare(password, users[0].hashedPassword);

        if (success) {
            const token = serverClient.createUserToken(users[0].id);

            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id});
        } else {
            res.status(500).json({ message: 'Incorrect password' });
        }
        
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error });
    }
}

module.exports = { signup, login };