const Pool = require("pg").Pool;

require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// find out whether receiver exists if not send an error message if exists get the id
// find the id of the sender and put the "{sender_id}," in the reciever incoming friend requests
const friendRequest = async (req, res) => {
    const client = await pool.connect();

    try {
        const { sender_username, receiver_username } = req.body;

        const receiver_id = await client.query('SELECT id FROM pigeons WHERE username = $1', [receiver_username]);
        if (receiver_id.rows.length > 0 ) {
            const sender_id = await client.query('SELECT id FROM pigeons WHERE username = $1', [sender_username]);
            let senders_id = sender_id.rows[0].id;
            let sender_string_id = `${senders_id},`;
            let receivers_id = receiver_id.rows[0].id;

            // Checking whether sender has already friend requested them
            const friend_request_verification = await client.query('SELECT incoming_friend_ids FROM pigeons where id = $1', [receivers_id]);
            if (friend_request_verification.rows.length > 0 && friend_request_verification.rows[0].incoming_friend_ids != null) {
                let verification_string = friend_request_verification.rows[0].incoming_friend_ids;
                verification_string = verification_string.slice(0, -1);

                // Convert the string to an array
                let existing_ids = verification_string.split(',');

                // Check if the sender's ID already exists in the array
                if (existing_ids.includes(senders_id.toString())) {
                    return res.status(400).json({ message: 'Friend request already sent.' });
                }
            }

            // Checking whether sender is already friends
            const friend_verification = await client.query('SELECT friend_ids FROM pigeons where id = $1', [receivers_id]);
            if (friend_verification.rows.length > 0 && friend_verification.rows[0].friend_ids != null) {
                let verification_string = friend_verification.rows[0].friend_ids;

                verification_string = verification_string.slice(0, -1);

                // Convert the string to an array
                let existing_ids = verification_string.split(',');

                // Check if the sender's ID already exists in the array
                if (existing_ids.includes(senders_id.toString())) {
                    return res.status(400).json({ message: 'You are already friends with this user.' });
                }
            }
            
            // Append the sender's ID to the receiver's friend_requests field
            await client.query(
                'UPDATE pigeons SET incoming_friend_ids = COALESCE(incoming_friend_ids, \'\') || $1 WHERE id = $2',
                [sender_string_id, receivers_id]
            );

            return res.status(200).json({ message: 'Friend request sent successfully.' });
        } else {
            return res.status(400).json({ message: 'Username does not exist.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error.' });
    } finally {
        client.release();
    }
}

const getFriendRequests = async (req, res) => {
    const client = await pool.connect();
    try {
        const { username } = req.body;
        let usernames = [];

        const friendRequest_ids = await client.query('SELECT incoming_friend_ids FROM pigeons WHERE username = $1', [username]);
        if (friendRequest_ids.rows[0].incoming_friend_ids != null) {
            let ids = friendRequest_ids.rows[0].incoming_friend_ids;
            ids = ids.slice(0, -1);
            let request_ids = ids.split(',');

            // Using for...of to properly handle async operations
            for (const element of request_ids) {
                let db_username = await client.query('SELECT username FROM pigeons WHERE id = $1', [element]);
                usernames.push(db_username.rows[0].username);
            }

            res.status(200).json({ names_arr: usernames });
        } else {
            res.status(200).json({ names_arr: usernames });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error.' });
    } finally {
        client.release();
    }
}

module.exports = { friendRequest, getFriendRequests };
