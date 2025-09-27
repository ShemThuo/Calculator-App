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
            /e/i.test(val)  || val.replace("-", "").replace(".", "").length <= maxlen
        ) { display.textContent = val; }
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
        setACLabel("C");
        updateDisplay();
    }

    keys.addEventListener("click", (e) => {
        const t = e.target.closest("button");
        if (!t) return;
        if (t.dataset.digit) {
            inputDigit(t.dataset.digit);
            return;
        }
    });
})();