const CORS = 'https://'
const API_MEAL_URL = CORS + 'www.themealdb.com/api/json/v1/1/';
const API_SEARCH_NAME = API_MEAL_URL + 'search.php?s=' // dish name at the end

const SEARCH_DISPLAY = $('#search-display');
var dataObject;
fetchData();
function fetchData() {
    fetch(API_SEARCH_NAME + 'chicken').then(function(response) {
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

function selectRecipe(event) {
    let recipe = dataObject.meals[event.target.parentNode.id];
    SEARCH_DISPLAY.empty();
    renderSelectedRecipe(recipe);
};

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