const express = require('express');
const app = express();
require('dotenv').config()

const dbConfig = require("./config/dbConfig")
app.use(express.json());

app.use('/api/v1/user', require('./routes/userRoute'))
app.use("/api/v1/admin", require('./routes/adminRoute'));
app.use('/api/v1/doctor', require('./routes/doctorRoute'))

const port = process.env.PORT || 5000;
//start backend server by npm start server.js

app.listen(port, () => console.log(`Node server is running on port ${port}`))