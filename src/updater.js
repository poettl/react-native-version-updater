const plist = require("plist");
const fs = require("fs");
const { findFiles } = require("./utils");

// *PACKAGE.JSON*
const updatePackageJsonVersion = (versionMode) => {
  console.log("versionMode", versionMode);
  const packageJson = JSON.parse(fs.readFileSync("./package.json"));
  // console.log("packageJson", packageJson);
  if (!packageJson.version) {
    console.error("No version found in package.json");
    return;
  }
  const version = packageJson.version;
  const versionArray = version.split(".");
  const major = versionArray[0];
  const minor = versionArray[1];
  const patch = versionArray[2];

  // update version according to the version mode
  const newVersion = {
    major: `${parseInt(major) + 1}.0.0`,
    minor: `${major}.${parseInt(minor) + 1}.0`,
    patch: `${major}.${minor}.${parseInt(patch) + 1}`,
  };

  // update version in package.json
  console.log(`Version updated to ${newVersion[versionMode]} in package.json`);

  // update package.json
  packageJson.version = newVersion[versionMode];
  fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
  return newVersion[versionMode];
};

// *IOS*
const updateIosVersion = (newVersion) => {
  // .plist inside ios folder or subfolders
  const plistFiles = findFiles("./ios", ".plist");

  // check if plist files contain CFBundleShortVersionString key and update it
  plistFiles.forEach((file) => {
    const plistFile = fs.readFileSync(file, "utf8");
    const plistObject = plist.parse(plistFile);
    if (!plistObject.CFBundleShortVersionString) {
      return;
    }
    plistObject.CFBundleShortVersionString = newVersion;
    fs.writeFileSync(file, plist.build(plistObject));
    console.log(`Version updated to ${newVersion} in ${file}`);
  });

  // project.pbxproj inside ios folder
  const projectPbxproj = findFiles("./ios", ".pbxproj")[0];
  if (!projectPbxproj) {
    console.error("project.pbxproj not found");
    return;
  } else {
    const projectPbxprojFile = fs.readFileSync(projectPbxproj, "utf8");
    const versionNameRegex = /MARKETING_VERSION = (.*)/g;
    const newProjectPbxprojFile = projectPbxprojFile.replace(
      versionNameRegex,
      `MARKETING_VERSION = ${newVersion};`
    );
    fs.writeFileSync(projectPbxproj, newProjectPbxprojFile);
    console.log(`Version updated to ${newVersion} in ${projectPbxproj}`);
  }
};

// *ANDROID*
const updateAndroidVersion = (newVersion) => {
  // build.gradle inside android folder

  const buildGradle = fs.readFileSync("./android/app/build.gradle", "utf8");

  // versionName "1.0.4"
  // versionCode 9
  const versionNameRegex = /versionName\s"(.*)"/g;
  const versionCodeRegex = /versionCode\s(.*)/g;
  const versionName = versionNameRegex.exec(buildGradle)[1];
  const versionCode = versionCodeRegex.exec(buildGradle)[1];

  // update versionName and versionCode in build.gradle
  const newBuildGradle = buildGradle
    .replace(versionNameRegex, `versionName "${newVersion}"`)
    .replace(versionCodeRegex, `versionCode ${parseInt(versionCode) + 1}`);

  fs.writeFileSync("./android/app/build.gradle", newBuildGradle);
  console.log("VersionName updated to ", newVersion);
  console.log("VersionCode updated to ", parseInt(versionCode) + 1);
};

module.exports = {
  updatePackageJsonVersion,
  updateIosVersion,
  updateAndroidVersion,
};
