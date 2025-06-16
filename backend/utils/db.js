import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://playerkevy23:playerkevy23@cluster0.ayfwc9f.mongodb.net/dreamdesk?retryWrites=true&w=majority";
        
        // Log the connection string (with password masked)
        const maskedUri = MONGO_URI.replace(
            /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
            'mongodb$1://$2:****@'
        );
        console.log('Attempting to connect to MongoDB with URI:', maskedUri);
        
        // Add connection options
        const options = {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        };
        
        const conn = await mongoose.connect(MONGO_URI, options);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log('Connection state:', mongoose.connection.readyState);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.error('Full error:', error);
        
        // Additional debugging information
        if (error.name === 'MongooseServerSelectionError') {
            console.error('\nPossible solutions:');
            console.error('1. Check if your IP address is whitelisted in MongoDB Atlas');
            console.error('2. Verify your username and password in the connection string');
            console.error('3. Make sure your MongoDB Atlas cluster is running');
            console.error('4. Check if your network allows MongoDB connections');
        }
        
        process.exit(1);
    }
}

export default connectDB;