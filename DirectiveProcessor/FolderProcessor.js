var FileProcessor = require("./FileProcessor");
var ncp = require('ncp');
var fs = require('fs');
var cwd = process.cwd();
class FolderProcessor {
    processFolderAndCreate(folderPath, finalFolderPath, envVars, excludedFolders, showAllLogs) {
        if (!fs.existsSync(finalFolderPath)) {
            fs.mkdirSync(finalFolderPath);
        }
        var items = this.getAllItems(folderPath);
        if (showAllLogs) {
            console.log("#folder job: ", folderPath);
        }
        var fileProcessor = new FileProcessor();
        items.forEach(function (element) {
            var finalPath = finalFolderPath + "/" + element;
            var initialPath = folderPath + "/" + element;
            if (!fs.lstatSync(initialPath).isDirectory()) {
                var response = fileProcessor.processDirectivesAndGetText(initialPath, envVars);
                if (response.isProcessed || initialPath !== finalPath) {
                    console.log("$file: ", finalPath);
                    fs.writeFileSync(finalPath, response.value);
                }
            }
            else {
                var isExcluded = false;
                if (excludedFolders.length > 0) {
                    excludedFolders.forEach(function (excludedFolder) {
                        if (initialPath.startsWith(cwd + "/" + excludedFolder)) {
                            isExcluded = true;
                        }
                    }, this);
                }
                if (!isExcluded) {
                    this.processFolderAndCreate(initialPath, finalPath, envVars, excludedFolders);
                }
                else if (initialPath !== finalPath) {
                    this.copyFolder(initialPath, finalPath);
                    if (showAllLogs) {
                        console.log("   *-copied: ", initialPath + " to " + finalPath);
                    }
                }
                else {
                    if (showAllLogs) {
                        console.log("   !-excluded: ", initialPath);
                    }
                }
            }
        }, this);
    }
    copyFolder(source, target) {
        ncp(source, target, function (err) {
            if (err) {
                throw err;
            }
        });
    }
    processFolderAndCopy(folderPath, finalFolderPath, envVars, excludedFolders, showAllLogs) {
        console.log("------------------------------- Directive Processing Started -------------------------------");
        processFolderAndCreate(folderPath, finalFolderPath, envVars, excludedFolders, showAllLogs);
        console.log("------------------------------- Directive Processing Complete -------------------------------");
    }
    processFolder(folderPath, envVars, excludedFolders, showAllLogs) {
        console.log("------------------------------- Directive Processing Started -------------------------------");
        this.processFolderAndCreate(folderPath, folderPath, envVars, excludedFolders, showAllLogs);
        console.log("------------------------------- Directive Processing Complete -------------------------------");
    }
    getAllItems(folderPath) {
        return fs.readdirSync(folderPath);
    }
}
module.exports = FolderProcessor;