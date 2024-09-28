import mongoose from "mongoose";

const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    const dbName = connection.connections[0].name;
    console.log(`Database connected: ${dbName.toUpperCase()}`);
}

export default connectDB