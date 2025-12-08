const keralaMeals = {
    breakfast: {
        veg: [
            "2 Appam + Vegetable Stew (Low Coconut)",
            "3 Idli + Sambar + Coconut Chutney (Small portion)",
            "1 Bowl Oats Upma with lots of veggies",
            "2 Dosa (Less Oil) + Tomato Onion Chutney",
            "Puttu (Small Cup) + Kadala Curry (Less Gravy)",
            "Ragi Dosa + Mint Chutney"
        ],
        nonVeg: [
            "2 Appam + Egg Roast (1 Yolk, 2 Whites)",
            "2 Idli + Chicken Stew (Light)",
            "2 Egg Omelette with Veggies + 1 Toast",
            "Puttu + Fish Curry (Kudam Puli style)",
            "Pallipalayam Chicken (Dry) + 1 Dosa"
        ]
    },
    lunch: {
        veg: [
            "Red Rice (1 Cup) + Thoran (Cabbage/Beans) + Moru Curry",
            "Red Rice (1 Cup) + Avial (No added oil) + Cucumber Kichadi",
            "Red Rice (1 Cup) + Sambar + Beetroot Thoran",
            "Vegetable Biryani (Less Oil, More Veggies) + Raita",
            "Red Rice (1 Cup) + Koottu Curry + Rasam"
        ],
        nonVeg: [
            "Red Rice (1 Cup) + Fish Curry (Mathi/Sardine) + Cabbage Thoran",
            "Red Rice (1 Cup) + Chicken Thoran (Breast) + Moru",
            "Red Rice (1 Cup) + Beef Ularthiyathu (Lean meat, less oil) + Cucumber salad",
            "Fish Molee (Light Coconut) + 1 Cup Rice + Beans Mezhukkupuratti"
        ]
    },
    dinner: {
        veg: [
            "2 Chapati + Mixed Veg Curry",
            "1 Bowl Vegetable Soup + Grilled Paneer Salad",
            "2 Chapati + Dal Tadka",
            "Wheat Dosa + Coconut Chammanthi",
            "Fruit Salad + 1 Glass Skimmed Milk"
        ],
        nonVeg: [
            "Grilled Fish + Steamed Veggies",
            "2 Chapati + Chicken Curry (No Coconut)",
            "Chicken Salad with Pepper and Lemon",
            "2 Egg Whites Boiled + 1 Chapati + Dal",
            "Fish Fry (Air/Pan fried less oil) + Salad"
        ]
    },
    snacks: [
        "Green Tea + 2 Marie Biscuits",
        "Handful of Roasted Peanuts (Unsalted)",
        "Buttermilk (Sambharam) with Ginger/Chilli",
        "1 Apple or Orange",
        "Cucumber Slices with Pepper"
    ]
};

