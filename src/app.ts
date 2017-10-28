
import { parseFuncProtos } from "./CParser";

let src = `
  //example input
  void toggleLed(){
    //stuff
  }
  ///blinky doxygen like comment
  void blinky(){
    toggleLed(); 
    delayMs(100);
    toggleLed(); 
  }
  /** delayMs doxygen like comment */
  void delayMs(unsigned char ms){ 
    //prototype for delayMs should be declared above its usage in blinky();
  }
`;

let functions = parseFuncProtos(src, true);
console.log(functions);

