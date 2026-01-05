const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
    const error = validationResult(req);
    const mappedErrors = {};

    if (Object.keys(error.errors).length === 0) {
        next();
    } else {
        error.errors.map((error) => {
            mappedErrors[error.path] = error.msg;
        });
        res.status(400).json(mappedErrors);
    }
};
module.exports = validate;
