/*
  License: see license.txt
  Originally from http://blog.olkie.com/2013/11/05/online-c-function-prototype-header-generator-tool/
*/

export class FoundFunction {
  before : string = null;
  comments : string = null;
  returnType : string = null;
  functionName : string = null;
  parameters : string = null;
  declared = false;

  hasParameters() : boolean {
    let has = this.parameters && this.parameters != "void";
    return has;
  }

  
  hasNonVoidReturnType() : boolean {
    let result = this.returnType.trim().match(/^(extern\s+)?void/) == null;
    return result;
  }


  getParametersDeclArray(options?: {convertVariadic? : boolean}) : string[] {
    options = options || {};
    let params : string[] = [];

    if (this.hasParameters()){
      params = this.getParameters(options).split(/\s*,\s*/);
    }

    return params;
  }

  hasVariadicArgument() : boolean {
    let result : boolean;
    result = this.parameters.match(/[.][.][.]/) != null;
    return result;
  }

  getParameterNames(options?: {convertVariadic? : boolean}) : string[] {
    options = options || {};
    let result : string[] = [];

    let params : string[] = this.getParametersDeclArray(options);

    if(params.length == 0){
      return result;
    }

    for(let paramDecl of params) {
      paramDecl = paramDecl.trim();

      //skip over variadic parameters "..." and "void".
      if(paramDecl.match(/^([.][.][.]|void)$/)) {
        continue;
      }
      let match = paramDecl.trim().match(/\b(\w+)(?=$|\[.*)/); 
      if(!match){
        throw "didn't match!";
      }
      let name = match[1];
      result.push(name);
    }

    return result;
  }

  getParameterNamesString(options?: {convertVariadic? : boolean}) : string {
    options = options || {};
    let params : string[] = this.getParameterNames(options);

    let result = params.join(", ");
    return result;
  }  

  getParameters(options?: {convertVariadic? : boolean}) {
    options = options || {};
    let result = this.parameters;

    if(options.convertVariadic){
      result = convertVariardicToVaList(result);
    }

    return result;
  }

  getParametersPrepended(toPrepend : string, options?: {convertVariadic? : boolean}) {
    options = options || {};
    let result = toPrepend;

    if( this.hasParameters() ){
      result += ", " + this.parameters;
    }

    if(options.convertVariadic){
      result = convertVariardicToVaList(result);
    }

    return result;
  }

  getSignatureMismatchString(foundFunction){
    //NOTE: not smart enough for 'extern' and stuff like that
    if(foundFunction.returnType != this.returnType){
      return "return types do not match!";
    }

    //count parameters
    //NOTE: no support for strings with "," in it
    if((foundFunction.parameters.match(/.+?(,|$)/g) || []).length != (this.parameters.match(/.+?(,|$)/g) || []).length){
      return "parameter count does not match!";
    }
    return "";
  };

  toString(){
    return "FoundFunction{ returnType='" + this.returnType + "', functionName='"+this.functionName+"', parameters='"+this.parameters+"', declared='"+this.declared+"' }";
  };
}

  
function convertVariardicToVaList(paramDecls : string) : string {
  let result = paramDecls.replace(/[.][.][.]/, "va_list args");
  return result;
}