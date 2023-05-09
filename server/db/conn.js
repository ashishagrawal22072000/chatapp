const mongoose = require("mongoose");
const logger  = require("../logger")
mongoose.connect(process.env.DATABASE_URL).then(() =>{
    logger.log("info", "Connected to mongoDB");
}).catch((err) =>{
    logger.log("error", err.message);
})
