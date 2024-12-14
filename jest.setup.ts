import '@testing-library/jest-dom';
import 'dotenv/config';


global.structuredClone = (val) => {
        return JSON.parse(JSON.stringify(val));
      };

      if(!global.structuredClone){
        global.structuredClone = function structuredClone(objectToClone: any) {
              const stringified = JSON.stringify(objectToClone);
              const parsed = JSON.parse(stringified);
              return parsed;
            }
    }

// structuredClone のポリフィル
// if (typeof global.structuredClone === 'undefined') {
//   global.structuredClone = (value: any) => {
//     return JSON.parse(JSON.stringify(value));
//   };
// }

// import '@testing-library/jest-dom';
// import 'core-js/actual/structured-clone';

// require('dotenv').config();

// if (!global.structuredClone) {
//   global.structuredClone = function structuredClone(objectToClone: any) {
//     const stringified = JSON.stringify(objectToClone);
//     const parsed = JSON.parse(stringified);
//     return parsed;
//   };
// }
