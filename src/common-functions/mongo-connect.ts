import mongoose from "mongoose";

/**
 *connect_to_project_mongodb - this function connects to MongoDB, utilsing the mongoose module.
 */
export function connect_to_project_mongodb() {
  return new Promise(async function(resolve, reject) {
    console.log("Awaiting MongoDB connection");
    await mongoose.connect(process.env.project_MONGODB_DEV as string, {useNewUrlParser: true, useUnifiedTopology: true}, function(mongoose_connection_err) {
      const mongoose_api = mongoose.connection;
      if (!mongoose_connection_err) {
        console.log("Connected to MongoDB through Mongoose!");
        return resolve("connected");
      }
      console.log(mongoose_connection_err);
      return reject("Failed to to connect to MongoDB through Mongoose!");
    });
  });
}
