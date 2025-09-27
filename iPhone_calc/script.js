(function() {
    const display = document.getElementById('display');
    const keys = document.getElementById('keys');

    const state = {
        displayValue: "0",
        firstOperand: null,
        operator: null,
        waitingForSecondOperand: false,
        lastOperator: null,
        lastOperand: null
    };

    function updateDisplay() {
        const val = state.displayValue;
        const maxlen = 9;

        if (/e/i.test(val)  || val.replace("-", "").replace(".", "").length <= maxlen
        ) { 
            display.textContent = val; 
        }
        else {
            const num = Number(val);
            display.textContent = num.toExponential(6).replace("+", "");
        }
    }

    function setACLabel(txt) {
        const ac = document.querySelector("[data-action='clear']");
        if (ac) ac.textContent = txt;
    }

    function clearOpHighlights() {
        document.querySelectorAll("[data-action='operator']").forEach((btn) => 
            btn.classList.remove("op-active")
        );
    }

    function setActiveOperator(op) {
        clearOpHighlights();
        const btn = document.querySelector(`[data-action ='operator'][data-op = ${CSS.escape(op)}]`);
        if (btn) btn.classList.add("op-active");
    }

    function inputDigit(d) {
        if (state.waitingForSecondOperand) {
            state.displayValue = d;
            state.waitingForSecondOperand = false;
        } else {
            state.displayValue = state.displayValue === "0" ? d : state.displayValue + d;
        }
        clearOpHighlights();
        setACLabel('C');
        updateDisplay();
    }

    function inputDecimal() {
        if (state.waitingForSecondOperand) {
            state.displayValue = "0.";
            state.waitingForSecondOperand = false;
        } else  {
            state.displayValue += ".";
        }
        setACLabel('C');
        updateDisplay();
    }

    function toggleSign() {
        if (state.displayValue === "0") return;
        state.displayValue = String(-Number(state.displayValue));
        updateDisplay();
    }

    function percent() {
        let current = Number(state.displayValue);
        if(state.firstOperand !== null && state.operator && !state.waitingForSecondOperand) {
            current = state.firstOperand * (current / 100);
        }else {
            current = current / 100;
        }
        state.displayValue = String(current);
        updateDisplay();
    }

    function clearAll(full=true) {
        state.displayValue = "0";
        if (full) {
            state.firstOperand = null;
            state.operator = null;
            state.waitingForSecondOperand = false;
            state.lastOperator = null;
            state.lastOperand = null;
            clearOpHighlights();
        }
        setACLabel('AC');
        updateDisplay();
    }

        //Calculation part
        function calculate(a, op, b){
            a = Number(a);
            b = Number(b);

            switch (op) {
                case "+":
                    return a + b;
                    break;
                case "-":
                    return a - b;
                    break;
                case "*":
                    return a * b;
                    break;
                case "/":
                    return b === 0 ? NaN : a / b;
                    break;
                default:
                    return b;
                    break;
            }
        }

        function handleOperator(nextOp) {
            const inputValue = Number(state.displayValue);

            if (state.operator && state.waitingForSecondOperand) {
                state.operator = nextOp;
                setActiveOperator(nextOp);
                return;
            }
            if (state.firstOperand === null) {
                state.firstOperand = inputValue;
            }else if (state.operator) {
                const result = calculate(state.firstOperand, state.operator, inputValue);
                state.displayValue = String(result);
                state.firstOperand = result;
                updateDisplay();
            }
            state.operator = nextOp;
            state.waitingForSecondOperand = true;
            state.lastOperator = null;
            state.lastOperand = null;
            setActiveOperator(nextOp);
            setACLabel ('C');
        }

        function equals () {
            let inputValue = Number(state.displayValue);
            if (state.operator === null) {
                if (state.lastOperator && state.lastOperand !== null) {
                    const result = calculate(inputValue, state.lastOperator, state.lastOperand);
                    state.displayValue = String(result);
                }
                updateDisplay();
                return;
            }
            if (state.waitingForSecondOperand) {
                inputValue = state.firstOperand;
            }
            const result = calculate(state.firstOperand, state.operator, inputValue);
            state.displayValue = String(result);
            state.firstOperand = result;
            state.lastOperator = state.operator;
            state.lastOperand = inputValue;
            state.operator = null;
            state.waitingForSecondOperand = false;
            clearOpHighlights();
            updateDisplay();
        }

        keys.addEventListener("click", (e) => {
        const t = e.target.closest("button");

        if (!t) return;
        if (t.dataset.digit) {
            inputDigit(t.dataset.digit);
            return;
        }

        const action = t.dataset.action

        switch (action) {
            case "decimal":
                inputDecimal();
                break;
            case "sign":
                toggleSign();
                break;
            case "percent":
                percent();
                break;
            case "clear":
                if (display.textContent !== "0") {
                    clearAll(false);
                } else {
                    clearAll(true);
                }
                break;
            case "operator":
                handleOperator(t.dataset.op);
                break;
            case "equals":
                equals();
                break;
            default:
                break;
        }
    });

    function backspace() {
        if (state.waitingForSecondOperand) return;
        if (state.displayValue.length > 1) {
            state.displayValue = state.displayValue.slice(0, -1);
        } else {
            state.displayValue = "0";
        }
        updateDisplay();
    }

    window.addEventListener("keydown", (e) => {
        const key = e.key;
        if (/^[0-9]$/.test(key)) {
            inputDigit(key);
            return;
        }
        if (key === ".") {
            inputDecimal();
            return;
        }
        if (key === "+" || key === "-" || key === "*" || key === "/") {
            handleOperator(key);
            return;
        }
        if (key === "Enter" || key === "=") {
            e.preventDefault();
            equals();
            return;
        }
        if (key === "Escape") {
            clearAll(true);
            return;
        }
        if (key === "%") {
            percent();
            return;
        }
        if (key === "Backspace") {
            backspace();
            return;
        }
        updateDisplay();
    });
})();