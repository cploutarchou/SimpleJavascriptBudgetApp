// BUDGET CONTROLLER
const budgetController = (function () {


})();


// UI CONTROLLER
const UIController = (function () {


})();


// MAIN APPLICATION CONTROLLER
const controller = (function (budgetCtrl, UICtrl) {

    var ctrlAddItem = function () {
        //  1. Get Input Data
        //  2. Add item on main controller
        //  3. Add item on UI
        //  4. Calculate Budget
        //  5. Display the Budget on UI
        console.log("New Item Added;")
    };

    document.querySelector('.add-btn').addEventListener('click', ctrlAddItem);


    document.addEventListener('keypress', function (event) {


        if (event.key === "Enter" || event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });

})(budgetController, UIController);

