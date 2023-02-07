const mongoose = require ("mongoose");

const connection = async() => {
    try{
        await mongoose.connect("mongodb://localhost:27017/my_socialnet");

        console.log("succesfully connected to db");

    }catch(error){
        
        console.log(error);
        throw new Error("Couldn't connect to db")

    }
}

module.exports= connection