import mongoose from "mongoose";

export function connect_to_alacrity_mongodb() {
   return new Promise(async function (resolve, reject) { 
       console.log("Awaiting MongoDB connection")
        await mongoose.connect(process.env.ALACRITY_MONGODB_DEV as string, { useNewUrlParser: true, useUnifiedTopology: true}, function (mongoose_connection_err) {
            let mongoose_api = mongoose.connection;
            if (!mongoose_connection_err) {
                console.log("Connected to MongoDB through Mongoose!");
                return resolve("connected");
            }
            console.log(mongoose_connection_err);
            return reject("Failed to to connect to MongoDB through Mongoose!");
        });
    });
}