// Grocery List Data
const essentials = {
    common: [
        "Red Rice or Matta Rice",
        "Coconut Oil (Cold Pressed)",
        "Mustard Seeds, Curry Leaves, Spices",
        "Green Tea / Coffee",
        "Vegetables: Cabbage, Beans, Carrot, Cucumber",
        "Shallots (Chinna Ulli), Ginger, Garlic, Green Chilli",
        "Fruits: Banana (Robusta), Papaya or Seasonal"
    ],
    veg: [
        "Whole Green Gram (Cherupayar)",
        "Bengal Gram (Kadala)",
        "Toor Dal & Moong Dal",
        "Paneer (Low Fat)",
        "Oats / Ragi Flour",
        "Milk / Curd"
    ],
    nonVeg: [
        "Eggs (Tray of 30)",
        "Chicken Breast (Lean)",
        "Fish (Sardine/Mackerel/Tuna)",
        "Lean Beef/Meat (Optional)",
        "Oats / Ragi Flour",
        "Curd"
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('diet-form');
    const inputSection = document.getElementById('input-section');
    const resultSection = document.getElementById('result-section');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Grocery Elements
    const groceryBtn = document.getElementById('grocery-btn');
    const groceryModal = document.getElementById('grocery-modal');
    const closeGrocery = document.getElementById('close-grocery');
    const groceryListItems = document.getElementById('grocery-list-items');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get Values
        const age = parseInt(document.getElementById('age').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const gender = document.getElementById('gender').value;
        const activity = parseFloat(document.getElementById('activity').value);
        const preference = document.querySelector('input[name="preference"]:checked').value;

        if (!age || !weight || !height) return;

        // Calculate Steps
        const bmr = calculateBMR(weight, height, age, gender);
        const tdee = bmr * activity;
        const deficit = 500; // Standard fat loss deficit
        const targetCalories = Math.round(tdee - deficit);
        const waterIntake = Math.round((weight * 0.033) * 10) / 10; // Approx 33ml per kg
        const bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);

        // Update UI
        displayResults(targetCalories, waterIntake, bmi, preference);

        // Switch Sections
        inputSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
        window.scrollTo(0, 0);
    });

    regenerateBtn.addEventListener('click', () => {
        const preference = document.querySelector('input[name="preference"]:checked').value;
        const currentCalories = document.getElementById('res-calories').innerText;
        generateWeeklyPlan(preference);

        const planContainer = document.getElementById('plan-container');
        planContainer.style.opacity = '0';
        setTimeout(() => {
            planContainer.style.opacity = '1';
        }, 200);
    });

    resetBtn.addEventListener('click', () => {
        resultSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
        window.scrollTo(0, 0);
    });

    // Grocery List Event Listeners
    if (groceryBtn) {
        groceryBtn.addEventListener('click', () => {
            const preference = document.querySelector('input[name="preference"]:checked').value;
            renderGroceryList(preference);
            groceryModal.classList.remove('hidden');
        });
    }

    if (closeGrocery) {
        closeGrocery.addEventListener('click', () => {
            groceryModal.classList.add('hidden');
        });
    }

    if (groceryModal) {
        groceryModal.addEventListener('click', (e) => {
            if (e.target === groceryModal) {
                groceryModal.classList.add('hidden');
            }
        });
    }

    function renderGroceryList(preference) {
        groceryListItems.innerHTML = '';
        let items = [...essentials.common];
        if (preference === 'veg') {
            items = [...items, ...essentials.veg];
        } else {
            items = [...items, ...essentials.nonVeg];
        }

        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'grocery-item';

            div.innerHTML = `
                <i class="fa-solid fa-angle-right grocery-icon"></i>
                <span>${item}</span>
            `;
            groceryListItems.appendChild(div);
        });
    }
});

function calculateBMR(weight, height, age, gender) {
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
        return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
}

function displayResults(calories, water, bmi, preference) {
    document.getElementById('res-calories').innerText = calories;
    document.getElementById('res-water').innerText = `${water}L`;
    document.getElementById('res-bmi').innerText = bmi;

    generateWeeklyPlan(preference);
}

function generateWeeklyPlan(preference) {
    const container = document.getElementById('plan-container');
    container.innerHTML = '';

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Helper to get random item
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const snacksList = keralaMeals.snacks;

    days.forEach((day, index) => {
        let breakfast, lunch, dinner;

        if (preference === 'veg') {
            breakfast = getRandom(keralaMeals.breakfast.veg);
            lunch = getRandom(keralaMeals.lunch.veg);
            dinner = getRandom(keralaMeals.dinner.veg);
        } else {
            // Mix it up slightly for non-veg (mostly non-veg meals)
            breakfast = Math.random() > 0.3 ? getRandom(keralaMeals.breakfast.nonVeg) : getRandom(keralaMeals.breakfast.veg);
            lunch = Math.random() > 0.2 ? getRandom(keralaMeals.lunch.nonVeg) : getRandom(keralaMeals.lunch.veg);
            dinner = Math.random() > 0.3 ? getRandom(keralaMeals.dinner.nonVeg) : getRandom(keralaMeals.dinner.veg);
        }

        const snack = getRandom(snacksList);

        const dayCard = document.createElement('div');
        dayCard.className = 'day-card fade-in-up';
        dayCard.style.animationDelay = `${0.1 + (index * 0.1)}s`;

        dayCard.innerHTML = `
            <div class="day-header">
                <span>${day}</span>
                <i class="fa-regular fa-calendar-check"></i>
            </div>
            <div class="meal-row">
                <div class="meal-label">Brekkie</div>
                <div class="meal-content">${breakfast}</div>
            </div>
            <div class="meal-row">
                <div class="meal-label">Lunch</div>
                <div class="meal-content">${lunch}</div>
            </div>
            <div class="meal-row">
                <div class="meal-label">Snack</div>
                <div class="meal-content">${snack}</div>
            </div>
             <div class="meal-row">
                <div class="meal-label">Dinner</div>
                <div class="meal-content">${dinner}</div>
            </div>
        `;

        container.appendChild(dayCard);
    });
}
