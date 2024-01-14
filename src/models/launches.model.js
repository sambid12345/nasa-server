const axios = require("axios");
const https = require("https");
const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

async function getLaunchesList(page, limit) {
  return await launches
    .find()
    .sort({ flightNumber: 1 })
    .skip(limit * (page - 1))
    .limit(limit);
  // return Array.from(launches.values());
}

async function getLatestFlightNum() {
  const latestFlight = await launches.findOne().sort({ flightNumber: -1 });
  if (!latestFlight?.flightNumber) {
    return 100;
  } else {
    return Number(latestFlight?.flightNumber);
  }
}

async function scheduleLaunch(launch) {
  const existedPlanet = await planets.findOne({ keplerName: launch.target });

  if (!existedPlanet) {
    throw new Error("Target Planet Not Found!");
  }
  return await addToLaunch(launch);
}
async function addToLaunch(launch) {
  const latestFlightNumber = await getLatestFlightNum();

  const savedLaunch = await launches.updateOne(
    { flightNumber: launch.flightNumber },
    {
      flightNumber: latestFlightNumber + 1,
      ...launch,
      customer: ["ZTM", "NASA"],
      upcoming: true,
      success: true,
    },
    { upsert: true }
  );
  return savedLaunch;
}

async function abortLaunchById(flightId) {
  try {
    const abortedLaunch = await launches.updateOne(
      { flightNumber: Number(flightId) },
      {
        upcoming: false,
        success: false,
      }
    );
    return abortedLaunch;
  } catch (error) {
    throw new Error("abort launch was unsuccessful!!");
  }

  // return new Promise((resolve, reject) => {
  //   if (launches.get(flightId)) {
  //     const abortedLaunch = launches.get(flightId);
  //     abortedLaunch.upcoming = false;
  //     abortedLaunch.success = false;
  //     historyLaunches.set(flightId, abortedLaunch);
  //     launches.delete(flightId);
  //     setTimeout(() => {
  //       resolve(abortedLaunch);
  //     }, 1000);
  //   } else {
  //
  //   }
  // });
}

async function getSpacexLaunchData() {
  const launchData = [];
  const spacexURL = "https://api.spacexdata.com/v4/launches/query";
  const reqBody = {
    query: {},
    options: {
      pagination: false,
      populate: ["rocket", "payloads"],
      limit: 15,
    },
  };
  try {
    const spacexResponse = await axios.post(spacexURL, reqBody, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    const launchDocs = spacexResponse.data.docs;
    for (const launchDoc of launchDocs) {
      const customerArr = [];
      const payloads = launchDoc.payloads;
      if (payloads && payloads.length > 0) {
        payloads.forEach((payload) => {
          payload.customers.forEach((customer) => {
            customerArr.push(customer);
          });
        });
      }
      const launch = {
        flightNumber: launchDoc.flight_number,
        customer: customerArr,
        upcoming: launchDoc.upcoming,
        success: launchDoc.success,
        mission: launchDoc.name,
        rocket: launchDoc.rocket.name,
        launchDate: launchDoc.date_local,
      };
      launchData.push(launch);
    }
  } catch (error) {
    console.log(error);
  }
  return launchData;
}

async function loadSpacexLaunchDatatoDB() {
  const spacexLaunchData = await getSpacexLaunchData();
  for (const launch of spacexLaunchData) {
    await addToLaunch(launch);
  }
}

module.exports = {
  getLaunchesList,
  scheduleLaunch,
  abortLaunchById,
  loadSpacexLaunchDatatoDB,
};
