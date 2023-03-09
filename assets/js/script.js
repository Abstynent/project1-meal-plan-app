// API SETTINGS
const CORS = 'https://'
const API_MEAL_URL = CORS + 'www.themealdb.com/api/json/v1/1/';
const API_COCKTAIL_URL = 'www.thecocktaildb.com/api/json/v1/1/';
const API_CATEGORY_LIST = 'categories.php';
const API_RANDOM = 'random.php';
const API_LOOKUP_ID = 'lookup.php?i=';
const API_SEARCH_NAME = 'search.php?s=' // dish name at the end
const API_FILTER_INGREDIENT = 'filter.php?i=' // add ingredient
const API_FILTER_CATEGORY = 'filter.php?c=' // add category
const API_FILTER_AREA = 'filter.php?a=' // add country
// <---- ---->

const BTNS = document.querySelectorAll('button');
const SEARCH_DISPLAY = $('<div id="search-display" class="columns is-centered is-multiline">'); 
const SEARCH = $('#search');
var dataObject; // save selected recipe
var submitBtnEl = $();

// <-------------------- FUNCTIONS TO DISPLAY LIST OF ITEMS FROM API REQUEST
// function to generate list based on user selection 1. by name 2. by ingredient 3. by category 4. by area (country)
function fetchData(url) { 
    fetch(url).then(function(response) {
        if(response.ok) { 
            response.json().then(function (data) {
                for(let i=0; i<data.meals.length; i++) {
                    let img_url = data.meals[i].strMealThumb;
                    let column = $('<div class="column is-link has-background-primary is-one-fifth has-text-centered m-1">');
                    let link = $('<a id="' + data.meals[i].idMeal + '" onclick="selectRecipe(event)">');
                    let img = $('<img width=200 src="' + img_url + '" alt="' + data.meals[i].strMeal +'">');
                    let pTag = $('<p>').text(data.meals[i].strMeal);
                    let main = $('.main-content');
                    main.empty().append(SEARCH_DISPLAY);
                    
                    SEARCH_DISPLAY.append(column);
                    column.append(link);
                    link.append(img).append(pTag);          
                };
            });
        };
    });
};
function fetchRecipeID(id) { // API_MEAL_URL + API_LOOKUP_ID + ID)
    fetch(API_MEAL_URL + API_LOOKUP_ID + id).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                renderSelectedRecipe(data);
            });
        };
    });
}; // 
// function to display recipe based on user selection
function selectRecipe(event) {
    // console.log(event.target.parentNode.id);
    // let recipe = dataObject.meals[event.target.parentNode.id];
    fetchRecipeID(event.target.parentNode.id);
};

// create a container with recipe content
function renderSelectedRecipe(recipe) { 
    let imgColumnEl = $('<div class="column is-one-third">')
    let imgFrameEl = $('<figure class="image is-square">');
    let imgEl = $('<img  width=400 src="' + recipe.meals[0].strMealThumb +'" alt="' + recipe.meals[0].strMeal +'">');
    let instructionsEl = $('<div class="rows m-2">').text(recipe.meals[0].strInstructions);
    imgColumnEl.append(imgFrameEl);
    imgFrameEl.append(imgEl);
    SEARCH_DISPLAY.empty().append(imgColumnEl);

    renderIngredientsTable(recipe.meals[0]);
    $('.hero-body').append(instructionsEl);
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
        console.log(recipe["strIngredient" + i])
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


SEARCH.on('click', function(event) {
    if(event.target.id === 'submit-btn') {
        let value = $('input[name="input-box"').val();

        switch(event.target.value) {
            case 'sbmname': fetchData(API_MEAL_URL + API_SEARCH_NAME + value); break;
            case 'sbmingredient': fetchData(API_MEAL_URL + API_FILTER_INGREDIENT + value); break;
            case 'sbmcategory':  fetchData(API_MEAL_URL + API_FILTER_CATEGORY + value); break;
            case 'sbmarea': fetchData(API_MEAL_URL + API_FILTER_AREA + value); break;
        };
    };
});
BTNS.forEach(btn => {
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
    input.setAttribute('name', 'input-box');
    label.setAttribute('for' ,'food'+name);
    label.innerText = name+":";
    let button = document.createElement('button');
    button.setAttribute('value', 'sbm'+name);
    button.setAttribute('id','submit-btn');

    newDiv.appendChild(label);
    newDiv.appendChild(input);
    newDiv.appendChild(button);
    parent.appendChild(newDiv);
}