document.addEventListener('DOMContentLoaded', () => {
    const historyEl = document.getElementById('history');
    const resultEl = document.getElementById('result');
    const buttons = document.querySelectorAll('.btn');

    let currentInput = '0';
    let previousInput = '';
    let operator = null;
    let shouldResetScreen = false;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Animation
            button.classList.add('pop-anim');
            setTimeout(() => button.classList.remove('pop-anim'), 200);

            if (button.dataset.number) {
                appendNumber(button.dataset.number);
            } else if (button.dataset.operator) {
                chooseOperator(button.dataset.operator);
            } else if (button.dataset.action) {
                handleAction(button.dataset.action);
            }
            updateDisplay();
        });
    });

    function appendNumber(number) {
        if (currentInput === '0' || shouldResetScreen) {
            resetScreen();
        }
        if (number === '.' && currentInput.includes('.')) return;
        currentInput += number;
    }

    function resetScreen() {
        currentInput = '';
        shouldResetScreen = false;
    }

    function chooseOperator(selectedOperator) {
        if (operator !== null) evaluate();
        previousInput = currentInput;
        operator = selectedOperator;
        shouldResetScreen = true;
    }

    function evaluate() {
        if (operator === null || shouldResetScreen) return;
        if (operator === '/' && currentInput === '0') {
            alert("Cannot divide by zero!");
            return;
        }
        
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;

        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            case '%':
                result = prev % current;
                break;
            default:
                return;
        }

        currentInput = Math.round(result * 100000000) / 100000000; // Avoid float precision issues
        operator = null;
    }

    function handleAction(action) {
        if (action === 'clear') {
            currentInput = '0';
            previousInput = '';
            operator = null;
            historyEl.textContent = '';
        } else if (action === 'delete') {
            currentInput = currentInput.toString().slice(0, -1);
            if (currentInput === '') currentInput = '0';
        } else if (action === 'calculate') {
            evaluate();
        }
    }

    function updateDisplay() {
        resultEl.textContent = currentInput;
        if (operator != null) {
            historyEl.textContent = `${previousInput} ${operator}`;
        } else {
            historyEl.textContent = '';
        }
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
        if (e.key === '.') appendNumber('.');
        if (e.key === '=' || e.key === 'Enter') handleAction('calculate');
        if (e.key === 'Backspace') handleAction('delete');
        if (e.key === 'Escape') handleAction('clear');
        if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            chooseOperator(e.key);
        }
        updateDisplay();
    });
});
