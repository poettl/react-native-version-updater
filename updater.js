const plist = require("plist");
const fs = require("fs");

export const updatePackageJsonVersion = (versionMode) => {
  const packageJson = JSON.parse(fs.readFileSync("./package.json"));
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
  versionUpdate && console.log(`Version updated to ${newVersion[versionMode]}`);

  // update package.json
  packageJson.version = newVersion[versionMode];
  fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
  return newVersion[versionMode];
};

export const updateIosVersion = (newVersion) => {
  // *.plist inside ios folder

  const plistFiles = fs
    .readdirSync("./ios")
    .filter((file) => file.endsWith(".plist"));
  if (!plistFiles.length) {
    console.error("No plist files found in ios folder");
    return;
  }

  // check if plist files contain CFBundleShortVersionString key and update it

  plistFiles.forEach((file) => {
    const plistFile = fs.readFileSync(`./ios/${file}`, "utf8");
    const plistObject = plist.parse(plistFile);
    if (!plistObject.CFBundleShortVersionString) {
      console.error("CFBundleShortVersionString not found in plist file");
      return;
    }
    plistObject.CFBundleShortVersionString = newVersion;
    fs.writeFileSync(`./ios/${file}`, plist.build(plistObject));
    versionUpdate && console.log(`Version updated to ${newVersion} in ${file}`);
  });
};

export const updateAndroidVersion = (newVersion) => {
  // build.gradle inside android folder

  const buildGradle = fs.readFileSync("./android/app/build.gradle", "utf8");
  const buildGradleArray = buildGradle.split("\n");

  // check if build.gradle contains versionName and update it

  const versionNameLine = buildGradleArray.find((line) =>
    line.includes("versionName")
  );

  if (!versionNameLine) {
    console.error("versionName not found in build.gradle");
    return;
  }

  // find versionName and update it

  const versionName = versionNameLine.split(" ")[1].replace(/"/g, "");

  // update versionName according to the version mode

  // update versionName in build.gradle
  versionUpdate && console.log(`Version updated to ${newVersion}`);

  // update build.gradle

  const newBuildGradle = buildGradle.replace(versionName, newVersion);

  fs.writeFileSync("./android/app/build.gradle", newBuildGradle);

  // find versionCode and update it
  // example  versionCode 9
  // add 1 to versionCode

  const versionCodeLine = buildGradleArray.find((line) =>
    line.includes("versionCode")
  );

  if (!versionCodeLine) {
    console.error("versionCode not found in build.gradle");
    return;
  }

  // find versionCode and update it (add 1)

  const versionCode = versionCodeLine.split(" ")[1].replace(/"/g, "");
  const newVersionCode = parseInt(versionCode) + 1;

  // update versionCode in build.gradle
  versionUpdate && console.log(`Version updated to ${newVersionCode}`);

  // update build.gradle

  const newBuildGradle2 = newBuildGradle.replace(versionCode, newVersionCode);

  fs.writeFileSync("./android/app/build.gradle", newBuildGradle2);

  console.log("Version updated successfully to", newVersion + "🎉");
};
