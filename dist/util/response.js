"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.success = void 0;
const success = (res, status, entity = null, msg) => res
    .status(status || 200)
    .json({
    success: true,
    message: msg || "Successful",
    payload: entity || [],
});
exports.success = success;
const fail = (res, status, msg) => res
    .status(status || 500)
    .json({
    success: false,
    message: msg || "Failed",
    payload: [],
});
exports.fail = fail;
