// API SETTINGS
const CORS = 'https://'
const API_MEAL_URL = CORS + 'www.themealdb.com/api/json/v1/1/';
const CAPI_ATEGORY_LIST = API_MEAL_URL + 'categories.php';
const API_RANDOM_MEAL = API_MEAL_URL + 'random.php';
const API_SEARCH_NAME = API_MEAL_URL + 'search.php?s=' // dish name at the end
const API_FILTER_INGREDIENT = API_MEAL_URL + 'filter.php?i=' // add ingredient
const API_FILTER_CATEGORY = API_MEAL_URL + 'filter.php?c=' // add category
const API_FILTER_AREA = API_MEAL_URL + 'filter.php?a=' // add country
const btns = document.querySelectorAll('button');
// <---- ---->

const SEARCH_DISPLAY = $('#search-display'); 
var dataObject; // save selected recipe
fetchData(API_SEARCH_NAME + 'chicken');

// <-------------------- FUNCTIONS TO DISPLAY LIST OF ITEMS FROM API REQUEST
// function to generate list based on user selection 1. by name 2. by ingredient 3. by category 4. by area (country)
function fetchData(url) { 
    fetch(url).then(function(response) {
        if(response.ok) { 
            response.json().then(function (data) {
                dataObject = data;
                for(let i=0; i<data.meals.length; i++) {
                    let img_url = data.meals[i].strMealThumb;
                    let column = $('<div class="column is-link has-background-primary is-one-fifth has-text-centered m-1">');
                    let link = $('<a id="' + i + '" onclick="selectRecipe(event)">');
                    let img = $('<img width=200 src="' + img_url + '" alt="' + data.meals[i].strMeal +'">');
                    let pTag = $('<p>').text(data.meals[i].strMeal);

                    SEARCH_DISPLAY.append(column);
                    column.append(link);
                    link.append(img).append(pTag);          
                };
            });
        };
    });
};

// function to display recipe based on user selection
function selectRecipe(event) {
    let recipe = dataObject.meals[event.target.parentNode.id];
    SEARCH_DISPLAY.empty();
    renderSelectedRecipe(recipe);
};

// create a container with recipe content
function renderSelectedRecipe(recipe) { 
    let imgColumnEl = $('<div class="column is-one-third">')
    let imgFrameEl = $('<figure class="image is-square">');
    let imgEl = $('<img  width=400 src="' + recipe.strMealThumb +'" alt="' + recipe.strMeal +'">');
    let instructionsEl = $('<div class="rows m-2">').text(recipe.strInstructions);
    imgColumnEl.append(imgFrameEl);
    imgFrameEl.append(imgEl);
    SEARCH_DISPLAY.append(imgColumnEl);

    renderIngredientsTable(recipe);
    $('body').append(instructionsEl);
};

// create table with ingredients to display in recipe content
function renderIngredientsTable(recipe) {
    let recipeColumnEl = $('<div class="column">');
    let recipeTitleEl = $('<h2 class="title is-2">').text(recipe.strMeal);
    let ingredientsTableEl = $('<table class="table is-bordered is-striped is-narrow is-hoverable">');
    let ingredientsTableBodyEl = $('<tbody>');
    let headMeasureEl = $('<th>').text('Measure');
    let headIngredientEl = $('<th>').text('Ingredient');
    ingredientsTableBodyEl.append(headMeasureEl).append(headIngredientEl);
    
    SEARCH_DISPLAY.append(recipeColumnEl);
    recipeColumnEl.append(recipeTitleEl).append(ingredientsTableEl);
    ingredientsTableEl.append(ingredientsTableBodyEl);
    
    for(let i=1; i<21; i++) {
        if(recipe["strIngredient" + i] !== "") {
            let ingredientsTableRowEl = $('<tr>');
            let ingredientsTableMeasureEl = $('<td>').text(recipe["strMeasure" + i]);
            let ingredientsTableItemEl = $('<td>').text(recipe["strIngredient" + i]);
    
            ingredientsTableBodyEl.append(ingredientsTableRowEl);
            ingredientsTableRowEl.append(ingredientsTableMeasureEl);
            ingredientsTableRowEl.append(ingredientsTableItemEl);
        };
    };
};



btns.forEach(btn => {
    btn.addEventListener('click', makeButton);
})

function makeButton(e) {
    let parent = document.getElementById('search');
    let name = e.target.id;
    let div = document.getElementById('search-form');
    div.remove();

    let newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'search-form');
    newDiv.setAttribute('id', 'search-form');
    const label = document.createElement('label')
    let input = document.createElement('input');
    input.setAttribute('id', 'food'+name)
    input.setAttribute('name', 'food'+name)
    label.setAttribute('for' ,'food'+name);
    label.innerText = name+":";
    let button = document.createElement('button');
    button.setAttribute('id', 'sbm'+name);


    newDiv.appendChild(label);
    newDiv.appendChild(input);
    newDiv.appendChild(button);
    parent.appendChild(newDiv);

    $('[id^="sbm"]').click(function() {

        // let name = document.querySelector('label').innerText;
        let type = e.target.id;
        let searchEl = $('[id^="food"]').val();
        let searchType = {
            type: type,
            search: searchEl
        }

        localStorage.setItem("searchBy", JSON.stringify(searchType));
    })
}
