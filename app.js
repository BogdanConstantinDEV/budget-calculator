// BUDGET CONTROLLER ================== -->
const budgetController = (function () {
    class Income {
        constructor(id, description, value) {
            this.id = id
            this.description = description
            this.value = value
        }
    }
    class Expense {
        constructor(id, description, value) {
            this.id = id
            this.description = description
            this.value = value
            this.percentage = -1
        }
        getIndividualPercentage() {
            if (data.budget > 0) {
                this.percentage = Math.round((this.value / data.totals.inc) * 100)
            } else {
                this.percentage = -1
            }
        }
    }

    let data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: 0
    }

    return {
        addItem(obj, type) {
            let ID, newItem

            // create an id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else {
                ID = 0
            }

            // create new item
            if (type === 'inc') {
                newItem = new Income(ID, obj.description, obj.value)
            } else if (type === 'exp') {
                newItem = new Expense(ID, obj.description, obj.value)
            }

            // add item to data structure
            data.allItems[type].push(newItem)
            data.totals[type] += newItem.value

            // update totals
            this.calculateBudget()

            // calculate percentage
            this.calculatePercentage()

        },
        getItem(type) {
            if (data.allItems[type].length > 0) {
                return data.allItems[type][data.allItems[type].length - 1]
            }
        },
        deleteItem(elem) {
            const type = elem.split('-')[0]
            const elemId = parseInt(elem.split('-')[1])

            // find item's index
            const allIds = data.allItems[type].map(el => el.id)
            const itemIndex = allIds.indexOf(elemId)
            if (itemIndex === -1) return

            // subtract item from totals
            const item = data.allItems[type][itemIndex]
            data.totals[type] = data.totals[type] - item.value

            // remove item from data structure
            data.allItems[type].splice(itemIndex, 1)

            // update budget in data structure
            this.calculateBudget()

        },
        calculateBudget() {
            data.budget = data.totals.inc - data.totals.exp
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
        },
        calculatePercentage() {
            data.allItems.exp.forEach(el => {
                el.getIndividualPercentage()
            })
        },
        getAllPercentages() {
            return data.allItems.exp.map(el => el.percentage)
        },
        getBudget() {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentaege: data.percentage
            }
        },
        test() {
            console.log(data)
        }
    }
})()
// ============================== <--







// UI CONTROLLER ================== -->
const UIcontroller = (function () {
    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        incomeList: '.income__list',
        expensesList: '.expenses__list',
        itemPercentageLabel: '.item__percentage',
        container: '.container',
        deleteButtonLabel: '.item__delete',
        budgetDate: '.budget__title--month'
    }

    function formatNumber(num, type) {
        num = Math.abs(num)
        num = num.toFixed(2)
        let int = num.split('.')[0]
        let dec = num.split('.')[1]
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.lentgh - 3, 3)
        }

        return `${type === 'inc' ? '+' : '-'} ${int}.${dec}`
    }

    return {
        getInputValues() {
            const type = document.querySelector(DOMstrings.inputType).value
            const description = document.querySelector(DOMstrings.inputDescription).value
            const value = parseFloat(document.querySelector(DOMstrings.inputValue).value)
            return {
                type,
                description,
                value
            }
        },
        getDomStrings() {
            return DOMstrings
        },
        displayBudget(obj) {
            let type
            if (obj.budget >= 0) {
                type = 'inc'
            } else {
                type = 'exp'
            }
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type)
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc')
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExpenses, 'exp')
            if (obj.budget > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentaege + '%'
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'
            }
        },
        clearFields() {
            const nodeList = document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`)
            nodeList.forEach(el => {
                el.value = ''
            })
            nodeList[0].focus()
        },
        addElement(obj, type) {
            let markup, element
            if (type === 'inc') {
                element = document.querySelector(DOMstrings.incomeList)

                markup = `<div class="item clearfix" id="inc-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${formatNumber(obj.value, type)}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
            } else if (type === 'exp') {
                element = document.querySelector(DOMstrings.expensesList)
                markup = `<div class="item clearfix" id="exp-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${formatNumber(obj.value, type)}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
            }
            element.insertAdjacentHTML('beforeend', markup)
        },
        displayPercentages(obj, percentages) {
            const nodeList = document.querySelectorAll(DOMstrings.itemPercentageLabel)
            nodeList.forEach((el, i) => {
                if (obj.budget > 0) {
                    el.textContent = percentages[i] + '%'
                } else {
                    el.textContent = '---'
                }
            })
        },
        toggleType() {
            const nodeList = document.querySelectorAll(`${DOMstrings.inputType}, ${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`)
            nodeList.forEach(el => el.classList.toggle('red-focus'))

            document.querySelector(DOMstrings.addButton).classList.toggle('red')
        },
        displayMonth() {
            const dateNow = new Date(Date.now()).toLocaleString('en-us', { month: 'long', year: 'numeric' })
            document.querySelector(DOMstrings.budgetDate).textContent = dateNow
        }

    }
})()
// ============================== <--








// GLOBAL CONTROLLER ================== -->
const controller = (function (budgetCtrl, UIctrl) {

    function setupEventListeners() {
        const DOMstr = UIctrl.getDomStrings()
        document.querySelector(DOMstr.addButton).addEventListener('click', ctrlAddItem)

        // add item
        document.addEventListener('keypress', e => {
            if (e.keyCode !== 13 || e.which !== 13) return
            ctrlAddItem()
        })

        // delete item
        document.querySelector(DOMstr.container).addEventListener('click', e => {
            const element = e.target.parentElement.parentElement.parentElement.parentElement
            if (!(element.id.startsWith('inc') || element.id.startsWith('exp'))) return
            ctrlDeleteItem(element)
        })

        // change type
        document.querySelector(DOMstr.inputType).addEventListener('change', UIctrl.toggleType)
    }


    function ctrlAddItem() {

        // get input values
        const inputValues = UIctrl.getInputValues()
        if (inputValues.description === '' || isNaN(inputValues.value) || inputValues === '') return

        // add new item in data structure
        budgetCtrl.addItem(inputValues, inputValues.type)

        // get new item
        const newItem = budgetController.getItem(inputValues.type)

        // update budget on UI
        const budget = budgetCtrl.getBudget()
        UIctrl.displayBudget(budget)

        // clear fields
        UIctrl.clearFields()

        // add markup
        UIctrl.addElement(newItem, inputValues.type)

        // display percentages
        const allPercentages = budgetCtrl.getAllPercentages()
        UIctrl.displayPercentages(budget, allPercentages)
    }

    function ctrlDeleteItem(elem) {

        // remove item from data structure
        budgetCtrl.deleteItem(elem.id)

        // remove morkup
        elem.parentElement.removeChild(elem)

        // update budget
        const budget = budgetCtrl.getBudget()
        UIctrl.displayBudget(budget)

    }

    return {
        init() {
            UIctrl.displayMonth()
            UIctrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentaege: -1
            })
            console.log('Application started')
            setupEventListeners()
        }
    }
})(budgetController, UIcontroller)
controller.init()
// ============================== <--