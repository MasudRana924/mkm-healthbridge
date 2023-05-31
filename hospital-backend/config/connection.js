const variables = require("./variables");
const mongoose = require("mongoose");
// mongoose.set('strictQuery', false);
const connectDatabase = () => {
    mongoose.connect(variables.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("connected");
    }).catch((e)=>{
        console.log(e);
    });
};
module.exports = connectDatabase;