import mongoose from 'mongoose';

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_CNN, {});

    const url = `${conn.connection.host}:${conn.connection.port}`;
    console.log(`MongoDB Connected: ${url}`);

  } catch (error) {
    console.error(`Error de conexión a MongoDB: ${error.message}`);
    process.exit(1); 
  }
};

export default dbConnection;
