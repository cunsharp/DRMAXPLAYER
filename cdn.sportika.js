!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).DisableDevtool=t()}(this,function(){"use strict";function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function u(e,t){t&&r(e.prototype,t),n&&r(e,n),Object.defineProperty(e,"prototype",{writable:!1})}function e(e,t,n){t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n}function c(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be\nnull or a\nfunction");e.prototype=Object.create(t&&t.prototype,{constructor:{valu :e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&n(e,t)}function a(e){return(a=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function n(e,t){return(n=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e})(e,t)}function l(n){var o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}();return function(){var e,t=a(n);return U(this,o?(e=a(t
is).constructor,Reflect.construct(t,arguments,e)):t.apply(this,arguments))}}function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,o=new Array(t);n<t;n++)o[n]=e[n];return o}function s(e,t){var n,o="undefined"!=typeof Symbol&&e[Sym
ol.iterator]||e["@@iterator"];if(!o){if(Array.isArray(e)||(o=function(e,t){if(e){if("string"==typeof e)return f(e,t);var n=Object.prototype.toString.call(e).sl
ce(8,-1);return"Map"===(n="Object"===n&&e.constructor?e.constructor.name:n)||"S t"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?f(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length)return o&&(e=o),n=0,{s:t=function(){},n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:t};throw new TypeError("Invalid attempt to\niterate non-iterable instance.\nIn order to be iterable, non-array objects must have\n a [Symbol.iterator]() method.") }var i,r=!0,u=!1;return{s:function(){o=o.call(e)},n:function(){var e=o.next();return r=e.done,e},e:function(e){u=!0,i=e},f:function(){try{r||null==o.return||o.return()}finally{if(u)throw i}}}}function t(){if(d.url)window.location.href=d.url;else if(d.rewriteHTML)try{document.documentEleme
t.innerHTML=d.rewriteHTML}catch(e){document.documentElement.innerText=d.rewrite 
TML}else{try{window.opener=null,window.open("","_self"),window.close(),window.h
story.back()}catch(e){console.log(e)}setTimeout(function(){window.location.href
d.timeOutUrl||"https://theajack.github.io/disable-devtool/404.html?h=".concat(encodeURIComponent(location.host))},500)}}var d={md5:"",ondevtoolopen:t,ondevtool
close:null,url:"",timeOutUrl:"",tkName:"ddtk",interval:500,disableMenu:!0,stopIn
ervalTime:5e3,clearIntervalWhenDevOpenTrigger:!1,detectors:[1,3,4,5,6,7],clearL
g:!0,disableSelect:!1,disableInputSelect:!1,disableCopy:!1,disableCut:!1,disabl
Paste:!1,ignore:null,disableIframeParents:!0,seo:!0,rewriteHTML:""},H=["detectors","ondevtoolclose","ignore"];function q(e){var t,n=0<arguments.length&&void
0!==e?e:{};for(t in
n.onDevtoolOpen&&(n.ondevtoolopen=n.onDevtoolOpen),n.onDevtoolClose&&(n.ondevtoolclose=n.ondevtoolClose),d){var o=t;void
0===n[o]||i(d[o])!==i(n[o])&&-1===H.indexOf(o)||(d[o]=n[o])}"function"==typeof
d.ondevtoolclose&&!0==
d.clearIntervalWhenDevOpenTrigger&&(d.clearIntervalWhenDevOpenTrigger=!1,console.warn("ã€DISABLE-DEVTOOLã€‘clearIntervalWhenDevOpenTrigger åœ¨ä½¿ç”¨
ondevtoolclose æ—¶æ— æ•ˆ"))}function v(){return(new Date).getTime()}function h(e){var
t=v();return e(),v()-t}function z(n,o){function e(t){return function(){n&&n();var
e=t.apply(void 0,arguments);return o&&o(),e}}var t=window.alert,i=window.confirm,=window.prompt;try{window.alert=e(t),window.confirm=e(i),window.prompt=e(r)}catch(e){}var p,y,B,b={iframe:!1,pc:!1,qqBrowser:!1,firefox:!1,macos:!1,edge:!1,oldEdge:!1,ie:!1,iosChrome:!1,iosEdge:!1,chrome:!1,seoBot:!1,mobile:!1};function W(){function e(e){return-1!==t.indexOf(e)}var
t=navigator.userAgent.toLowerCase(),n=function(){var e=navigator,t=e.platform,e=e.maxTouchPoints;if("number"==typeof e)return 1<e;if("string"==typeof
t){e=t.toLowerCase();if(/(mac|win)/i.test(e))
return!1;if(/(android|iphone|ipad|ipod|arch)/i.test(e))return!0}return/(iphone|i
ad|ipod|ios|android)/i.test(navigator.userAgent.toLowerCase())}(),o=!!window.to
&&window!==window.top,i=!n,r=e("qqbrowser"),u=e("firefox"),c=e("macintosh"),a=e
("edge"),l=a&&!e("chrome"),f=l||e("trident")||e("msie"),s=e("crios"),d=e("edgios"),v=e("chrome")||s,h=!n&&/(googlebot|baiduspider|bingbot|applebot|petalbot|yandexbot|bytespider|chrome\-lighthouse|moto g
power)/i.test(t);Object.assign(b,{ifr
me:o,pc:i,qqBrowser:r,firefox:u,macos:c,edge:a,oldEdge:l,ie:f,iosChrome:s,iosEdge:d,chrome:v,seoBot:h,mobile:n})}function M(){for(var e=function(){for(var
e={},t=0;t<500;t++)e["".concat(t)]="".concat(t);return
e}(),t=[],n=0;n<50;n++)t.push(e);return t}function g(){d.clearLog&&B()}var K="",V=!1;function N(){var
e=d.ignore;if(e){if("function"==typeof e)return e();if(0!==e.length){var
t=location.href;if(K===t)return V;K=t;var n,o=!1,i=s(e);try{for(i.s();!(n=i.n()).done;){var
r=n.value;if("string"==typeof r){if(-1!==t.indexOf(r)){o=!0;break}}else
if(r.test(t)){o=!0;break}}}catch(e){i.e(e)}finally{i.f()}return V=o}}}var
X=function(){return!1};function w(n){var t,e,o=74,i=73,r=85,u=83,c=123,a=b.macos?function(e,t){return e.metaKey&&e.altKey&&(t===i||t===o)}:function(e,t){return e.ctrlKey&&e.shiftKey&&(t===i||t===o)},l=b.macos?function(e,t){return e.metaKey&&e.altKey&&t===r||e.metaKey&&e.altKey&&t===u}:function(e,t){return e.ctrlKey&&(t===u||t===r)};n.addEventListener("keydown",function(e){var
t=(e=e||n.event).keyCode||e.which;if(t===c||a(e,t)||l(e,t))return
T(n,e)},!0),t=n,d.disableMenu&&t.addEventListener("contextmenu",function(e){if("touch"!==e.pointerType)return
T(t,e)}),e=n,(d.disableSelect||.disableInputSelect)&&m(e,"selectstart"),e=n,d.disableCopy&&m(e,"copy"),e=n,d.disableCut&&m(e,"cut"),e=n,d.disablePaste&&m(e,"paste")}function
m(o,e){o.addEven
Listener(e,function(e){if(!(t=e.target)||"INPUT"!==t.tagName&&"TEXTAREA"!==t.tagName&&"true"==(null==(n=t.getAttribute)?void
0:n.call(t,"contenteditable"))){if(d.disableSelect)return T(o,e)}else if(d.disableInputSelect)return T(o,e);var
t,n})}function
T(e,t){if(!N()&&!X())return(t=t||e.event).returnValue=!1,t.preventDefault(),!1}var O,D=!1,S={};function F(e){S[e]=!1}function $(){for(var e in
S)if(S[e])return D=!0;return
D=!1}(A=O=O||{})[A.Unknown=-1]="Unknown",A[A.RegToStri
g=0]="RegToString",A[A.DefineId=1]="DefineId",A[A.Size=2]="Size",A[A.DateToStri
g=3]="DateToString",A[A.FuncToString=4]="FuncToString",A[A.Debugger=5]="Debugger",A[A.Performance=6]="Performance",A[A.DebugLib=7]="DebugLib";var
k=function(){function n(e){var t=e.type,e=e.enabled,e=void
0===e||e;o(this,n),this.type=O.Unk
own,this.enabled=!0,this.type=t,this.enabled=e,this.enabled&&(t=this,Q.push(t),this.init())}return u(n,[{key:"onDevToolOpen",value:function(){var
e;console.warn("You don't have permission to use DEVTOOL!ã€type =".concat(this.type,"ã€‘"))
d.clearIntervalWhenDevOpenTrigger&&te(),window.clearTimeout(J),d.ondevtoolopen(
his.type,t),e=this.type,S[e]=!0}},{key:"init",value:function(){}}]),n}(),G=function(){c(t,k);var e=l(t);function t(){return
o(this,t),e.call(this,{type:O.DebugLib})}return u(t,[{key:"init",value:function(){}},{key:"detect",value:function(){var e;(!0===(null==(e=null==(e=window.eruda)?void 0:e._devTools)?void 0:e._isSh
w)||window._vcOrigConsole&&window.document.querySelector("#__vconsole.vc-toggle
... (truncated - saved full minified file in workspace)