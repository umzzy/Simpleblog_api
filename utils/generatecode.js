const crypto = require("crypto");

// const generateCode = (codeLength) => {
//   const number = String(Math.random()).split("");
//   const length = number.length;
//   let code = "";
//   if (!codeLength) {
//     codeLength = 4;
//   }
//   for (let i = 0; i < codeLength; i++) {
//     code = code + number[length - (i + 1)];
//   }
//   return code;
// };

const generateCode = (codeLength = 4) => {
    let code = "";
    for (let i = 0; i < codeLength; i++) {
        code += crypto.randomInt(0, 10);
    }
    return code;
};

module.exports = generateCode;
