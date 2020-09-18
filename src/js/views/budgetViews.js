const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    incList: '.income__list',
    expList: '.expenses__list',
    budget: '.budget__value',
    budget_IncomeValue: '.budget__income--value',
    budget_ExpensesValue: '.budget__expenses--value',
    budget_ExpensesPercentage: '.budget__expenses--percentage',
    itemPercentage: '.item__percentage',
    container: '.container',
    month: '.budget__title--month',
    addType: '.add__type',
    addBtn: '.add__btn'
}


// get values from the input
export function getInput() {
    const type = document.querySelector(DOMstrings.inputType).value  // inc || exp
    const description = document.querySelector(DOMstrings.inputDescription).value
    const value = document.querySelector(DOMstrings.inputValue).value
    return { type, description, value }
}

export function getDomStrings() {
    return DOMstrings
}

// add new Item to HTML
export function addItemToHTML(newItem) {
    const markupInc = `
        <div class="item" id="${newItem.id}">
            <div class="item__description">${newItem.description}</div>
            <div class="right">
                <div class="item__value">${formatNumber(newItem.value, 'inc')}</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>
    `
    const markupExp = `
        <div class="item" id="${newItem.id}">
            <div class="item__description">${newItem.description}</div>
            <div class="right">
                <div class="item__value">${formatNumber(newItem.value, 'exp')}</div>
                <div class="item__percentage">${newItem.percentage}%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>
    `
    document
        .querySelector(`${newItem.type === 'inc' ? DOMstrings.incList : DOMstrings.expList}`)
        .insertAdjacentHTML('beforeend', newItem.type === 'inc' ? markupInc : markupExp)

    resetInput()
}

// display budget
export function displayBudget(budget) {
    document.querySelector(DOMstrings.budget).textContent = `${formatNumber(budget, budget > 0 ? 'inc' : 'exp')}`
}

// display totals
export function displayTotals(totals, budget) {
    document.querySelector(DOMstrings.budget_ExpensesValue).textContent = formatNumber(totals.exp, 'exp')
    document.querySelector(DOMstrings.budget_IncomeValue).textContent = formatNumber(totals.inc, 'inc')
    document.querySelector(DOMstrings.budget_ExpensesPercentage).textContent = budget > 0 ? `${Math.round((totals.exp / totals.inc) * 100)}%` : '---'
}



// delete element
export function deleteElement(element_id) {
    const toRemove = document.getElementById(element_id)
    toRemove.parentElement.removeChild(toRemove)


}

// change input type color to red
export function changeToRed() {
    const nodeList = document.querySelectorAll(`${DOMstrings.inputType},${DOMstrings.inputDescription},${DOMstrings.inputValue}`)
    nodeList.forEach(el => el.classList.toggle('red-focus'))

    document.querySelector(DOMstrings.addBtn).classList.toggle('red')
}








// reset markup
export function markupReset() {
    document.querySelector(DOMstrings.budget).textContent = '+ 0.00'
    document.querySelector(DOMstrings.budget_ExpensesPercentage).textContent = '---'
    document.querySelector(DOMstrings.budget_ExpensesValue).textContent = '- 0.00'
    document.querySelector(DOMstrings.budget_IncomeValue).textContent = '+ 0.00'
    document.querySelector(DOMstrings.month).textContent = new Date(Date.now()).toLocaleString('en-us', { month: 'long', year: 'numeric' })
}

// reset input
function resetInput() {
    const nodeList = document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`)
    nodeList.forEach(el => el.value = '')
    nodeList[0].focus()
}

// format number
function formatNumber(num, type) {
    num = Math.abs(num)
    num = num.toFixed(2)
    let int = num.split('.')[0]
    let dec = num.split('.')[1]
    if (int.length > 3) {
        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3)
    }
    return `${type === 'inc' ? '+' : '-'} ${int}.${dec} `
}

export function calcPerc(allPerc, budget) {
    const percElem = document.querySelectorAll(DOMstrings.itemPercentage)
    if (budget > 0) {
        percElem.forEach((el, i) => {
            el.textContent = `${allPerc[i]}%`
        })
    } else {
        percElem.forEach(el => el.textContent = '---')
    }
}
