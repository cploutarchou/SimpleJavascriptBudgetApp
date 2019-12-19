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
        this.percentage = -1;
    };
    Expense.prototype.calculatePercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

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
            var newItem, ID;
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
        deleteItem: function (type, id) {
            // debugger;
            var ids = data.allItems[type].map(function (e) {
                return e.id;
            });
            var index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
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
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (e) {
                e.calculatePercentage(data.totals.inc);
            })

        },
        getPercentages: function () {
            return allPerc = data.allItems.exp.map(function (e) {
                return e.getPercentage();
            });

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
        expensesPercentage: '.expenses-percentage',
        container: '.container',
        expensesPercentageLabel: '.item-percentage',
        dateLabel: '.title-month',
        sidebarMonth: '.month',
        sidebarYear: '.year'
    };
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var formatNumber = function (num, type) {
        var numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }

        dec = '.' + numSplit[1];

        return (type === 'exp' ? '-' : '+') + " " + int + dec;

    };
    return {
        getInput: function () {

            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        }, addListItem: function (itemObj, type) {
            var html, newHtml, element;
            if (type === 'inc') {
                element = DOMStrings.incomeHtmlContainer;

                //Creat Html String with placeholder text
                html = '<div class="item clearfix" id="inc-%id%"> ' +
                    '<div class="item-description">%description%</div> ' +
                    '<div class="right clearfix"> ' +
                    '<div class="item-value">%value%</div> ' +
                    '<div class="item-delete"> ' +
                    '<button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button> ' +
                    '</div></div> </div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesHtmlContainer;

                html = '<div class="item clearfix" id="exp-%id%">' +
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
            newHtml = newHtml.replace('%value%', formatNumber(itemObj.value, type));
            //Insert Html into DOM

            element = document.querySelector(element);
            element.insertAdjacentHTML('afterend', newHtml);

        }, deleteListItem: function (selectedIId) {
            var element = document.getElementById(selectedIId);
            element.parentNode.removeChild(element);
        }, clearFields: function () {
            fields = document.querySelectorAll(DOMStrings.inputDescription + "," + DOMStrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (e) {
                e.value = "";
            });
            //Set Focus back to description
            fieldsArray[0].focus();

        }, displayBudget: function (data) {
            data.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetValue).textContent = formatNumber(data.budget, type);
            document.querySelector(DOMStrings.budgetIncome).textContent = formatNumber(data.totalInc, 'inc');
            document.querySelector(DOMStrings.budgetExpenses).textContent = formatNumber(data.totalExp, 'exp');

            if (data.percentage > 0) {
                document.querySelector(DOMStrings.expensesPercentage).textContent = data.percentage + "%";
            } else {
                document.querySelector(DOMStrings.expensesPercentage).textContent = '---';
            }
        },

        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);
            var nodeListForeach = function (fields, callback) {
                for (var i = 0; i < fields.length; i++) {
                    callback(fields[i], i);
                }
            };
            nodeListForeach(fields, function (currentField, indexValue) {
                if (percentages[indexValue] > 0) {
                    currentField.textContent = percentages[indexValue] + '%';
                } else {
                    currentField.textContent = "---";
                }
            });
        },
        displayMonth: function () {
            var now, year, month;
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        }, showSidebarMonths: function () {
            var monthBtn;
            months.forEach(function (e) {
                console.log(e);
                monthBtn = document.createElement('a');
                monthBtn.href = '#';
                monthBtn.classList = 'sidebar-item ' + 'sidebar-button ' + ' month';
                monthBtn.text = e;
                console.log(monthBtn);
                document.getElementById('months').appendChild(monthBtn);
            });
        }, changedType: function () {
            var fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            fields.forEach(function (e) {
                e.classList.toggle('red-focus');
            });
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },
        getDomStrings: function () {
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
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function () {
        //  1. Calculate Budget
        budgetCtrl.calculateBudget();
        //  2. Return Budget
        var budget = budgetCtrl.getBudget();
        //  3. Display the Budget on UI
        UICtrl.displayBudget(budget);

    };

    var updatePercentages = function () {

        // 1. Calculate Percentages
        budgetCtrl.calculatePercentages();
        // 2. Read Percentages from budget controller
        var percentages = budgetCtrl.getPercentages();
        // 3. Update UI with new percentages
        UICtrl.displayPercentages(percentages);

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

            // 6. Calculate and update Percentages
            updatePercentages();
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

    var ctrlDeleteItem = function (event) {
        let itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // 1. Delete item from data structure
            budgetCtrl.deleteItem(type, ID);
            // 2. Delete item from UI
            UICtrl.deleteListItem(itemID);
            // 3. Update and Show new budget on UI
            updateBudget();
            // 4. Calculate and update Percentages
            updatePercentages();
        }
    };


    return {
        init: function () {
            console.log("Application has Started");
            UICtrl.displayMonth();
            UICtrl.showSidebarMonths();
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