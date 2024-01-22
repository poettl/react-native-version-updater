const fs = require("fs");
const path = require("path");

function findFiles(directory, extension, foundFiles = []) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    // exclude ios/build folder and ios/Pods folder
    if (stats.isDirectory() && file !== "build" && file !== "Pods") {
      // If it's a directory, recursively search inside it
      findFiles(filePath, extension, foundFiles);
    } else if (file.endsWith(extension)) {
      // If it's a file with a .plist extension, add its path to the array
      foundFiles.push(filePath);
    }
  }

  return foundFiles;
}

module.exports = {
  findFiles,
};
