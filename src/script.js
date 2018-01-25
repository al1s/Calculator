/* eslint no-var: 0 */
/* eslint vars-on-top: 0 */
/* eslint prefer-const: 0 */
/* eslint arrow-parens: 0 */

// https://medium.freecodecamp.org/parsing-math-expressions-with-javascript-7e8f5572276e

// TODO: add exception handler for not matched brackets;
// TODO: put app in compliance with A11y requirements;

// 5 + ((1 + 2) × 4) − 3
// 5 1 2 + 4 * + 3 -
// 512+4*+3-

// 3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3
// 3 4 2 × 1 5 − 2 3 ^ ^ ÷ +
// 342*15-23^^/+

// ((5 - 1 )* 2 + ((1 + 2) × 4)) * 3
// 51-2*12+4*+3*
var solver = {
  init() {
    this.brackets = {
      left: '(',
      right: ')',
    };
    this.getActionProp = this.getActionProp.bind(this);
    this.precedence = this.precedence.bind(this);
    this.associativity = this.associativity.bind(this);
    this.fn = this.fn.bind(this);
    this.topElm = this.topElm.bind(this);
    this.getRPN = this.getRPN.bind(this);
    this.solveRPN = this.solveRPN.bind(this);
    this.parseInput = this.parseInput.bind(this);
  },

  getActionProp(action, prop) {
    var actionProps = {
      '^': [4, 'right'],
      '*': [3, 'left'],
      '/': [3, 'left'],
      '%': [3, 'left'],
      '+': [2, 'left'],
      '-': [2, 'left'],
    };
    var actionFuncs = {
      '^': (x, y) => x ** y,
      '*': (x, y) => x * y,
      '/': (x, y) => x / y,
      '%': (x, y) => x % y,
      '+': (x, y) => x + y,
      '-': (x, y) => x - y,
    };
    switch (prop) {
      case 'precedence':
        return actionProps[action] ? actionProps[action][0] : 0;
      case 'associativity':
        return actionProps[action] ? actionProps[action][1] : 'left';
      case 'fn':
        return actionFuncs[action];
      default:
        return Object.keys(actionProps);
    }
  },

  precedence(action) {
    return this.getActionProp(action, 'precedence');
  },

  associativity(action) {
    return this.getActionProp(action, 'associativity');
  },

  fn(action) {
    return this.getActionProp(action, 'fn');
  },

  isOperator(item) {
    return this.getActionProp().includes(item);
  },

  isBracket(item) {
    return Object.values(this.brackets).includes(item);
  },

  isNumber(item) {
    return Number.isInteger(Number(item));
  },

  isDecimalPoint(item) {
    var n = '1.1';
    return /^1(.+)1$/.exec(n.toLocaleString())[1] === item;
  },

  topElm(stack) {
    return stack.slice(-1)[0];
  },

  getRPN(expression) {
    // console.clear();
    console.log(expression);
    var actionStack = [];
    // var inputArr = [...expression];
    var result = expression.reduce((acc, item, ndx) => {
      console.log(`action: ${item}`);
      if (
        !this.getActionProp().includes(item) &&
        (item !== this.brackets.left && item !== this.brackets.right)
      ) {
        acc.push(Number(item));
      } else if (this.getActionProp().includes(item)) {
        console.log(`actionStackTop: ${this.topElm(actionStack)}`);
        while (
          actionStack.length > 0 &&
          (this.precedence(this.topElm(actionStack)) > this.precedence(item) ||
            (this.precedence(this.topElm(actionStack)) ===
              this.precedence(item) &&
              this.associativity(item) === 'left')) &&
          this.topElm(actionStack) !== this.brackets.left
        ) {
          acc.push(actionStack.pop());
        }
        actionStack.push(item);
      } else if (item === this.brackets.left) actionStack.push(item);
      else if (item === this.brackets.right) {
        console.log(`actionStackTop: ${this.topElm(actionStack)}`);
        while (this.topElm(actionStack) !== this.brackets.left) {
          acc.push(actionStack.pop());
        }
        actionStack.pop();
      }
      if (expression.length - 1 === ndx && actionStack.length !== 0) {
        acc.push(...actionStack.reverse());
      }
      console.log(actionStack);
      console.log(acc);
      return acc;
    }, []);
    return result;
  },

  solveRPN(RPNexpression) {
    var operands = [];
    RPNexpression.forEach(item => {
      if (!this.getActionProp().includes(item)) {
        operands.push(Number(item));
      } else {
        var action = this.fn(item);
        var [a, b] = operands.splice(operands.length - 2, 2);
        operands.push(action(a, b));
      }
    });
    return operands[0];
  },

  parseInput(expression) {
    var queue = [];
    var inputArr = [...expression];
    var parsedExpression = inputArr.reduce((acc, item, ndx) => {
      if (this.isOperator(item) || this.isBracket(item)) {
        if (queue.length > 0) {
          acc.push(queue.join(''));
          queue = [];
        }
        acc.push(item);
      } else if (this.isNumber(item) || this.isDecimalPoint(item)) {
        queue.push(item);
      }
      if (inputArr.length - 1 === ndx && queue.length > 0) {
        acc.push(queue.join(''));
      }
      return acc;
    }, []);
    return parsedExpression;
  },
};

