export default class UIManager {
    constructor(expenseManager) {
        this.expenseManager = expenseManager;
        this.expenseCategories = [
            { id: 'food', name: 'Food', icon: '🍔', color: '#10b981' },
            { id: 'travel', name: 'Travel', icon: '✈️', color: '#3b82f6' },
            { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#8b5cf6' },
            { id: 'bills', name: 'Bills', icon: '📄', color: '#f59e0b' },
            { id: 'other', name: 'Other', icon: '✨', color: '#64748b' }
        ];
        this.incomeCategories = [
            { id: 'salary', name: 'Salary', icon: '💰', color: '#10b981' },
            { id: 'freelance', name: 'Freelance', icon: '💻', color: '#3b82f6' },
            { id: 'gift', name: 'Gift', icon: '🎁', color: '#8b5cf6' },
            { id: 'other', name: 'Other', icon: '✨', color: '#64748b' }
        ];
        this.currentType = 'expense'; // 'expense' or 'income'
    }

    init() {
        this.renderCategorySelection();
        this.setupTypeToggle();
        this.updateUI();
    }

    updateUI() {
        this.renderSummaryCard();
        this.renderBalance();
        this.renderTransactionList();
        // this.renderBreakdown(); // Optional: Removed from main view in new design, but could be added back if needed
    }

    setupTypeToggle() {
        const toggles = document.querySelectorAll('.toggle-btn');
        toggles.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentType = btn.dataset.type;

                // Update UI State
                toggles.forEach(t => t.classList.remove('active'));
                btn.classList.add('active');

                // Update Form UI
                const submitBtn = document.getElementById('submitBtn');
                const submitText = submitBtn.querySelector('.btn-text');

                if (this.currentType === 'income') {
                    submitBtn.classList.add('btn-income');
                    submitText.textContent = 'Add Income';
                } else {
                    submitBtn.classList.remove('btn-income');
                    submitText.textContent = 'Add Expense';
                }

                // Refresh Categories
                this.renderCategorySelection();
            });
        });
    }

    renderCategorySelection() {
        const grid = document.getElementById('categoryGrid');
        if (!grid) return;

        const categories = this.currentType === 'income' ? this.incomeCategories : this.expenseCategories;

        grid.innerHTML = categories.map(cat => `
            <div class="category-card" data-id="${cat.id}">
                <span class="category-icon">${cat.icon}</span>
                <span class="category-name">${cat.name}</span>
            </div>
        `).join('');

        // Event Delegation
        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.category-card');
            if (card) {
                const id = card.dataset.id;
                this.selectCategory(id);
            }
        });
    }

    selectCategory(id) {
        document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
        const selected = document.querySelector(`.category-card[data-id="${id}"]`);
        if (selected) selected.classList.add('selected');

        const input = document.getElementById('selectedCategory');
        if (input) input.value = id;
    }

    renderBalance() {
        const balance = this.expenseManager.getBalance();
        const balanceEl = document.getElementById('currentBalance');
        if (balanceEl) {
            balanceEl.textContent = `$${balance.toFixed(2)}`;
            // Optional: Add color class based on positive/negative
            if (balance < 0) balanceEl.classList.add('negative');
            else balanceEl.classList.remove('negative');
        }
    }

    renderSummaryCard() {
        const income = this.expenseManager.getTotalIncome();
        const expense = this.expenseManager.getTotalExpense();
        const net = income - expense;

        document.getElementById('totalIncome').textContent = `$${income.toFixed(2)}`;
        document.getElementById('totalExpense').textContent = `$${expense.toFixed(2)}`;

        const netEl = document.getElementById('netSavings');
        netEl.textContent = `${net >= 0 ? '+' : ''}$${net.toFixed(2)}`;
        netEl.className = `value ${net >= 0 ? 'positive' : 'negative'}`;

        // Update Mini Chart
        const total = income + expense;
        if (total > 0) {
            const incomePercent = (income / total) * 100;
            const expensePercent = (expense / total) * 100;
            document.getElementById('incomeBar').style.width = `${incomePercent}%`;
            document.getElementById('expenseBar').style.width = `${expensePercent}%`;
        } else {
            document.getElementById('incomeBar').style.width = `0%`;
            document.getElementById('expenseBar').style.width = `0%`;
        }
    }

    renderTransactionList() {
        const list = document.getElementById('transactionList');
        const expenses = this.expenseManager.getExpenses();

        if (expenses.length === 0) {
            list.innerHTML = '<div class="empty-state"><p>No entries yet</p></div>';
            return;
        }

        // Group by Date
        const grouped = expenses.reduce((acc, curr) => {
            const date = new Date(curr.date).toLocaleDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(curr);
            return acc;
        }, {});

        list.innerHTML = Object.entries(grouped).map(([date, items]) => `
            <div class="timeline-group">
                <div class="timeline-date">${date}</div>
                <div class="timeline-items">
                    ${items.map(item => this.createTransactionItem(item)).join('')}
                </div>
            </div>
        `).join('');
    }

    createTransactionItem(item) {
        const isIncome = item.type === 'income';
        const categories = isIncome ? this.incomeCategories : this.expenseCategories;
        const cat = categories.find(c => c.id === item.category) || categories[categories.length - 1];

        return `
            <div class="transaction-item ${isIncome ? 'income-item' : 'expense-item'}">
                <div class="t-left">
                    <div class="t-icon" style="background: ${cat.color}20; color: ${cat.color}">${cat.icon}</div>
                    <div class="t-details">
                        <span class="t-cat">${cat.name}</span>
                        <span class="t-time">${new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
                <span class="t-amount">${isIncome ? '+' : '-'}$${item.amount.toFixed(2)}</span>
            </div>
        `;
    }
}
