import '@babel/polyfill'
import '../styles/style.css'


import * as budgetViews from './views/budgetViews'
import * as budgetModel from './models/budgetModel'



function setupEventListeners() {
    const DOMstrings = budgetViews.getDomStrings()

    // Add Listener
    document
        .querySelector('.add__btn')
        .addEventListener('click', ctrlAddItem)

    document
        .addEventListener('keypress', (e) => {
            if (e.keyCode !== 13) return
            ctrlAddItem()
        })

    // Delete Listener
    document
        .querySelector(DOMstrings.container)
        .addEventListener('click', e => {
            const element_ID = e.target.parentElement.parentElement.parentElement.parentElement.id
            if (!(element_ID.startsWith('inc') || element_ID.startsWith('exp'))) return
            ctrlDeleteItem(element_ID)
        })

    // Toggle red Listener
    document.querySelector(DOMstrings.addType).addEventListener('change', budgetViews.changeToRed)

}






// =============   ADD ITEM    =============

function ctrlAddItem() {

    // get field input data
    const inputData = budgetViews.getInput()

    // add item to budget controller
    const newItem = inputData.type === 'inc'
        ? new budgetModel.Income(inputData.type, inputData.description, inputData.value)
        : new budgetModel.Expense(inputData.type, inputData.description, inputData.value)
    budgetModel.addItem(newItem)

    // add the item to the UI
    budgetViews.addItemToHTML(newItem)

    // display the budget on the UI
    budgetViews.displayBudget(budgetModel.data.budget)

    // display totals on the ui
    budgetViews.displayTotals(budgetModel.data.totals, budgetModel.data.budget)

    // calculate percentages
    budgetModel.data.allItems.exp.forEach(el => el.calcPercentage())
    const allPerc = budgetModel.getPerc()
    budgetViews.calcPerc(allPerc, budgetModel.data.budget)

}

function ctrlDeleteItem(element_ID) {

    // delete item from the model
    budgetModel.deleteItem(element_ID)

    // delete element from markup
    budgetViews.deleteElement(element_ID)

    // display the budget on the UI
    budgetViews.displayBudget(budgetModel.data.budget)

    // display totals on the ui
    budgetViews.displayTotals(budgetModel.data.totals, budgetModel.data.budget)

    // calculate percentages
    budgetModel.data.allItems.exp.forEach(el => el.calcPercentage())
    const allPerc = budgetModel.getPerc()
    budgetViews.calcPerc(allPerc, budgetModel.data.budget)


}

// ========================


function init() {
    console.log('Application has started')
    setupEventListeners()
    budgetViews.markupReset()
}
init()