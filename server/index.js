require('dotenv').config();

const express = require('express');
const cors = require('cors');
const router = require('./src/routes');

const app = express();
const PORT = 3030;

app.use(cors());
app.use(express.json());

app.use('/api/v1/', router);
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
