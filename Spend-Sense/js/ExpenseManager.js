export default class ExpenseManager {
    constructor(storage) {
        this.storage = storage;
        this.expenses = this.storage.getExpenses();
        this.budgetLimit = this.storage.getBudget();
    }

    addExpense(expense) {
        this.expenses.unshift(expense); // Add to beginning
        this.storage.saveExpenses(this.expenses);
    }

    setBudget(amount) {
        this.budgetLimit = amount;
        this.storage.saveBudget(amount);
    }

    getExpenses() {
        return this.expenses;
    }

    getTotalSpent() {
        return this.expenses.reduce((total, exp) => total + exp.amount, 0);
    }

    getCategoryBreakdown() {
        const breakdown = {};
        this.expenses.forEach(exp => {
            if (!breakdown[exp.category]) {
                breakdown[exp.category] = 0;
            }
            breakdown[exp.category] += exp.amount;
        });
        return breakdown;
    }

    clearAll() {
        this.expenses = [];
        this.storage.clear();
    }

    getBudgetStatus() {
        const total = this.getTotalSpent();
        const percentage = (total / this.budgetLimit) * 100;

        if (percentage < 50) return 'safe';
        if (percentage < 85) return 'warning';
        return 'danger';
    }
}
