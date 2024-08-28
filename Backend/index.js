const express = require('express');
const cors = require('cors');
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

app.use('/auth', authRoutes);
app.use('/friends', friendRoutes);
app.use('/admin', adminRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));