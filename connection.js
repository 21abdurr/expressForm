import mongoose from 'mongoose';
import dotenv from 'dotenv';

const env = dotenv.config().parsed



const connection = () => {
    //mongoose
    mongoose.connect(env.MONGODB_URI, {
        dbName: env.MONGODB_NAME

    })
    const connection = mongoose.connection
    connection.on('error', console.error.bind(console, 'connection error'))
    connection.once('open', () => {
        console.log(`Database connected : ${env.MONGODB_NAME} `)
    })
}

export default connection