const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const month = document.getElementById('month');
const filterBtn = document.getElementById('filter-btn');
const totalSavings = document.getElementById('total-savings');
const noTransactionsMessage = document.getElementById('no-transactions-message');

let transactions = [];
let chart = null;

// Initialize Chart.js
function initChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [], // Will be updated dynamically
            datasets: [{
                label: 'Expenses',
                data: [], // Will be updated dynamically
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update Chart with current transactions
function updateChart() {
    const labels = transactions.map(transaction => transaction.text);
    const data = transactions.map(transaction => Math.abs(transaction.amount));
    
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update(); // Update chart to reflect new data
}

// Add Transaction
function addTransaction(transaction) {
    transactions.push(transaction);
    addTransactionToList(transaction);
    updateValues();
    updateSavings();
    updateChart(); // Update chart with all transactions
}

// Add Transaction to the list
function addTransactionToList(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `${transaction.text} <span>${sign}₹${Math.abs(transaction.amount).toFixed(2)}</span>`;
    list.appendChild(item);
}

// Update Balance, Income, and Expenses
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    balance.innerText = `₹${total}`;
    money_plus.innerText = `+₹${income}`;
    money_minus.innerText = `-₹${expense}`;
}

// Update Total Savings
function updateSavings() {
    const income = transactions
        .filter(transaction => transaction.amount > 0)
        .reduce((acc, item) => (acc += item.amount), 0)
        .toFixed(2);
    
    const expense = transactions
        .filter(transaction => transaction.amount < 0)
        .reduce((acc, item) => (acc += Math.abs(item.amount)), 0)
        .toFixed(2);

    const savings = (income - expense).toFixed(2);

    totalSavings.innerText = `₹${savings}`;
}

// Filter Transactions by Month
filterBtn.addEventListener('click', function() {
    const selectedMonth = month.value;
    
    if (selectedMonth) {
        const [year, month] = selectedMonth.split('-');
        const filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getFullYear() === parseInt(year) && transactionDate.getMonth() + 1 === parseInt(month);
        });

        list.innerHTML = ''; // Clear current list
        if (filteredTransactions.length > 0) {
            filteredTransactions.forEach(addTransactionToList);
            noTransactionsMessage.style.display = 'none';
        } else {
            noTransactionsMessage.style.display = 'block';
        }
    }
});

// Initialize the chart after DOM content loads
document.addEventListener('DOMContentLoaded', function() {
    initChart();
});

// Handle new Transaction submission
form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (text.value && amount.value) {
        const transaction = {
            id: Math.floor(Math.random() * 100000),
            text: text.value,
            amount: +amount.value,
            date: new Date(),
        };

        // Add transaction and update state
        addTransaction(transaction);

        // Clear input fields after submission
        text.value = '';
        amount.value = '';
    } else {
        alert('Please fill in both fields.');
    }
});

// To-Do Pay List section elements
const todoForm = document.getElementById('todo-form');
const todoTextInput = document.getElementById('todo-text');
const todoAmountInput = document.getElementById('todo-amount');
const todoList = document.getElementById('todo-list');

let todoItems = [];

// Handle new To-Do item submission
todoForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const todoText = todoTextInput.value;
    const todoAmount = parseFloat(todoAmountInput.value);

    if (todoText && !isNaN(todoAmount)) {
        const todoItem = {
            id: Date.now(),
            text: todoText,
            amount: todoAmount,
            paid: false
        };

        todoItems.push(todoItem);
        addTodoItemToList(todoItem);
        todoTextInput.value = '';
        todoAmountInput.value = '';
    } else {
        alert('Please fill in both fields.');
    }
});

// Add To-Do item to the list
function addTodoItemToList(todoItem) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    if (todoItem.paid) {
        li.classList.add('paid');
    }
    li.innerHTML = `
        ${todoItem.paid ? '✔️ ' : ''}${todoItem.text} <span>Amount Due: ₹${todoItem.amount.toFixed(2)}</span>
        ${!todoItem.paid ? `<button class="remainder-btn" onclick="markAsPaid(${todoItem.id})">Mark as Paid</button>` : ''}
    `;
    todoList.appendChild(li);
}

// Mark a To-Do item as paid
window.markAsPaid = function(id) {
    const paidItem = todoItems.find(item => item.id === id);
    if (paidItem && !paidItem.paid) {
        // Mark the item as paid
        todoItems = todoItems.map(item => 
            item.id === id ? { ...item, paid: true } : item
        );

        // Create a transaction for the payment
        const paymentTransaction = {
            id: Math.floor(Math.random() * 100000),
            text: `Paid for: ${paidItem.text}`,
            amount: -paidItem.amount, // Subtract amount from savings
            date: new Date(),
        };

        // Add transaction and update state
        addTransaction(paymentTransaction);
        updateTodoList();
    }
};

// Update To-Do List
function updateTodoList() {
    todoList.innerHTML = '';
    todoItems.forEach(addTodoItemToList);
}
// Logout button functionality
document.getElementById('logout-btn').addEventListener('click', function() {
    // For demonstration, redirect to a login page
    // Modify this URL according to your actual login page
    window.location.href = 'login.html';
});
