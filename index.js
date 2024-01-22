#!/usr/bin/env node
import {
  updatePackageJsonVersion,
  updateIosVersion,
  updateAndroidVersion,
} from "./updater.js";
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
updateIosVersion(newVersion);
updateAndroidVersion(newVersion);
