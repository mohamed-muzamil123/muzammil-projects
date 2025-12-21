import StorageManager from './StorageManager.js';
import ExpenseManager from './ExpenseManager.js';
import UIManager from './UIManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Managers
    const storage = new StorageManager();
    const expenseManager = new ExpenseManager(storage);
    const uiManager = new UIManager(expenseManager);

    // Initial Render
    uiManager.init();

    // Event Listeners
    const form = document.getElementById('expenseForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const amount = parseFloat(document.getElementById('amount').value);
            const category = document.getElementById('selectedCategory').value;

            if (amount && category) {
                expenseManager.addExpense({
                    amount,
                    category,
                    date: new Date().toISOString()
                });

                uiManager.updateUI();
                form.reset();

                // Reset category selection visually
                document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
                document.getElementById('selectedCategory').value = '';

                // Show success feedback (handled in UI Manager usually, but simple alert for now or custom toast)
                console.log('Expense added!');
            }
        });
    }

    // Clear History Listener
    const clearBtn = document.getElementById('clearHistory');
    const modal = document.getElementById('confirmModal');
    const cancelBtn = document.getElementById('cancelModal');
    const confirmBtn = document.getElementById('confirmDelete');

    if (clearBtn && modal) {
        clearBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });

        const closeModal = () => {
            modal.classList.remove('active');
        };

        cancelBtn.addEventListener('click', closeModal);

        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        confirmBtn.addEventListener('click', () => {
            expenseManager.clearAll();
            uiManager.updateUI();
            closeModal();
            // Optional: Show success toast
        });
    }
});
