/*
 *  Created by Christos Ploutarchou.
 *  Date: 6/12/19, 11:26 μ.μ.
 *  File : app.js
 *
 */

// BUDGET CONTROLLER
var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var allExpenses = [];
    var allIncomes = [];
    var totalExpenses = 0;

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    return {
        addItem: function (type, desc, val) {
            var newItem;
            //Create New id
            console.log(type);
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //Create new item based on type
            if (type === 'exp') {
                newItem = new Expense(ID, desc, val);


            } else if (type === 'inc') {
                newItem = new Income(ID, desc, val);
            }
            //Push item on data structure
            data.allItems[type].push(newItem);

            //Return the new Element
            return newItem;
        }, testing: function () {
            console.log(data);
        }
    };
})();


// UI CONTROLLER
var UIController = (function () {
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
var controller = (function (budgetCtrl, UICtrl) {

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
        var input, newItem;
        //  1. Get Input Data
        input = UICtrl.getInput();
        //  2. Add item on main controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value)
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