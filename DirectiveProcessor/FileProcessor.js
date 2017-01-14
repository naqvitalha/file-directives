var DirectiveHelper = require("./DirectiveHelper");
var fileTypeChecker = require('istextorbinary');
var fs = require('fs')
class FileProcessor {
    processDirectivesAndGetText(filePath, envVars) {
        var isText = fileTypeChecker.isTextSync(filePath);
        if (isText) {
            var finalFile = fs.readFileSync(filePath, 'utf8');
            var processResponse = this.processInternalAndReturnText(finalFile, envVars);
            var response = {
                isProcessed: processResponse.isProcessed, value: processResponse.response
            };
            return response;

        }
        else {
            var finalFile = fs.readFileSync(filePath);
            var response = {
                isProcessed: false, value: finalFile
            };
            return response;
        }
    }
    processInternalAndReturnText(data, envVars) {
        var dirHelper = new DirectiveHelper();
        var arr = this.splitFileText(data);
        var finalArr = [];
        var length = arr.length;
        var isProcessed = false;
        for (var i = 0; i < length; i++) {
            if (dirHelper.checkIfLineIsDirective(arr[i])) {
                var scope = dirHelper.getDirectiveScope(i, arr);
                var isDirectiveTrue = dirHelper.checkDirective(arr[i], envVars);
                var startIndex = i + 1;
                var endIndex = scope.endIndex - 1;
                if (isDirectiveTrue) {
                    if (this.checkCommentedScope(arr, startIndex, endIndex)) {
                        this.uncommentAll(arr, startIndex, endIndex);
                        isProcessed = true;
                    }
                }
                else {
                    if (this.checkUncommentedScope(arr, startIndex, endIndex)) {
                        this.commentAll(arr, startIndex, endIndex);
                        isProcessed = true;
                    }
                }
            }
            finalArr.push(arr[i]);
        }
        return {
            isProcessed: isProcessed,
            response: finalArr.join("\n")
        };
    }

    checkUncommentedScope(arr, startIndex, endIndex) {
        for (var k = startIndex; k <= endIndex; k++) {
            var trimText = arr[k].trim();
            if (!trimText.startsWith('//')) {
                return true;
            }
        }
        return false;
    }

    checkCommentedScope(arr, startIndex, endIndex) {
        for (var k = startIndex; k <= endIndex; k++) {
            var trimText = arr[k].trim();
            if (!trimText.startsWith('//')) {
                return false;
            }
        }
        return true;
    }

    commentAll(arr, startIndex, endIndex) {
        for (var k = startIndex; k <= endIndex; k++) {
            arr[k] = "//" + arr[k];
        }
    }

    uncommentAll(arr, startIndex, endIndex) {
        for (var k = startIndex; k <= endIndex; k++) {
            var trimText = arr[k].trim();
            arr[k] = trimText.substring(2, trimText.length);
        }
    }

    splitFileText(fileText) {
        return fileText.split('\n');
    }
}
module.exports = FileProcessor;