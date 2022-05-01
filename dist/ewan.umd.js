(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.file = {}));
})(this, (function (exports) { 'use strict';

    function say(name){
        console.log(name);
    }

    exports.say = say;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
