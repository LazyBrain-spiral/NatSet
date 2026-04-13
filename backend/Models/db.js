const mongoose = require("mongoose");

const mongo_url = process.env.MONGO_CONN;

mongoose
  .connect(mongo_url)
  .then(() => {
    console.log("mongodb is connected!");
  })
  .catch((err) => {
    console.log(`mongo db couldnt be connected error message: ${err}`);
  });
