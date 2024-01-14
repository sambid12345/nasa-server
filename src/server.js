require("dotenv").config();
const PORT = process.env.PORT;
const mongoUrl = process.env.MONGO_URL;

const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { url } = require("inspector");
const planetsModel = require("../src/models/planets.model");
const launchesModel = require("../src/models/launches.model");

const server = http.createServer(app);

async function startServer() {
  try {
    const start = new Date().getTime();
    await mongoose.connect(mongoUrl);
    console.log("DB connected!");

    // below code is only needed once to insert palnets data from out local csv file to our DB collection
    // await planetsModel.insertDataToDB();
    // console.log(
    //   `planets data inserted into DB in${new Date().getTime() - start} ms`
    // );
    // await launchesModel.loadSpacexLaunchDatatoDB(); // only needed once to load spacexlaunch data to our collection

    server.listen(PORT, () => {
      console.log(
        `server started on port ${PORT} in ${new Date().getTime() - start} ms`
      );
    });
  } catch (error) {
    console.log(error, "Error in Connecting DB");
  }
}

startServer();
