"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CParser_1 = require("./CParser");
var src = "\n  //example input\n  void toggleLed(){\n    //stuff\n  }\n  ///blinky doxygen like comment\n  void blinky(){\n    toggleLed(); \n    delayMs(100);\n    toggleLed(); \n  }\n  /** delayMs doxygen like comment */\n  void delayMs(unsigned char ms){ \n    //prototype for delayMs should be declared above its usage in blinky();\n  }\n";
var functions = CParser_1.CParser.parseFuncProtos(src, true);
console.log(functions);
//# sourceMappingURL=app.js.map