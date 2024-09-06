const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require("./routes/auth.js");
const friendRoutes = require("./routes/friends.js");
const adminRoutes = require("./routes/admin.js");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/admin', adminRoutes);


// Serve static files only in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React app build directory
    app.use(express.static(path.join('/home/ec2-user/apps/text-app/textpigeon/build')));

    // Fallback route for non-API requests, which will serve your React app
    app.get('*', (req, res) => {
        res.sendFile(path.resolve('/home/ec2-user/apps/text-app/textpigeon/build', 'index.html'));
    });
}


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));