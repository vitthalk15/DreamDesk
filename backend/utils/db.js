import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        
        // Log the connection string (with password masked)
        const maskedUri = process.env.MONGO_URI.replace(
            /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
            'mongodb$1://$2:****@'
        );
        console.log('Attempting to connect to MongoDB with URI:', maskedUri);
        
        // Add connection options
        const options = {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        };
        
        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log('Connection state:', mongoose.connection.readyState);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.error('Full error:', error);
        console.error('Environment variables:', {
            MONGO_URI: process.env.MONGO_URI ? 'defined' : 'undefined',
            NODE_ENV: process.env.NODE_ENV
        });
        
        // Additional debugging information
        if (error.name === 'MongooseServerSelectionError') {
            console.error('\nPossible solutions:');
            console.error('1. Check if your IP address is whitelisted in MongoDB Atlas');
            console.error('2. Verify your username and password in the connection string');
            console.error('3. Make sure your MongoDB Atlas cluster is running');
            console.error('4. Check if your network allows MongoDB connections');
            console.error('\nConnection details:');
            console.error('- Username: playerkevy23');
            console.error('- Cluster: cluster0.yesfmay.mongodb.net');
            console.error('- Database: dreamdesk');
        }
        
        process.exit(1);
    }
}

export default connectDB;