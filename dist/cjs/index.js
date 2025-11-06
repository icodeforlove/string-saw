"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = saw;
const Saw_1 = __importDefault(require("./Saw"));
function saw(input) {
    return new Saw_1.default(input);
}
