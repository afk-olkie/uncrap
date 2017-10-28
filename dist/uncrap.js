/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CParser_1 = __webpack_require__(3);
var src = "\n  //example input\n  void toggleLed(){\n    //stuff\n  }\n  ///blinky doxygen like comment\n  void blinky(){\n    toggleLed(); \n    delayMs(100);\n    toggleLed(); \n  }\n  /** delayMs doxygen like comment */\n  void delayMs(unsigned char ms){ \n    //prototype for delayMs should be declared above its usage in blinky();\n  }\n";
var functions = CParser_1.parseFuncProtos(src, true);
console.log(functions);


/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
  License: see license.txt
  Originally from http://blog.olkie.com/2013/11/05/online-c-function-prototype-header-generator-tool/
*/
Object.defineProperty(exports, "__esModule", { value: true });
var FoundFunction = /** @class */ (function () {
    function FoundFunction() {
        this.before = null;
        this.comments = null;
        this.returnType = null;
        this.functionName = null;
        this.parameters = null;
        this.declared = false;
    }
    FoundFunction.prototype.hasParameters = function () {
        var has = this.parameters && this.parameters != "void";
        return has;
    };
    FoundFunction.prototype.hasNonVoidReturnType = function () {
        var result = this.returnType.trim().match(/^(extern\s+)?void/) == null;
        return result;
    };
    FoundFunction.prototype.getParametersDeclArray = function (options) {
        options = options || {};
        var params = [];
        if (this.hasParameters()) {
            params = this.getParameters(options).split(/\s*,\s*/);
        }
        return params;
    };
    FoundFunction.prototype.hasVariadicArgument = function () {
        var result;
        result = this.parameters.match(/[.][.][.]/) != null;
        return result;
    };
    FoundFunction.prototype.getParameterNames = function (options) {
        options = options || {};
        var result = [];
        var params = this.getParametersDeclArray(options);
        if (params.length == 0) {
            return result;
        }
        for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
            var paramDecl = params_1[_i];
            paramDecl = paramDecl.trim();
            //skip over variadic parameters "..." and "void".
            if (paramDecl.match(/^([.][.][.]|void)$/)) {
                continue;
            }
            var match = paramDecl.trim().match(/\b(\w+)(?=$|\[.*)/);
            if (!match) {
                throw "didn't match!";
            }
            var name_1 = match[1];
            result.push(name_1);
        }
        return result;
    };
    FoundFunction.prototype.getParameterNamesString = function (options) {
        options = options || {};
        var params = this.getParameterNames(options);
        var result = params.join(", ");
        return result;
    };
    FoundFunction.prototype.getParameters = function (options) {
        options = options || {};
        var result = this.parameters;
        if (options.convertVariadic) {
            result = convertVariardicToVaList(result);
        }
        return result;
    };
    FoundFunction.prototype.getParametersPrepended = function (toPrepend, options) {
        options = options || {};
        var result = toPrepend;
        if (this.hasParameters()) {
            result += ", " + this.parameters;
        }
        if (options.convertVariadic) {
            result = convertVariardicToVaList(result);
        }
        return result;
    };
    FoundFunction.prototype.getSignatureMismatchString = function (foundFunction) {
        //NOTE: not smart enough for 'extern' and stuff like that
        if (foundFunction.returnType != this.returnType) {
            return "return types do not match!";
        }
        //count parameters
        //NOTE: no support for strings with "," in it
        if ((foundFunction.parameters.match(/.+?(,|$)/g) || []).length != (this.parameters.match(/.+?(,|$)/g) || []).length) {
            return "parameter count does not match!";
        }
        return "";
    };
    ;
    FoundFunction.prototype.toString = function () {
        return "FoundFunction{ returnType='" + this.returnType + "', functionName='" + this.functionName + "', parameters='" + this.parameters + "', declared='" + this.declared + "' }";
    };
    ;
    return FoundFunction;
}());
exports.FoundFunction = FoundFunction;
function convertVariardicToVaList(paramDecls) {
    var result = paramDecls.replace(/[.][.][.]/, "va_list args");
    return result;
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
  License: see license.txt
  Originally from http://blog.olkie.com/2013/11/05/online-c-function-prototype-header-generator-tool/
*/
Object.defineProperty(exports, "__esModule", { value: true });
var FoundFunction_1 = __webpack_require__(2);
function parseFuncProtos(inputCode, parseComments) {
    var functions = [];
    var cKeywords = ["auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else", "enum", "extern", "float", "for", "goto", "if", "int", "long", "register", "return", "short", "signed", "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned", "void", "volatile", "while"];
    var invalidFunctionNames = cKeywords;
    var invalidReturnTypes = ["auto", "break", "case", "continue", "default", "do", "else", "for", "goto", "if", "return", "sizeof", "switch", "while", "typedef"]; //TODO: may have some of these wrong
    //convert all line endings to a \n
    inputCode = inputCode.replace(/\r\n|\r/, "\n");
    //grab all comment blocks, and comment lines preceeding function definition
    var reStringPart = /"(?:\\[\n|.]|[^\n\\])"/.source;
    var reCommentPart = /\/(?:[*][\s\S]*?(?:[*]\/|$)|\/.*(?=\n|$))/.source; //NOTE the look ahead! can't capture \n, because js doesn't support \Z and we need our big re pattern below to be able to match on \Z or $ if not using multiline mode
    var reStringOrCommentOrAny = "(?:" + reCommentPart + "|" + reStringPart + "|[\\s\\S])*?"; //tries to respect comments and strings
    //var reBeforePart = /([\s\S]*?)/.source; //does not respect comments or strings
    var reBeforePart = "(" + reStringOrCommentOrAny + ")";
    var reDoxygenCommentsPart = /\s*((?:\s*\/[*][*!][\s\S]*?[*]\/|\s*\/\/[\/!].*(?:\n|$))+)/.source;
    var re = new RegExp(reBeforePart + /(?:(?:^|\n)\s*(\w+[\s*\t\w]+)\b\s*(\w+)\s*\(\s*([^)]*)\s*\)\s*([{;])|$)/.source, "g"); //can't use multiline mode because we need to match on end of input, not just line
    //console.log(re);
    var groups;
    var lastIndex = -1; //detect stuck in loops
    while ((groups = re.exec(inputCode)) !== null && groups.index != lastIndex) {
        var result = new FoundFunction_1.FoundFunction();
        result.before = (groups[1] || "").trim();
        result.returnType = (groups[2] || "").replace(/\s+/g, " ").trim();
        result.functionName = (groups[3] || "").trim();
        result.parameters = (groups[4] || "").replace(/\s+/g, " ").trim();
        if (groups[5] == ";") {
            result.declared = true;
        }
        //if we didn't find a function name, don't add it or invalid keywords used
        if (result.functionName) {
            //check individual return type words
            var returnTypes = result.returnType.toLowerCase().split(/[\s*]+/);
            if (arraysIntersect(returnTypes, invalidReturnTypes) || invalidFunctionNames.indexOf(result.functionName.toLowerCase()) != -1) {
                //TODO: log use of invalid keyword (or rather that we thought we found a function declaration/definition, but it had invalid keywords).
            }
            else {
                //extract comments, if any
                if (parseComments === true) {
                    var reComments = new RegExp(reBeforePart + reDoxygenCommentsPart + /\s*/.source, "g");
                    //have to loop and find last match and check if it matches right up to end of .before value. Why loop? because if we tell it to match up to $ (if it can), it will create some problems. /** header */ other lines (not a function) /* comment */ function. It will match right on over. Need to let it stop once it is happy and not force to end of input.
                    var groups2;
                    var madeItToEnd = false;
                    while (!madeItToEnd && (groups2 = reComments.exec(result.before)) !== null) {
                        madeItToEnd = reComments.lastIndex == result.before.length;
                    }
                    //if we made it to the end of the input string, then we found a matching doxygen comment!!!
                    if (madeItToEnd && groups2) {
                        result.before = groups2[1];
                        result.comments = groups2[2].replace(/(\r\n|\r|\n)[ \t]+/g, "$1"); //remove indenting
                    }
                }
                functions.push(result);
            } //end of invalid keywords test
        }
        lastIndex = groups.index;
    }
    return functions;
}
exports.parseFuncProtos = parseFuncProtos;
function arraysIntersect(array1, array2) {
    var result = false;
    for (var i = 0; !result && i < array2.length; i++) {
        result = array1.indexOf(array2[i]) !== -1;
    }
    return result;
}


/***/ })
/******/ ]);