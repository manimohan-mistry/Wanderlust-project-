const { valid } = require("joi");

module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}

// let validate = async (fn) => {
//     return (req, res, next) => {
//         fn(req, res, next).catch(next);
//     }
// }

// module.exports = validate();
