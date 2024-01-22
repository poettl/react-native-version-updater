#!/usr/bin/env node
const {
  updatePackageJsonVersion,
  updateIosVersion,
  updateAndroidVersion,
} = require("./updater");
const yargs = require("yargs");

const argv = yargs.option("versionMode", {
  alias: "v",
  description: "Version mode",
  type: "string",
  choices: ["major", "minor", "patch"],
  default: "patch",
}).argv;

const newVersion = updatePackageJsonVersion(argv.versionMode);
if (newVersion) {
  updateIosVersion(newVersion);
  updateAndroidVersion(newVersion);
}

console.log("Version updated successfully to", newVersion + " 🎉");
