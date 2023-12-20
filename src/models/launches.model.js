const launches = new Map();
const historyLaunches = new Map();
const latestFlightNumber = 102;
const launch1 = {
  flightNumber: 100,
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 23, 2025"),
  target: "Kepler-227 b",
};
const launch2 = {
  flightNumber: 101,
  customer: ["ZTM", "NASA"],
  upcoming: false,
  success: false,

  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 23, 2025"),
  target: "Kepler-227 b",
};

launches.set(launch1.flightNumber, launch1);
launches.set(launch2.flightNumber, launch2);

function isLaunchExist(launchId) {
  return launches.get(launchId).upcoming;
}

function getLaunchesList() {
  return Array.from(launches.values());
}

function addToLaunch(launch) {
  launches.set(latestFlightNumber, {
    ...launch,
    flightNumber: latestFlightNumber,
    customer: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
  });

  return launches.get(latestFlightNumber);
}

function abortLaunchById(flightId) {
  return new Promise((resolve, reject) => {
    console.log("fligt id", launches.get(flightId));
    if (launches.get(flightId)) {
      const abortedLaunch = launches.get(flightId);
      abortedLaunch.upcoming = false;
      abortedLaunch.success = false;
      historyLaunches.set(flightId, abortedLaunch);
      launches.delete(flightId);
      setTimeout(() => {
        resolve(abortedLaunch);
      }, 1000);
    } else {
      throw new Error();
    }
  });
}

module.exports = {
  getLaunchesList,
  addToLaunch,
  abortLaunchById,
};
