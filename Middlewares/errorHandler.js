const { nodeEnv } = require("../config/keys");
// Old method of error handling with production check
// const errorHandler = (error, req, res, next) => {
//   const code = res.code ? res.code : 500;

//   res
//     .status(code)
//     .json({ code, status: false, message: error.message, stack: error.stack });
// };

// New centralized error handling middleware with environment-based responses
const errorHandler = (error, req, res, next) => {
    const code = res.code ? res.code : 500;
    const isProduction = nodeEnv === "production";
    const payload = {
        code,
        status: false,
        message: error.message || "Internal Server Error",
    };
    if (!isProduction) {
        payload.stack = error.stack;
    }
    res.status(code).json(payload);
};

module.exports = errorHandler;
