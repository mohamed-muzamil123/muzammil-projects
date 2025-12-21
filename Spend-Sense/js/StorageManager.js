export default class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'smart_expense_data';
    }

    getExpenses() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    saveExpenses(expenses) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(expenses));
    }

    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    getBudget() {
        const budget = localStorage.getItem(this.STORAGE_KEY + '_budget');
        return budget ? parseFloat(budget) : 2000;
    }

    saveBudget(amount) {
        localStorage.setItem(this.STORAGE_KEY + '_budget', amount);
    }
}
