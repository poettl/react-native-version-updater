const fs = require("fs");
const path = require("path");

function findPlistFiles(directory, plistFiles = []) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    // exclude ios/build folder and ios/Pods folder
    if (stats.isDirectory() && file !== "build" && file !== "Pods") {
      // If it's a directory, recursively search inside it
      findPlistFiles(filePath, plistFiles);
    } else if (file.endsWith(".plist")) {
      // If it's a file with a .plist extension, add its path to the array
      plistFiles.push(filePath);
    }
  }

  return plistFiles;
}

module.exports = {
  findPlistFiles,
};
