import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";


const main = async () => {
  try {
    await mongoose.connect(config.mongooose_uri as string);
    app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (err: any) {
    console.log(err);
  }
};

main();