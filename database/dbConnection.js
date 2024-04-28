import mongoose from "mongoose";
export const dbConnection=()=>{

    mongoose.connect(process.env.MONGO_URI,{
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
}