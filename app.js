/*
 *  Created by Christos Ploutarchou.
 *  Email : cploutarchou@gmail.com
 *  Date: 6/12/19, 11:38 μ.μ.
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
        inputBtn: '.add-btn',
        incomeHtmlContainer: '.income-list',
        expensesHtmlContainer: '.expenses-list'
    };
    return {
        getInput: function () {

            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        }, addListItem: function (itemObj, type) {
            var html, newHtml, element, fields, fieldsArray;
            if (type === 'inc') {
                element = DOMStrings.incomeHtmlContainer;

                //Creat Html String with placeholder text
                html = '<div class="item clearfix" id="income-%id%"> ' +
                    '<div class="item-description">%description%</div> ' +
                    '<div class="right clearfix"> ' +
                    '<div class="item-value">%value%</div> ' +
                    '<div class="item-delete"> ' +
                    '<button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button> ' +
                    '</div></div> </div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesHtmlContainer;

                html = '<div class="item clearfix" id="expense-%id%">' +
                    '<div class="item-description">%description%</div> ' +
                    '<div class="right clearfix"> ' +
                    '<div class="item-value">%value%</div> ' +
                    '<div class="item-percentage">21%</div> ' +
                    '<div class="item-delete"> ' +
                    '<button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button> ' +
                    '</div> </div> </div>';
            }
            //Replace placeholder text with actual data
            newHtml = html.replace('%id%', itemObj.id);
            newHtml = newHtml.replace('%description%', itemObj.description);
            newHtml = newHtml.replace('%value%', itemObj.value);
            //Insert Html into DOM

            element = document.querySelector(element);
            element.insertAdjacentHTML('afterend', newHtml);

        }, clearFields: function () {
            fields = document.querySelectorAll(DOMStrings.inputDescription + "," + DOMStrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (e) {
                e.value = "";
            });
            //Set Focus back to description
            fieldsArray[0].focus();

            // console.log(fieldsArray);
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

    var updateBudget = function () {
        //  1. Calculate Budget

        //  2. Return Budget

        //  3. Display the Budget on UI
    };
    // console.log(DOM);
    var ctrlAddItem = function () {
        var input, newItem;
        //  1. Get Input Data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value !== 0) {
            //  2. Add item on main controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //  3. Add item on UI
            UICtrl.addListItem(newItem, input.type);
            //  4. Clear Fields
            UICtrl.clearFields();
            //  5. Calculate and Update Budget on UI
        } else {
            swal({
                title: "Something Going Wrong!",
                text: "Please Try again!",
                icon: "error",
                button: "Exit!",
                dangerMode: true,
            });
        }
    };


    return {
        init: function () {
            console.log("Application has Started");
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();