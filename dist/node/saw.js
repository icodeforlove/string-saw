module.exports=function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:r})},n.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n.w={},n(n.s=6)}([function(t,e){t.exports=require("babel-runtime/helpers/createClass")},function(t,e){t.exports=require("babel-runtime/helpers/classCallCheck")},function(t,e){t.exports=require("escape-string-regexp")},function(t,e,n){"use strict";var r=i(n(1)),o=i(n(0));function i(t){return t&&t.__esModule?t:{default:t}}var c=function(){function t(e,n){if((0,r.default)(this,t),!e)return null;this.match=n,n instanceof RegExp&&!n.global&&n.length>1?this.matches=e.slice(1):this.matches=e,this.length=this.matches.length}return(0,o.default)(t,[{key:"item",value:function(t){var e=void 0;return 1===this.matches.length?e=this.matches[0]:this.matches.length>1&&(e=this.matches[this.match.global?t:t+1]),e||""}},{key:"slice",value:function(t,e){var n=[];return 1===this.matches.length||this.match.global?n=this.matches.slice(t,e):this.matches.length>1&&(n=this.matches.slice(t+1,e)),n}},{key:"toArray",value:function(t,e){var n=[];return 1===this.matches.length||this.match.global?n=this.matches.slice(0):this.matches.length>1&&(n=this.matches.slice(1)),n}},{key:"toString",value:function(){var t="";return 1===this.matches.length?t=this.matches[0]:this.matches.forEach(function(e){e&&(t+=e)}),t}},{key:"clone",value:function(){var e=new t(null);return e.match=this.match,e.matches=Array.prototype.slice.call(this.matches),e.length=this.length,e}}]),t}();t.exports=c},function(t,e){t.exports=require("babel-runtime/core-js/array/from")},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=u(n(1)),o=u(n(0)),i=u(n(4)),c=u(n(3)),a=u(n(2));function u(t){return t&&t.__esModule?t:{default:t}}function s(t){return t.length>1?(0,i.default)(t):Array.isArray(t[0])?t[0]:[t[0]]}var f=function(){function t(e){(0,r.default)(this,t),"number"==typeof e?this._context=String(e):Array.isArray(e)?this._context=e.slice(0):e instanceof c.default?this._context=e.clone():this._context=e}return(0,o.default)(t,[{key:"match",value:function(e){var n=s(arguments),r=new t(this._context),o=this._contextToString(this._context);return n.some(function(t){var e="function"==typeof t?t(o):o.match(t);if(e)return r._context=new c.default(e,t),!0;r._context=""}),r}},{key:"has",value:function(t){return this.match(t).first().toBoolean()}},{key:"item",value:function(e){var n=new t(this._context);return n._context instanceof c.default?n._context=n._context.item(e):Array.isArray(n._context)&&(n._context=n._context[e]||""),n}},{key:"itemFromRight",value:function(e){var n=new t(this._context);(n._context instanceof c.default||Array.isArray(n._context))&&((e=n._context.length-1-e)>=0&&(n=n.item(e)));return n}},{key:"first",value:function(e){return new t(this._context).item(0)}},{key:"last",value:function(){return new t(this._context).itemFromRight(0)}},{key:"replace",value:function(e,n){var r=new t(this._context);function o(t,e,n){return(e=Array.isArray(e)?e:[e]).some(function(e){if(t.match(e))return t=t.replace(e,n),!0}),t}return Array.isArray(r._context)?r._context=r._context.map(function(t){return t.replace(e,n)}):r._context=o(this._contextToString(this._context),e,n),r}},{key:"join",value:function(e){var n=new t(this._context),r=n.toArray();if(r.length){var o="";r.forEach(function(t,n,r){var i="function"==typeof e?e(t,n,r):e||"";o+=t+(r.length-1==n?"":i)}),n._context=o}return n}},{key:"each",value:function(e,n){var r=new t(this._context),o=r.toArray();return o.forEach(function(t,r){t&&e.bind(n)(t,r,o)}),r}},{key:"map",value:function(e,n){var r=new t(this._context),o=r.toArray();return r._context=o.map(function(t,r){return e.bind(n)(t,r,o)}),r}},{key:"reduce",value:function(e,n){var r=new t(this._context),o=r.toArray();return r._context=String(o.reduce(function(t,r,o,i){return e.bind(n)(t,r,o,i)})),r}},{key:"reverse",value:function(){var e=new t(this._context);if("string"==typeof e._context)e._context=e._context.split("").reverse().join("");else if(Array.isArray(e._context))e._context=e._context.reverse();else if(e._context instanceof c.default){var n=e.toArray();1===n.length?e._context=(n[0]||"").split("").reverse().join(""):e._context=e.toArray().reverse()}return e}},{key:"sort",value:function(e){var n=new t(this._context);if("string"==typeof n._context)n._context=n._context.split("").sort(e).join("");else if(Array.isArray(n._context))n._context=n._context.sort(e);else if(n._context instanceof c.default){var r=n.toArray();1===r.length?n._context=(r[0]||"").split("").sort(e).join(""):n._context=n.toArray().sort(e)}return n}},{key:"prepend",value:function(e){var n=new t(this._context),r=n.toArray();return n._context=r.map(function(t){return e+String(t)}),n}},{key:"append",value:function(e){var n=new t(this._context),r=n.toArray();return n._context=r.map(function(t){return String(t)+e}),n}},{key:"capitalize",value:function(){var e=new t(this._context),n=e.toArray();return e._context=n.map(function(e,n){return new t(e).replace(/\b./g,function(t){return t.toUpperCase()}).toString()}),e}},{key:"lowerCase",value:function(t){return this.mapStringMethodAgainstContext("toLowerCase",t)}},{key:"upperCase",value:function(t){return this.mapStringMethodAgainstContext("toUpperCase",t)}},{key:"mapStringMethodAgainstContext",value:function(e,n){var r=new t(this._context),o=r.toArray();return r._context=o.map(function(t,n){return t?String(t)[e]():t}),r}},{key:"filter",value:function(e,n){var r=new t(this._context);e=e||function(t){return t};var o=r.toArray();return r._context=o.filter(function(t,r){return"function"==typeof e?e.bind(n)(t,r,o):t.match(e)}),r}},{key:"filterNot",value:function(e,n){var r=new t(this._context),o=r.toArray();return r._context=o.filter(function(t,r){return"function"==typeof e?!e.bind(n)(t,r,o):!t.match(e)}),r}},{key:"remove",value:function(){var e=new t(this._context),n=e.toArray(),r=(0,i.default)(arguments);return n=n.map(function(t){return r.forEach(function(e){e="string"==typeof e?new RegExp((0,a.default)(e),"g"):e,t=t.replace(e,"")}),t}),e._context=n,e}},{key:"trim",value:function(){var e=new t(this._context),n=Array.isArray(e._context)?e._context:e.toArray(e._context);return e._context=n.map(function(t){return t?t.trim():t}),e}},{key:"split",value:function(e){var n=new t(this._context);return n._context=n._contextToString(n._context).split(e),n}},{key:"slice",value:function(e,n){var r=new t(this._context);return r._context=r._context.slice(e,n),r}},{key:"transform",value:function(e){var n=new t(this._context);return n._context=e(n._context),n}},{key:"toString",value:function(){return this._contextToString(this._context)}},{key:"toArray",value:function(){return Array.isArray(this._context)?(0,i.default)(this._context):this._context instanceof c.default?this._context.toArray():this.toBoolean()?[this._context]:[]}},{key:"toNumber",value:function(){var t=this.toFloat();return isNaN(t)?0:t}},{key:"toFloat",value:function(){var t=this.trim().toString(),e=parseFloat(t,10);return isNaN(e)||t.length!=String(e).length?NaN:e}},{key:"toInt",value:function(){var t=this.trim().toString(),e=parseInt(t,10);return isNaN(e)||t.length!=String(e).length?NaN:e}},{key:"toBoolean",value:function(){return!!this.toString()}},{key:"toObject",value:function(){var t=s(arguments),e=this.toArray(),n={};return t.forEach(function(t,r){void 0!==t&&void 0!==e[r]&&(n[t]=e[r])}),n}},{key:"indexOf",value:function(e){new t(this._context);var n=this.indexesOf(e).shift();return void 0!==n?n:-1}},{key:"indexesOf",value:function(e){new t(this._context);var n=[];if(Array.isArray(this._context))this._context.forEach(function(t,r){(String(t).match(e)||"function"==typeof e&&e(t))&&n.push(r)});else if("string"==typeof this._context)for(var r=new RegExp(e instanceof RegExp?e.source:(0,a.default)(e),e instanceof RegExp?String(e.flags).match(/g/)?e.flags||"":(e.flags||"")+"g":"g");e=r.exec(this._context);)n.push(e.index);return n}},{key:"length",value:function(){return this._context?this._context.length:0}},{key:"_contextToString",value:function(t){return"string"==typeof t?t:t instanceof c.default?t.toString():Array.isArray(t)?t.join(""):""}}]),t}();e.default=f,t.exports=e.default},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r,o=n(5),i=(r=o)&&r.__esModule?r:{default:r};e.default=function(t){return new i.default(t)},t.exports=e.default}]);
//# sourceMappingURL=saw.js.map