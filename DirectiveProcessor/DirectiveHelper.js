
class DirectiveHelper {
    getDirectiveScope(dirIndex, fileSegments) {
        var count = 1;
        var fileLength = fileSegments.length;
        for (var i = dirIndex + 1; i < fileLength; i++) {
            var segment = fileSegments[i].trim();
            if (segment.startsWith("//#if")) {
                count++;
            }
            else if (segment.startsWith("//#endif")) {
                count--;
            }
            if (count === 0) {
                return {
                    startIndex: dirIndex,
                    endIndex: i
                }
            }
        }
        if (count !== 0) {
            throw new { message: "no corresponding endif found" };
        }
    }
    checkIfLineIsDirective(textLine) {
        return textLine.trim().startsWith("//#if");
    }
    checkIfStartEndDirective(textLine)
    {
         return textLine.trim().startsWith("//#if") || textLine.trim().startsWith("//#endif");
    }
    checkDirective(directive, envVars) {
        directive = directive.trim().replace("//#if", "");
        var m;
        var regEx = /\[(.*?)\]/g;
        while (m = regEx.exec(directive)) {
            if (envVars.includes(m[1])) {
                directive = directive.replace(m[0], true);
            }
            else {
                directive = directive.replace(m[0], false);
            }
        }
        return eval(directive);
    }
}
module.exports = DirectiveHelper;
