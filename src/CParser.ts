
/*
  License: see license.txt
  Originally from http://blog.olkie.com/2013/11/05/online-c-function-prototype-header-generator-tool/
*/

import { FoundFunction } from "./FoundFunction";

export function parseFuncProtos(inputCode : string, parseComments : boolean){
  var functions : FoundFunction[] = [];
  var cKeywords = ["auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else", "enum", "extern", "float", "for", "goto", "if", "int", "long", "register", "return", "short", "signed", "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned", "void", "volatile", "while"];
  var invalidFunctionNames = cKeywords;
  var invalidReturnTypes = ["auto", "break", "case", "continue", "default", "do", "else", "for", "goto", "if", "return", "sizeof", "switch", "while", "typedef"]; //TODO: may have some of these wrong
  
  
  //convert all line endings to a \n
  inputCode = inputCode.replace(/\r\n|\r/,"\n");
  
  //grab all comment blocks, and comment lines preceeding function definition
  var reStringPart = /"(?:\\[\n|.]|[^\n\\])"/.source;
  var reCommentPart = /\/(?:[*][\s\S]*?(?:[*]\/|$)|\/.*(?=\n|$))/.source; //NOTE the look ahead! can't capture \n, because js doesn't support \Z and we need our big re pattern below to be able to match on \Z or $ if not using multiline mode
  var reStringOrCommentOrAny = "(?:" + reCommentPart + "|" + reStringPart + "|[\\s\\S])*?"; //tries to respect comments and strings
  //var reBeforePart = /([\s\S]*?)/.source; //does not respect comments or strings
  var reBeforePart = "(" + reStringOrCommentOrAny + ")";
  
  var reDoxygenCommentsPart = /\s*((?:\s*\/[*][*!][\s\S]*?[*]\/|\s*\/\/[\/!].*(?:\n|$))+)/.source;
   
  var re = new RegExp(reBeforePart + /(?:(?:^|\n)\s*(\w+[\s*\t\w]+)\b\s*(\w+)\s*\(\s*([^)]*)\s*\)\s*([{;])|$)/.source, "g");  //can't use multiline mode because we need to match on end of input, not just line
  //console.log(re);
  var groups;
  var lastIndex = -1; //detect stuck in loops
  while ((groups = re.exec(inputCode)) !== null && groups.index != lastIndex  )
  {
      var result = new FoundFunction();
      result.before = (groups[1] || "").trim();
      result.returnType = (groups[2] || "").replace(/\s+/g, " ").trim();
      result.functionName = (groups[3] || "").trim();
      result.parameters = (groups[4] || "").replace(/\s+/g, " ").trim();
      if(groups[5] == ";"){
        result.declared = true;
      }

      //if we didn't find a function name, don't add it or invalid keywords used
      if(result.functionName){
        //check individual return type words
        var returnTypes = result.returnType.toLowerCase().split(/[\s*]+/);
        if(arraysIntersect(returnTypes, invalidReturnTypes) || invalidFunctionNames.indexOf(result.functionName.toLowerCase()) != -1){
            //TODO: log use of invalid keyword (or rather that we thought we found a function declaration/definition, but it had invalid keywords).
        }else{
            //extract comments, if any
            if(parseComments === true){
                var reComments = new RegExp( reBeforePart + reDoxygenCommentsPart + /\s*/.source, "g");
                //have to loop and find last match and check if it matches right up to end of .before value. Why loop? because if we tell it to match up to $ (if it can), it will create some problems. /** header */ other lines (not a function) /* comment */ function. It will match right on over. Need to let it stop once it is happy and not force to end of input.
                var groups2;
                var madeItToEnd = false;
                while(!madeItToEnd && (groups2 = reComments.exec(result.before)) !== null){
                    madeItToEnd = reComments.lastIndex == result.before.length;
                }
                //if we made it to the end of the input string, then we found a matching doxygen comment!!!
                if(madeItToEnd && groups2){
                  result.before = groups2[1];
                  result.comments = groups2[2].replace(/(\r\n|\r|\n)[ \t]+/g, "$1"); //remove indenting
                }
            }
            
            functions.push(result);
        }//end of invalid keywords test
      }
      
      lastIndex = groups.index;
  }
  return functions;
}

function arraysIntersect(array1, array2){
  var result = false;
  for(var i=0; !result && i < array2.length; i++){
    result = array1.indexOf(array2[i]) !== -1;
  }
  return result;
}
