const mongoose = require('mongoose'); 
const connectToDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI); 
        console.log('Connected successfully');

    }catch(error){
        console.error('Failed to connect to the database',error)
        process.exit(1); 
    }
}; 
module.exports = connectToDb; 