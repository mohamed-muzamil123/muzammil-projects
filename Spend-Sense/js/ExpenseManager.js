export default class ExpenseManager {
    constructor(storage) {
        this.storage = storage;
        this.expenses = this.storage.getExpenses();
        this.budgetLimit = this.storage.getBudget();
    }

    addExpense(expense) {
        // expense object now expects: { amount, category, date, type: 'income' | 'expense' }
        // Default to 'expense' if not provided for backward compatibility
        if (!expense.type) expense.type = 'expense';

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

    getTotalExpense() {
        return this.expenses
            .filter(exp => exp.type === 'expense' || !exp.type)
            .reduce((total, exp) => total + exp.amount, 0);
    }

    getTotalIncome() {
        return this.expenses
            .filter(exp => exp.type === 'income')
            .reduce((total, exp) => total + exp.amount, 0);
    }

    getBalance() {
        return this.getTotalIncome() - this.getTotalExpense();
    }

    // Keep this for backward compatibility if needed, or alias it
    getTotalSpent() {
        return this.getTotalExpense();
    }

    getCategoryBreakdown() {
        const breakdown = {};
        // Only breakdown expenses for now
        this.expenses
            .filter(exp => exp.type === 'expense' || !exp.type)
            .forEach(exp => {
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
        const total = this.getTotalExpense();
        const percentage = (total / this.budgetLimit) * 100;

        if (percentage < 50) return 'safe';
        if (percentage < 85) return 'warning';
        return 'danger';
    }
}
