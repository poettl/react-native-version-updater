#!/usr/bin/env node
const {
  updatePackageJsonVersion,
  updateIosVersion,
  updateAndroidVersion,
  updateAndroidVersionCode,
} = require("./updater");
const yargs = require("yargs");

const argv = yargs
  .option("versionMode", {
    alias: "v",
    description: "Version mode",
    type: "string",
    choices: ["major", "minor", "patch", "android-version-code"],
    default: "patch",
  })
  .option("androidFlavor", {
    alias: "f",
    description: "Android flavor",
    type: "string",
  }).argv;

if (argv.versionMode === "android-version-code" && !argv.androidFlavor) {
  console.error(
    "Android flavor is required when versionMode is android-versioncode"
  );
  process.exit(1);
}

if (argv.versionMode === "android-version-code") {
  updateAndroidVersionCode(argv.androidFlavor);
} else {
  const newVersion = updatePackageJsonVersion(argv.versionMode);
  if (newVersion) {
    updateIosVersion(newVersion);
    updateAndroidVersion(newVersion);
  }
  console.log("App updated successfully to", newVersion + " 🎉");
}
