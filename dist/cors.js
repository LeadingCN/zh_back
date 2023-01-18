"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    corsOptions = { origin: "*", credentials: true };
    callback(null, corsOptions);
};
exports.default = corsOptionsDelegate;
//# sourceMappingURL=cors.js.map