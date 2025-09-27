(function() {
    const display = document.getElementById('display');
    const keys = document.querySelectorAll('.keys');

    const state = {
        displayValue: "0",
        firstOperand: null,
        operator: null,
        waitingForSecondOperand: false,
        lastOperator: null,
        lastOperand: null
    };

    function updateDisplay() {
        const value = state.displayValue;
        const maxlen = 9;

        if (
            /e/i.test(value)  || value.replace("-", "").replace(".", "").length <= maxlen
        ) { 
            display.textContent = value; 
        }
        else {
            const num = Number(value);
            display.textContent = num.toExponential(6).replace("+", "");
        }
    }

    function setACLabel(txt) {
        const ac = document.querySelector("[data-action='clear']");
        if (ac) ac.textContent = txt;
    }

    function clearOpHighlights() {
        document.querySelectorAll("[data-action='operator']").forEach((btn) => {
            btn.classList.remove("op-active");
        });
    }

    function setActiveOperator(op) {
        clearOpHighlights();
        const btn = documents.querySelector(`[data-action ='operator'][data-op = ${CSS.escape(op)}]`);
        if (btn) btn.classList.add("opp-active");
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
        updateDisplay
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
            default:
                break;
        }
    });
});