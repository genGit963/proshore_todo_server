import mongoose from "mongoose";

const mongodbConnection = async () => {
    try {
        const dbResponse = await mongoose.connect(process.env.MONGODB_URL);
    } catch (error) {
        console.log("-->E: DBapi connect: \n", error);
        process.exit(1);
    }
};

export default mongodbConnection;
