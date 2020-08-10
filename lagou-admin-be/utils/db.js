var mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/lagouadmin");


mongoose.connection.on("error", (error) => {
    console.log(error);
});

mongoose.connection.once("open", () => {
    console.log("database open...");
});


module.exports = mongoose;