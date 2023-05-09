const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
const app = express();
const router = require("./router/router")
require("dotenv").config();
require("./db/conn")
app.use(cors())
require("./logger");
app.use(express.json());
app.use('/api/v1', router)
app.listen(process.env.PORT, () =>{
    console.log("Server started on port " + process.env.PORT);
})