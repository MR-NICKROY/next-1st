import mongoose from "mongoose";
const ConnectDB = async () => {
  await mongoose
    .connect(
      "mongodb://blog:blog@cluster0-shard-00-00.oi02y.mongodb.net:27017,cluster0-shard-00-01.oi02y.mongodb.net:27017,cluster0-shard-00-02.oi02y.mongodb.net:27017/?ssl=true&replicaSet=atlas-icbzeg-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
      console.log("Mongodb Connected.");
    })
    .catch((err) => {
      console.log(err);
    });
};
export default ConnectDB;
