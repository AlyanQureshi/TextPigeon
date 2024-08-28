const StreamChat = require('stream-chat').StreamChat;

require('dotenv').config();

const stream_api_key = process.env.STREAM_API_KEY;
const stream_secret = process.env.STREAM_SECRET;

// Function to grant admin role to a user
const grantAdmin = async (req, res) => {
    const client = StreamChat.getInstance(stream_api_key, stream_secret);
    try {
        const { userId } = req.body;

        // Update the user's role to 'admin'
        const response = await client.upsertUser({
            id: userId,
            role: 'admin'
        });

        res.status(200).json({ message: 'User granted admin role successfully', user: response });
    } catch (error) {
        console.error('Error granting admin role:', error);
        res.status(500).json({ message: 'Failed to grant admin role', error });
    }
};

// Function to revoke admin role from a user
const revokeAdmin = async (req, res) => {
    const client = StreamChat.getInstance(stream_api_key, stream_secret);
    try {
        const { userId } = req.body;

        // Revoke the user's admin role by setting it back to 'user'
        const response = await client.upsertUser({
            id: userId,
            role: 'user'
        });

        res.status(200).json({ message: 'Admin role revoked successfully', user: response });
    } catch (error) {
        console.error('Error revoking admin role:', error);
        res.status(500).json({ message: 'Failed to revoke admin role', error });
    }
};

module.exports = { grantAdmin, revokeAdmin };