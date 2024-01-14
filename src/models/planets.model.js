const fs = require("fs");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

function isHabitable(planet) {
  return (
    planet.hasOwnProperty("kepler_name") &&
    planet["koi_disposition"] === "CONFIRMED"
  );
}
const insertDataToDB = async () => {
  // const planets = [];

  try {
    const sourcePath = __dirname + "/kepler_data.csv";
    const readableStream = fs
      .createReadStream(sourcePath)
      .pipe(parse({ delimiter: ",", comment: "#", columns: true }));

    for await (const chunk of readableStream) {
      if (isHabitable(chunk)) {
        const { kepler_name, ...rest } = chunk;
        try {
          await planets.findOneAndUpdate(
            { keplerName: chunk.kepler_name },
            { keplerName: chunk.kepler_name },
            { upsert: true }
          );
          // console.log("data inserting...");
        } catch (error) {
          console.log("error occured in inserting planets data");
        }
      }
    }
  } catch (error) {
    console.log("error occured");
  }
};

const readData = async () => {
  return await planets.find({}, { _id: 0 });
};

module.exports.readPlanetsData = readData;
module.exports.insertDataToDB = insertDataToDB;
