const planetsModel = require("../../models/planets.model");

const getAllPlanets = async function (req, res, next) {
  const responseData = await planetsModel.readPlanetsData();
  //   console.log(responseData);
  return res.status(200).send(responseData);
};

module.exports.getAllPlanets = getAllPlanets;
