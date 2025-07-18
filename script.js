// Event Listeners
document.getElementById('search-btn').addEventListener('click', getMealList);
document.getElementById('add-recipe-form').addEventListener('submit', addCustomRecipe);
document.addEventListener('DOMContentLoaded', () => {
    loadLocalRecipes();
    setupModalClose();
});

// Fetch and display API meals based on search
function getMealList() {
    const searchInputTxt = document.getElementById('search-input').value.trim();

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html = '';

            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <h3>${meal.strMeal}</h3>
                            <a href="https://www.themealdb.com/meal/${meal.idMeal}" target="_blank">View Recipe</a>
                        </div>
                    `;
                });
            } else {
                html = "No meals found!";
            }

            document.getElementById('meal-list').innerHTML = html;
            appendLocalRecipes();
        })
        .catch(error => {
            console.error(error);
            document.getElementById('meal-list').innerHTML = "Error fetching data. Please try again later.";
        });
}

// Add a custom recipe to localStorage
function addCustomRecipe(e) {
    e.preventDefault();

    const name = document.getElementById('new-name').value.trim();
    const ingredients = document.getElementById('new-ingredients').value.trim();
    const steps = document.getElementById('new-steps').value.trim();
    const image = document.getElementById('new-image').value.trim();

    if (name && ingredients && steps && image) {
        const recipe = { name, ingredients, steps, image };
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes.push(recipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));

        document.getElementById('add-recipe-form').reset();
        appendLocalRecipes();
    } else {
        alert("Please fill in all fields.");
    }
}

// Load recipes from localStorage when page loads
function loadLocalRecipes() {
    appendLocalRecipes();
}

// Append custom/local recipes from localStorage to the meal list
function appendLocalRecipes() {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const mealList = document.getElementById('meal-list');

    recipes.forEach((meal, index) => {
        if (document.querySelector(`[data-local-recipe="${index}"]`)) return;

        const div = document.createElement("div");
        div.className = "meal";
        div.setAttribute("data-local-recipe", index);

        div.innerHTML = `
            <img src="${meal.image}" alt="${meal.name}">
            <h3>${meal.name}</h3>
            <button class="view-btn" data-index="${index}">View Recipe</button>
        `;

        mealList.appendChild(div);

        div.querySelector('.view-btn').addEventListener('click', () => {
            document.getElementById("modal-title").innerText = meal.name;
            document.getElementById("modal-ingredients").innerText = meal.ingredients;
            document.getElementById("modal-steps").innerText = meal.steps;
            document.getElementById("recipe-modal").style.display = "flex";
        });
    });
}

// Modal close behavior
function setupModalClose() {
    document.querySelector(".close-btn").addEventListener('click', () => {
        document.getElementById("recipe-modal").style.display = "none";
    });

    window.addEventListener('click', e => {
        if (e.target === document.getElementById("recipe-modal")) {
            document.getElementById("recipe-modal").style.display = "none";
        }
    });
}
