// BUDGET CONTROLLER
const budgetController = (function () {


})();


// UI CONTROLLER
const UIController = (function () {
    var DOMStrings = {
        inputType: '.add-type',
        inputDescription: '.add-description',
        inputValue: '.add-value',
        inputBtn: '.add-btn'
    };
    return {
        getInput: function () {

            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        }, getDomStrings: function () {
            return DOMStrings;
        }
    };
})();


// MAIN APPLICATION CONTROLLER
const controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDomStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.key === "Enter" || event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    // console.log(DOM);
    var ctrlAddItem = function () {
        //  1. Get Input Data
        var input = UICtrl.getInput();
        //  2. Add item on main controller
        //  3. Add item on UI
        //  4. Calculate Budget
        //  5. Display the Budget on UI
    };


    return {
        init: function () {
            console.log("Application has Started");
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();