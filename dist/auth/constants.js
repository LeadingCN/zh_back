"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConstants = void 0;
const jwtSecret = require('../../config.json').jwt.jwtSecret;
exports.jwtConstants = {
    secret: jwtSecret,
};
//# sourceMappingURL=constants.js.map