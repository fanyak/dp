"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numpy = void 0;
exports.numpy = {
    array(shape, fill) {
        return Array.from({ length: shape.x }, (_) => Array.from({ length: shape.y }, (_) => fill));
    },
};
