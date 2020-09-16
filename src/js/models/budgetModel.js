import { getDomStrings } from '../views/budgetViews'



const DOMstrings = getDomStrings()
export class Income {
    constructor(type, description, value) {
        this.type = type
        this.description = description
        this.value = value
        this.id = `inc-${Date.now()}`
    }
}
export class Expense {
    constructor(type, description, value) {
        this.type = type
        this.description = description
        this.value = value
        this.id = `exp-${Date.now()}`
        this.percentage = -1
    }
    calcPercentage() {
        if (data.budget > 0) {
            this.percentage = Math.round((this.value / data.totals.inc) * 100)
        } else {
            this.percentage = -1
        }
    }
}



export let data = {
    allItems: {
        inc: [],
        exp: []
    },
    totals: {
        inc: 0,
        exp: 0
    },
    budget: 0
}


// ADD ITEM
export function addItem(newItem) {
    if (
        document.querySelector(DOMstrings.inputDescription) === '' ||
        document.querySelector(DOMstrings.inputValue === '')
    ) return

    if (newItem.type === 'exp') {
        newItem.calcPercentage
    }

    // add new item
    data.allItems[newItem.type].push(newItem)

    // calc totals
    data.totals[newItem.type] += newItem.value

    // calc budged
    calcBudget()
}

// return all percentages
export function getPerc() {
    return data.allItems.exp.map(el => el.percentage)
}


// DELETE ITEM
export function deleteItem(itemID) {
    const type = itemID.startsWith('inc') ? 'inc' : 'exp'
    const itemIndex = data.allItems[type].findIndex(el => el.id === itemID)
    const value = data.allItems[type][itemIndex].value
    data.allItems[type].splice(itemIndex, 1)

    // calc totals
    data.totals[type] -= value

    // calc budget
    calcBudget()
}

function calcBudget() {
    data.budget = data.totals.inc - data.totals.exp
}

