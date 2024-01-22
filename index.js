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
});

const versionMode = argv.version;

const newVersion = updatePackageJsonVersion(versionMode);
if (newVersion) {
  updateIosVersion(newVersion);
  updateAndroidVersion(newVersion);
}
