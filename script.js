const output = document.getElementById('output');
const history = document.getElementById('history');
const buttons = document.querySelectorAll('.btn');

let current = '';
let prev = '';
let operator = '';
let justEvaluated = false;

function updateDisplay() {
  output.textContent = current || '0';
  history.textContent = prev ? `${prev} ${operatorSymbol(operator)}` : '';
}

function operatorSymbol(op) {
  switch (op) {
    case 'add': return '+';
    case 'subtract': return '–';
    case 'multiply': return '×';
    case 'divide': return '÷';
    default: return '';
  }
}

function appendNumber(num) {
  if (justEvaluated) {
    current = '';
    justEvaluated = false;
  }
  if (num === '.' && current.includes('.')) return;
  if (num === '.' && current === '') current = '0';
  current += num;
  updateDisplay();
}

function chooseOperator(op) {
  if (current === '' && prev === '') return;
  if (prev && current) {
    compute();
  }
  operator = op;
  prev = current || prev;
  current = '';
  justEvaluated = false;
  updateDisplay();
}

function compute() {
  let a = parseFloat(prev);
  let b = parseFloat(current);
  if (isNaN(a) || isNaN(b)) return;
  let result = 0;
  switch (operator) {
    case 'add': result = a + b; break;
    case 'subtract': result = a - b; break;
    case 'multiply': result = a * b; break;
    case 'divide':
      if (b === 0) {
        output.textContent = 'Error';
        current = '';
        prev = '';
        operator = '';
        return;
      }
      result = a / b; break;
    default: return;
  }
  current = result.toString();
  prev = '';
  operator = '';
  justEvaluated = true;
  updateDisplay();
}

function clearAll() {
  current = '';
  prev = '';
  operator = '';
  justEvaluated = false;
  updateDisplay();
}

function backspace() {
  if (justEvaluated) {
    current = '';
    justEvaluated = false;
  } else {
    current = current.slice(0, -1);
  }
  updateDisplay();
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('btn-num')) {
      appendNumber(btn.dataset.num);
    } else if (btn.classList.contains('btn-operator')) {
      chooseOperator(btn.dataset.action);
    } else if (btn.classList.contains('btn-equals')) {
      if (prev && current && operator) compute();
    } else if (btn.dataset.action === 'clear') {
      clearAll();
    } else if (btn.dataset.action === 'backspace') {
      backspace();
    }
  });
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') {
    appendNumber(e.key);
  } else if (e.key === '.') {
    appendNumber('.');
  } else if (e.key === '+' || e.key === '-') {
    chooseOperator(e.key === '+' ? 'add' : 'subtract');
  } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
    chooseOperator('multiply');
  } else if (e.key === '/' || e.key === '÷') {
    chooseOperator('divide');
  } else if (e.key === 'Enter' || e.key === '=') {
    if (prev && current && operator) compute();
  } else if (e.key === 'Backspace') {
    backspace();
  } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
    clearAll();
  }
});

updateDisplay(); 