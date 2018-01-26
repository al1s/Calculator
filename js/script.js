"use strict";function _toConsumableArray(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}var _slicedToArray=function(){function t(t,e){var n=[],r=!0,i=!1,s=void 0;try{for(var c,a=t[Symbol.iterator]();!(r=(c=a.next()).done)&&(n.push(c.value),!e||n.length!==e);r=!0);}catch(t){i=!0,s=t}finally{try{!r&&a.return&&a.return()}finally{if(i)throw s}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),solver={init:function(){this.brackets={left:"(",right:")"},this.getActionProp=this.getActionProp.bind(this),this.precedence=this.precedence.bind(this),this.associativity=this.associativity.bind(this),this.fn=this.fn.bind(this),this.topElm=this.topElm.bind(this),this.getRPN=this.getRPN.bind(this),this.solveRPN=this.solveRPN.bind(this),this.parseInput=this.parseInput.bind(this)},getActionProp:function(t,e){var n={"^":[4,"right"],"*":[3,"left"],"/":[3,"left"],"%":[3,"left"],"+":[2,"left"],"-":[2,"left"]},r={"^":function(t,e){return Math.pow(t,e)},"*":function(t,e){return t*e},"/":function(t,e){return t/e},"%":function(t,e){return t%e},"+":function(t,e){return t+e},"-":function(t,e){return t-e}};switch(e){case"precedence":return n[t]?n[t][0]:0;case"associativity":return n[t]?n[t][1]:"left";case"fn":return r[t];default:return Object.keys(n)}},precedence:function(t){return this.getActionProp(t,"precedence")},associativity:function(t){return this.getActionProp(t,"associativity")},fn:function(t){return this.getActionProp(t,"fn")},isOperator:function(t){return this.getActionProp().includes(t)},isBracket:function(t){return Object.values(this.brackets).includes(t)},isNumber:function(t){return Number.isInteger(Number(t))},isDecimalPoint:function(t){return/^1(.+)1$/.exec("1.1".toLocaleString())[1]===t},topElm:function(t){return t.slice(-1)[0]},getRPN:function(t){var e=this;console.log(t);var n=[];return t.reduce(function(r,i,s){if(console.log("action: "+i),e.getActionProp().includes(i)||i===e.brackets.left||i===e.brackets.right){if(e.getActionProp().includes(i)){for(console.log("actionStackTop: "+e.topElm(n));n.length>0&&(e.precedence(e.topElm(n))>e.precedence(i)||e.precedence(e.topElm(n))===e.precedence(i)&&"left"===e.associativity(i))&&e.topElm(n)!==e.brackets.left;)r.push(n.pop());n.push(i)}else if(i===e.brackets.left)n.push(i);else if(i===e.brackets.right){for(console.log("actionStackTop: "+e.topElm(n));e.topElm(n)!==e.brackets.left;)r.push(n.pop());n.pop()}}else r.push(Number(i));return t.length-1===s&&0!==n.length&&r.push.apply(r,_toConsumableArray(n.reverse())),console.log(n),console.log(r),r},[])},solveRPN:function(t){var e=this,n=[];return t.forEach(function(t){if(e.getActionProp().includes(t)){var r=e.fn(t),i=n.splice(n.length-2,2),s=_slicedToArray(i,2),c=s[0],a=s[1];n.push(r(c,a))}else n.push(Number(t))}),n[0]},parseInput:function(t){var e=this,n=[],r=[].concat(_toConsumableArray(t));return r.reduce(function(t,i,s){return e.isOperator(i)||e.isBracket(i)?(n.length>0&&(t.push(n.join("")),n=[]),t.push(i)):(e.isNumber(i)||e.isDecimalPoint(i))&&n.push(i),r.length-1===s&&n.length>0&&t.push(n.join("")),t},[])}},inputProcessor={mapKeyToChr:function(t){var e={btnPerc:"%",btnDiv:"/",btn7:"7",btn8:"8",btn9:"9",btnMult:"*",btn4:"4",btn5:"5",btn6:"6",btnSub:"-",btn1:"1",btn2:"2",btn3:"3",btnAdd:"+",btnPower:"^",btn0:"0",btnDecimalPoint:".",btnEqual:"=",btnLBr:"(",btnRBr:")",Enter:"Enter",Backspace:"Backspace"};return t?e[t]:Object.values(e)},insertAtCaret:function(t,e){var n=document.querySelector("#"+t);if(n.focus(),n){var r=n.scrollTop,i=0,s=n.selectionStart||"0"==n.selectionStart?"ff":!!document.selection&&"ie";if("ie"===s){n.focus();var c=document.selection.createRange();c.moveStart("character",-n.value.length),i=c.text.length}else"ff"===s&&(i=n.selectionStart);var a=n.value.substring(0,i),u=n.value.substring(i,n.value.length);if(n.value=a+e+u,i+=e.length,"ie"===s){n.focus();var o=document.selection.createRange();o.moveStart("character",-n.value.length),o.moveStart("character",i),o.moveEnd("character",0),o.select()}else"ff"===s&&(n.selectionStart=i,n.selectionEnd=i,n.setSelectionRange(i,i),n.focus());n.scrollTop=r}},vibrateOnTouch:function(){"vibrate"in navigator&&(navigator.vibrate=navigator.vibrate||navigator.webkitVibrate||navigator.mozVibrate||navigator.msVibrate,navigator.vibrate(30))},outputChr:function(t){this.vibrateOnTouch();var e=this.mapKeyToChr(t.target.id);this.insertAtCaret("calc_input",e),t.preventDefault()},getInputValue:function(t){return document.querySelector("#"+t).value},clearInput:function(t){this.vibrateOnTouch(),document.getElementById("calc_input").value="",t&&t.preventDefault()},preventVirtualKbd:function(t){"click"===t.type?t.target.removeAttribute("readonly"):t.preventDefault()},filterCalcInput:function(t){this.mapKeyToChr().includes(t.key)||t.preventDefault()},delPrevChr:function(t){var e=this.getInputValue("calc_input");e=e.substr(0,e.length-1),this.clearInput(t),this.insertAtCaret("calc_input",e),t.preventDefault()},processKbdEntry:function(t){"="===t.key?(t.preventDefault(),this.getResultOnEqual()):this.filterCalcInput(t)},calcResult:function(){var t=this.getInputValue("calc_input"),e=this.parseInput(t),n=this.getRPN(e);return this.solveRPN(n)},getResultOnEqual:function(t){this.vibrateOnTouch();var e=String(this.calcResult());this.clearInput(t),this.insertAtCaret("calc_input",e)},listen:function(){var t=this;this.getResultOnEqual=this.getResultOnEqual.bind(this),this.getInputValue=this.getInputValue.bind(this),this.delPrevChr=this.delPrevChr.bind(this),this.filterCalcInput=this.filterCalcInput.bind(this),this.preventVirtualKbd=this.preventVirtualKbd.bind(this),this.clearInput=this.clearInput.bind(this),this.outputChr=this.outputChr.bind(this),this.insertAtCaret=this.insertAtCaret.bind(this),this.mapKeyToChr=this.mapKeyToChr.bind(this),this.calcResult=this.calcResult.bind(this),this.processKbdEntry=this.processKbdEntry.bind(this),this.vibrateOnTouch=this.vibrateOnTouch.bind(this),document.querySelectorAll(".btn").forEach(function(e){"btnC"===e.id?e.addEventListener("click",t.clearInput):"btnDel"===e.id?e.addEventListener("click",t.delPrevChr):"btnEqual"===e.id?e.addEventListener("click",t.getResultOnEqual):e.addEventListener("click",t.outputChr)});var e=document.querySelector("#calc_input");["click","touchend"].forEach(function(n){return e.addEventListener(n,t.preventVirtualKbd)}),["keydown","input"].forEach(function(n){return e.addEventListener(n,t.processKbdEntry)})}},calculator=Object.assign({},solver,inputProcessor);calculator.init(),calculator.listen();
//# sourceMappingURL=script.js.map
