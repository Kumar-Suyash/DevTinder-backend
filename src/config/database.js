const mongoose = require("mongoose");

const connectDB = async () =>{
    await mongoose.connect(
        "mongodb+srv://ksuyash001_db_user:2NQDMSKKaRWEnJtb@cluster1.5pernik.mongodb.net/devTinder"
    );
}

module.exports = connectDB

