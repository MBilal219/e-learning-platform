import mongoose from "mongoose";
require("dotenv").config();

const dbURI: string = process.env.DB_URI || "";

const handleDBConnection = async () => {
  try {
    const data: any = await mongoose.connect(dbURI);
    console.log(`Database connected with ${data.connection.host}`);
  } catch (err: any) {
    console.error(err.message);
    setTimeout(handleDBConnection, 5000);
  }
};
export default handleDBConnection;
