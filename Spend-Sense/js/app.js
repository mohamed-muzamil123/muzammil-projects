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
            const type = uiManager.currentType; // Access current type from UI Manager

            if (amount && category) {
                expenseManager.addExpense({
                    amount,
                    category,
                    type,
                    date: new Date().toISOString()
                });

                uiManager.updateUI();
                form.reset();

                // Reset category selection visually
                document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
                document.getElementById('selectedCategory').value = '';

                // Keep the type selection as is, or reset? Usually keep it.
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
