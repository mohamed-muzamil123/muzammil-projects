export default class UIManager {
    constructor(expenseManager) {
        this.expenseManager = expenseManager;
        this.categories = [
            { id: 'food', name: 'Food', icon: '🍔', color: '#10b981' },
            { id: 'travel', name: 'Travel', icon: '✈️', color: '#3b82f6' },
            { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#8b5cf6' },
            { id: 'bills', name: 'Bills', icon: '📄', color: '#f59e0b' },
            { id: 'other', name: 'Other', icon: '✨', color: '#64748b' }
        ];
    }

    init() {
        this.renderCategorySelection();
        this.setupBudgetModal();
        this.updateUI();
    }

    updateUI() {
        this.updateRadialProgress();
        this.renderTransactionList();
        this.renderBreakdown();
    }

    renderCategorySelection() {
        const grid = document.getElementById('categoryGrid');
        if (!grid) return;

        grid.innerHTML = this.categories.map(cat => `
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

    updateRadialProgress() {
        const total = this.expenseManager.getTotalSpent();
        const limit = this.expenseManager.budgetLimit;
        const percentage = Math.min((total / limit) * 100, 100);

        // Update Text
        document.getElementById('totalSpent').textContent = `$${total.toFixed(2)}`;
        const limitEl = document.getElementById('budgetLimit');
        if (limitEl) limitEl.textContent = `of $${limit.toLocaleString()}`;

        // Update Ring
        const circle = document.getElementById('progressRing');
        if (circle) {
            const radius = circle.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            const offset = circumference - (percentage / 100) * circumference;
            circle.style.strokeDashoffset = offset;

            // Color Logic
            const status = this.expenseManager.getBudgetStatus();
            let color = '#10b981'; // safe
            let message = 'You are doing great!';

            if (status === 'warning') {
                color = '#f59e0b';
                message = 'Approaching budget limit.';
            } else if (status === 'danger') {
                color = '#ef4444';
                message = 'Budget exceeded!';
            }

            circle.style.stroke = color;

            const statusEl = document.getElementById('statusMessage');
            if (statusEl) {
                statusEl.querySelector('.status-text').textContent = message;
                statusEl.style.color = color;
            }
        }
    }

    setupBudgetModal() {
        const modal = document.getElementById('budgetModal');
        const editBtn = document.getElementById('editBudgetBtn');
        const cancelBtn = document.getElementById('cancelBudget');
        const saveBtn = document.getElementById('saveBudget');
        const input = document.getElementById('newBudgetInput');

        if (!modal || !editBtn) return;

        const closeModal = () => modal.classList.remove('active');

        editBtn.addEventListener('click', () => {
            input.value = this.expenseManager.budgetLimit;
            modal.classList.add('active');
        });

        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        saveBtn.addEventListener('click', () => {
            const newBudget = parseFloat(input.value);
            if (newBudget && newBudget > 0) {
                this.expenseManager.setBudget(newBudget);
                this.updateUI();
                closeModal();
            }
        });
    }

    renderTransactionList() {
        const list = document.getElementById('transactionList');
        const expenses = this.expenseManager.getExpenses();

        if (expenses.length === 0) {
            list.innerHTML = '<div class="empty-state"><p>No expenses yet</p></div>';
            return;
        }

        list.innerHTML = expenses.map(exp => {
            const cat = this.categories.find(c => c.id === exp.category) || this.categories[4];
            return `
                <div class="transaction-item">
                    <div class="t-left">
                        <div class="t-icon" style="background: ${cat.color}20; color: ${cat.color}">${cat.icon}</div>
                        <div class="t-details">
                            <span class="t-cat">${cat.name}</span>
                            <span class="t-date">${new Date(exp.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <span class="t-amount">-$${exp.amount.toFixed(2)}</span>
                </div>
            `;
        }).join('');
    }

    renderBreakdown() {
        const list = document.getElementById('categoryList');
        const breakdown = this.expenseManager.getCategoryBreakdown();
        const total = this.expenseManager.getTotalSpent();

        if (total === 0) {
            list.innerHTML = '<div class="empty-state"><p>Add expenses to see breakdown</p></div>';
            return;
        }

        list.innerHTML = Object.entries(breakdown).map(([catId, amount]) => {
            const cat = this.categories.find(c => c.id === catId) || this.categories[4];
            const percent = ((amount / total) * 100).toFixed(1);
            return `
                <div class="category-item">
                    <div class="cat-info">
                        <div class="cat-indicator" style="background: ${cat.color}"></div>
                        <span>${cat.name}</span>
                    </div>
                    <div class="cat-stats">
                        <strong>$${amount.toFixed(2)}</strong>
                        <span style="font-size: 0.8rem; opacity: 0.7">(${percent}%)</span>
                    </div>
                </div>
            `;
        }).join('');
    }
}
