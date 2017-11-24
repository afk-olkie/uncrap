//TODO want this .ts file compiled down to straight js without any module stuff. webpack best way?
//while sorted out with collaborators, interim fix is to just comment below two lines while not developing in this file.
// import * as UncrapCore from "../../src/UncrapCore";
// import { FoundFunction } from "../../src/UncrapCore";
//TODO: move this into `UncrapCore`
var Target = /** @class */ (function () {
    function Target() {
    }
    return Target;
}());
function processTarget(tgt) {
    var foundFunctionsArray = [];
    var declaredCount = 0;
    var declaredMap = {};
    var definedMap = {};
    var definedArray = []; //from c input box
    tgt.output = "";
    tgt.warnings = "";
    tgt.log = "";
    tgt.log += "------------------------------------------------------\n";
    tgt.log += "looking for functions in c input textarea\n";
    foundFunctionsArray = UncrapCore.CParser.parseFuncProtos(tgt.input, tgt.includeComments);
    for (var _i = 0, foundFunctionsArray_1 = foundFunctionsArray; _i < foundFunctionsArray_1.length; _i++) {
        var foundFunction = foundFunctionsArray_1[_i];
        tgt.log += "found function: " + foundFunction + "\n";
        if (!foundFunction.declared) {
            //add to defined
            if (definedMap[foundFunction.functionName]) {
                tgt.warnings += "MULTIPLE definitions found for '" + foundFunction.functionName + "'\n";
                tgt.warnings += "  > previous definition: " + definedMap[foundFunction.functionName] + "\n";
                tgt.warnings += "  >    other definition: " + foundFunction + "\n";
            }
            else {
                definedArray.push(foundFunction);
            }
            definedMap[foundFunction.functionName] = foundFunction;
        }
        else {
            //add to declared
            tgt.log += " > detected as declared\n";
            if (declaredMap[foundFunction.functionName]) {
                tgt.warnings += "MULTIPLE declarations found for '" + foundFunction.functionName + "'\n";
                tgt.warnings += "  > previous declaration: " + declaredMap[foundFunction.functionName] + "\n";
                tgt.warnings += "  >    other declaration: " + foundFunction + "\n";
            }
            else {
                declaredCount++;
            }
            declaredMap[foundFunction.functionName] = foundFunction;
        }
    }
    tgt.log += "Function stats: defined=" + definedArray.length + ", declared=" + declaredCount + "\n";
    if (definedArray.length === 0) {
        tgt.warnings += "No defined functions found!\n";
    }
    tgt.log += "------------------------------------------------------\n";
    if (tgt.sortBy1 || tgt.sortBy2 || tgt.sortBy3) {
        tgt.log += "sorting defined functions based on fields: " + tgt.sortBy1 + ", " + tgt.sortBy2 + ", " + tgt.sortBy3 + "\n";
        definedArray = definedArray.sort(function (a, b) {
            var aStr = getSortString([tgt.sortBy1, tgt.sortBy2, tgt.sortBy3], a);
            var bStr = getSortString([tgt.sortBy1, tgt.sortBy2, tgt.sortBy3], b);
            return aStr.localeCompare(bStr);
        });
    }
    tgt.log += "------------------------------------------------------\n";
    tgt.log += "rendering output and ignoring defined functions that have already been declared\n";
    for (var _a = 0, definedArray_1 = definedArray; _a < definedArray_1.length; _a++) {
        var foundFunction = definedArray_1[_a];
        var declaration = declaredMap[foundFunction.functionName];
        if (declaration === undefined) {
            if (tgt.includeComments && foundFunction.comments) {
                tgt.output += foundFunction.comments.trim() + "\n";
            }
            tgt.output += foundFunction.returnType + " " + foundFunction.functionName + "(" + foundFunction.parameters + ");\n";
        }
        else {
            tgt.log += "not rendering function '" + foundFunction.functionName + "' because it was already declared.\n";
            var mismatchString = foundFunction.getSignatureMismatchString(declaration);
            if (mismatchString !== "") {
                tgt.warnings += "INCOMPATIBLE SIGNATURES FOUND between declaration and definition because " + mismatchString + "\n";
                tgt.warnings += " > declaration: " + declaration + "\n";
                tgt.warnings += " >  definition: " + foundFunction + "\n";
            }
        }
        //check that signature matches based on return type and number of parameters
    }
    if (tgt.ifndefName) {
        //TODO update to use backtick templates
        tgt.output = "#ifndef " + tgt.ifndefName + "_H\n#define " + tgt.ifndefName + "_H\n\n" + tgt.output + "\n#endif /* " + tgt.ifndefName + "_H */\n";
    }
}
//------------------------------------------------------------------------------
function getSortString(sortByArray, object) {
    var result = "";
    for (var _i = 0, sortByArray_1 = sortByArray; _i < sortByArray_1.length; _i++) {
        var sortByProperty = sortByArray_1[_i];
        if (sortByProperty) {
            result += object[sortByProperty];
        }
    }
    return result;
}
function arraysIntersect(array1, array2) {
    var result = false;
    for (var i = 0; !result && i < array2.length; i++) {
        result = array1.indexOf(array2[i]) !== -1;
    }
    return result;
}
//# sourceMappingURL=processor.js.map