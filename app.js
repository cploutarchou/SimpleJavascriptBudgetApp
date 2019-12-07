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

    //Private Function for total sum calculation based on passed type
    var calculateTotal = function (type) {
        var sum = 0;

        data.allItems[type].forEach(function (e) {
            sum = sum + e.value;
        });
        data.totals[type] = sum;
    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        },
        testing: function () {
            console.log(data);
        },
        calculateBudget: function () {
            //Calculate Total Income and Expenses
            calculateTotal('exp');
            calculateTotal('inc');
            //Calculate Budget : income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            //Calculate the percentage of income we spend
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        expensesHtmlContainer: '.expenses-list',
        budgetValue: '.budget-value',
        budgetIncome: '.income-value',
        budgetExpenses: '.expenses-value',
        expensesPercentage: '.expenses-percentage'

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

        }, displayBudget: function (data) {
            document.querySelector(DOMStrings.budgetValue).textContent = data.budget;
            document.querySelector(DOMStrings.budgetIncome).textContent = "+ " + "\u20AC" + data.totalInc;
            document.querySelector(DOMStrings.budgetExpenses).textContent = "- " + "\u20AC" + data.totalExp;

            if (data.percentage > 0) {
                document.querySelector(DOMStrings.expensesPercentage).textContent = data.percentage + "%";
            } else {
                document.querySelector(DOMStrings.expensesPercentage).textContent = '---';
            }

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
        budgetCtrl.calculateBudget();
        //  2. Return Budget
        var budget = budgetCtrl.getBudget();
        //  3. Display the Budget on UI
        UICtrl.displayBudget(budget);
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
            updateBudget();
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
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();