var inputProcessor = {
  mapKeyToChr(btnId) {
    var buttonToChrMapping = {
      btnPerc: '%',
      btnDiv: '/',
      btn7: '7',
      btn8: '8',
      btn9: '9',
      btnMult: '*',
      btn4: '4',
      btn5: '5',
      btn6: '6',
      btnSub: '-',
      btn1: '1',
      btn2: '2',
      btn3: '3',
      btnAdd: '+',
      btnPower: '^',
      btn0: '0',
      btnDecimalPoint: '.',
      btnEqual: '=',
      Enter: 'Enter',
      Backspace: 'Backspace',
    };
    return btnId
      ? buttonToChrMapping[btnId]
      : Object.values(buttonToChrMapping);
  },

  // from here - https://stackoverflow.com/a/1064139
  insertAtCaret(areaId, text) {
    var txtarea = document.querySelector(`#${areaId}`);
    txtarea.focus();
    if (!txtarea) {
      return;
    }

    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br =
      txtarea.selectionStart || txtarea.selectionStart == '0'
        ? 'ff'
        : document.selection ? 'ie' : false;
    if (br === 'ie') {
      txtarea.focus();
      var range = document.selection.createRange();
      range.moveStart('character', -txtarea.value.length);
      strPos = range.text.length;
    } else if (br === 'ff') {
      strPos = txtarea.selectionStart;
    }

    var front = txtarea.value.substring(0, strPos);
    var back = txtarea.value.substring(strPos, txtarea.value.length);
    txtarea.value = front + text + back;
    strPos += text.length;
    // console.log(`output length: ${strPos}, text: ${text}`);
    if (br === 'ie') {
      txtarea.focus();
      var ieRange = document.selection.createRange();
      ieRange.moveStart('character', -txtarea.value.length);
      ieRange.moveStart('character', strPos);
      ieRange.moveEnd('character', 0);
      ieRange.select();
    } else if (br === 'ff') {
      txtarea.selectionStart = strPos;
      txtarea.selectionEnd = strPos;
      txtarea.setSelectionRange(strPos, strPos);
      txtarea.focus();
    }

    txtarea.scrollTop = scrollPos;
  },

  vibrateOnTouch() {
    if ('vibrate' in navigator) {
      navigator.vibrate =
        navigator.vibrate ||
        navigator.webkitVibrate ||
        navigator.mozVibrate ||
        navigator.msVibrate;
      navigator.vibrate(30);
    }
  },

  outputChr(e) {
    // console.log(e);
    this.vibrateOnTouch();
    var chrToInsert = this.mapKeyToChr(e.target.id);
    this.insertAtCaret('calc_input', chrToInsert);
    e.preventDefault();
  },

  getInputValue(inputId) {
    return document.querySelector(`#${inputId}`).value;
  },

  clearInput(e) {
    // console.log(e);
    this.vibrateOnTouch();
    var inputElm = document.getElementById('calc_input');
    inputElm.value = '';
    if (e) e.preventDefault();
  },

  preventVirtualKbd(e) {
    // console.log(e);
    if (e.type === 'click') {
      e.target.removeAttribute('readonly');
    } else {
      e.preventDefault();
    }
  },

  filterCalcInput(e) {
    var allowedSymbols = this.mapKeyToChr();
    if (!allowedSymbols.includes(e.key)) {
      e.preventDefault();
    }
  },

  delPrevChr(e) {
    var currentValue = this.getInputValue('calc_input');
    currentValue = currentValue.substr(0, currentValue.length - 1);
    this.clearInput(e);
    this.insertAtCaret('calc_input', currentValue);
    e.preventDefault();
  },

  processKbdEntry(e) {
    // console.log(e);
    if (e.key === '=') {
      e.preventDefault();
      this.getResultOnEqual();
    } else this.filterCalcInput(e);
  },

  calcResult() {
    var currentValue = this.getInputValue('calc_input');
    // console.log(currentValue);
    // // currentValue = currentValue.substr(0, currentValue.length - 1);
    // console.log(currentValue);
    var parsedString = this.parseInput(currentValue);
    var RPNexpression = this.getRPN(parsedString);
    return this.solveRPN(RPNexpression);
  },

  getResultOnEqual(e) {
    this.vibrateOnTouch();
    // we can't put cursor in the right position for numbers in input field, so convert explicitly
    var result = String(this.calcResult());
    // console.log(result);
    this.clearInput(e);
    this.insertAtCaret('calc_input', result);
  },

  listen() {
    this.getResultOnEqual = this.getResultOnEqual.bind(this);
    this.getInputValue = this.getInputValue.bind(this);
    this.delPrevChr = this.delPrevChr.bind(this);
    this.filterCalcInput = this.filterCalcInput.bind(this);
    this.preventVirtualKbd = this.preventVirtualKbd.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.outputChr = this.outputChr.bind(this);
    this.insertAtCaret = this.insertAtCaret.bind(this);
    this.mapKeyToChr = this.mapKeyToChr.bind(this);
    this.calcResult = this.calcResult.bind(this);
    this.processKbdEntry = this.processKbdEntry.bind(this);
    this.vibrateOnTouch = this.vibrateOnTouch.bind(this);

    document.querySelectorAll('.btn').forEach(btn => {
      if (btn.id === 'btnC') {
        btn.addEventListener('click', this.clearInput);
      } else if (btn.id === 'btnDel') {
        btn.addEventListener('click', this.delPrevChr);
      } else if (btn.id === 'btnEqual') {
        btn.addEventListener('click', this.getResultOnEqual);
      } else btn.addEventListener('click', this.outputChr);
    });

    var inputElm = document.querySelector('#calc_input');
    ['click', 'touchend'].forEach(e =>
      inputElm.addEventListener(e, this.preventVirtualKbd),
    );
    // inputElm.addEventListener('click touchend', this.detectMouse);
    // inputElm.addEventListener('touchend', this.detectMouse);
    ['keydown', 'input'].forEach(e =>
      inputElm.addEventListener(e, this.processKbdEntry),
    );
    // inputElm.addEventListener('keydown', this.processChrEntry filterCalcInput);
    // inputElm.addEventListener('input', this.getResultOnEqual); // put handler into previous keyDown
  },
};

// var string = '5+((1+2)*4)-3';
// var string = '3+4*2/(1-5)^2^3';
var calculator = Object.assign({}, solver, inputProcessor);
calculator.init();
calculator.listen();
// var string = '((5-1)*2+((1+2)*4))*3';
// var parsedString = calcEngine.parseInput(string);
// var RPNexpression = calcEngine.getRPN(parsedString);
// console.log(calcEngine.solveRPN(RPNexpression));
