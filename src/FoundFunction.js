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
//# sourceMappingURL=FoundFunction.js.map