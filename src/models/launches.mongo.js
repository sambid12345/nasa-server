const mongoose = require("mongoose");

const launchSchema = new mongoose.Schema(
  {
    flightNumber: { type: Number, required: true, default: 100 }, //docs.flight_number
    customer: [String], //docs.payloads[0].customers
    upcoming: { type: Boolean, required: true }, //docs.upcoming
    success: { type: Boolean, required: true, default: true }, //docs.success
    mission: { type: String, required: true }, //docs.name
    rocket: { type: String, required: true }, // docs.rocket.name
    launchDate: { type: Date, required: true }, //docs.date_local
    target: { type: String, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Launch", launchSchema);
