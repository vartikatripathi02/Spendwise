document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expenseForm');
    const expenseList = document.getElementById('expenseList');
    const totalExpensesElement = document.getElementById('totalExpenses');
    const remainingAmountElement = document.getElementById('remainingAmount');

    let totalExpenses = 0;
    const budget = 1000; // Set your initial budget here

    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const expense = document.getElementById('expense').value;
        const amount = parseFloat(document.getElementById('amount').value);

        if (expense && !isNaN(amount) && amount > 0) {
            const listItem = document.createElement('div');
            listItem.textContent = `${expense}: $${amount.toFixed(2)}`;
            expenseList.appendChild(listItem);

            totalExpenses += amount;
            updateSummary();
        }
    });

    function updateSummary() {
        totalExpensesElement.textContent = `$${totalExpenses.toFixed(2)}`;
        const remainingAmount = budget - totalExpenses;
        remainingAmountElement.textContent = `$${remainingAmount.toFixed(2)}`;
    }
});
