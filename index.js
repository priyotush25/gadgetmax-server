const express = require('express');
const connectDB = require('./src/config/db');
require('dotenv').config();
const cors = require("cors");
const auth = require("./src/routes/Auth")

const port = process.env.PORT || 400;

const app = express();
app.use(express.json());
app.use(cors());


// mongodb connect 
connectDB();


// routes
app.use("/api/auth", auth);

app.get('/', (req, res)=>{
    res.send("Server is running")
})

app.listen(port, ()=>{
    console.log(`server is running ${port}`);
})
