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
    }
})();