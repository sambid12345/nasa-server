const fs = require("fs");
const { parse } = require("csv-parse");

function isHabitable(planet) {
  return (
    planet.hasOwnProperty("kepler_name") &&
    planet["koi_disposition"] === "CONFIRMED"
  );
}
const readData = async () => {
  const planets = [];

  try {
    const sourcePath = __dirname + "/kepler_data.csv";
    const readableStream = fs
      .createReadStream(sourcePath)
      .pipe(parse({ delimiter: ",", comment: "#", columns: true }));

    for await (const chunk of readableStream) {
      if (isHabitable(chunk)) planets.push(chunk);
    }
  } catch (error) {
    console.log("error occured");
  }
  //   console.log("Finished reading file", planets);
  return planets;
};

module.exports.readPlanetsData = readData;
