const mongoose = require('mongoose')

//function to connect to database
const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log(`MongoDB connected at host: ${conn.connection.host}`)
    } catch(err) {
        console.log(err)
        process.exit(1)
    }
}

export default connectDB