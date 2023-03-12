// API SETTINGS
const CORS = 'https://'
const API_MEAL_URL = CORS + 'www.themealdb.com/api/json/v1/1/';
const API_COCKTAIL_URL = CORS + 'www.thecocktaildb.com/api/json/v1/1/';
const API_CATEGORY_LIST = 'categories.php';
const API_RANDOM = 'random.php';
const API_LOOKUP_ID = 'lookup.php?i=';
const API_SEARCH_NAME = 'search.php?s=' // dish name at the end
const API_FILTER_INGREDIENT = 'filter.php?i=' // add ingredient
const API_FILTER_CATEGORY = 'filter.php?c=' // add category
const API_FILTER_AREA = 'filter.php?a=' // add country
// <---- ---->
const BTNS = document.querySelectorAll('button');
const SEARCH_DISPLAY = $('<div id="search-display" class="columns is-align-items-center is-centered is-multiline">'); 
const SEARCH = $('#search');

// <-------------------- FUNCTIONS TO DISPLAY LIST OF ITEMS FROM API REQUEST
// function to generate list based on user selection 
// h -> handler to determinate if user is looking for meal or drink. h == true -> meal, false -> drink
function fetchData(url, h) { 
    fetch(url).then(function(response) {
        if(response.ok) { 
            response.json().then(function (data) {
                let handler = h ? data.meals : data.drinks;

                for(let i=0; i<handler.length; i++) {
                    let img_url = h ? handler[i].strMealThumb : handler[i].strDrinkThumb;
                    let id = h ? handler[i].idMeal : handler[i].idDrink;
                    let strType = h ? handler[i].strMeal : handler[i].strDrink;
                    let column = $('<div class="column is-link border-radius is-one-fifth has-text-centered m-1">');
                    let link = $('<a id="' + id + '" value="' + h + '" onclick="selectRecipe(event)">');
                    let img = $('<img class="shadow img border-radius" src="' + img_url + '" alt="' + strType +'">');
                    let pTag = $('<p>').text(strType);
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

// function to display recipe based on user selection
function selectRecipe(event) {
    let h = event.target.parentNode.getAttribute("value") === 'true' ? true : false;
    fetchRecipeID(event.target.parentNode.id, h);
};

function fetchRecipeID(id, h) { 
    let url = h ? API_MEAL_URL : API_COCKTAIL_URL;
    fetch(url + API_LOOKUP_ID + id).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                renderSelectedRecipe(data, h);
            });
        };
    });
}; 

// create a container with recipe content
function renderSelectedRecipe(recipe, h ) { 
    let handler = h ? recipe.meals : recipe.drinks;
    let imgUrl = h ? handler[0].strMealThumb : handler[0].strDrinkThumb;
    let strType = h ? handler[0].strMeal : handler[0].strDrink;
    

    let imgColumnEl = $('<div class="column m-4">')
    let imgFrameEl = $('<figure class="image">');
    let imgEl = $('<img class="shadow image imgrecipe border-radius" src="' + imgUrl +'" alt="' + strType +'">');
    let instructionsEl = $('<div class="rows m-4">').text(handler[0].strInstructions);
    imgColumnEl.append(imgFrameEl);
    imgFrameEl.append(imgEl);
    SEARCH_DISPLAY.empty().append(imgColumnEl);

    renderIngredientsTable(handler[0], h);
    $('.hero-body').append(instructionsEl);
};

// create table with ingredients to display in recipe content
function renderIngredientsTable(recipe, h ) {
    let strType = h ? recipe.strMeal : recipe.strDrink;

    let recipeColumnEl = $('<div class="column m-4 is-flex is-flex-direction-column ">');
    let recipeTitleEl = $('<h2 class="title has-text-centered is-3">').text(strType);
    let ingredientsTableEl = $('<table class="table is-bordered is-striped is-narrow is-hoverable">');
    let ingredientsTableBodyEl = $('<tbody>');
    let headMeasureEl = $('<th>').text('Measure');
    let headIngredientEl = $('<th>').text('Ingredient');
    ingredientsTableBodyEl.append(headMeasureEl).append(headIngredientEl);
    
    SEARCH_DISPLAY.append(recipeColumnEl);
    recipeColumnEl.append(recipeTitleEl).append(ingredientsTableEl);
    ingredientsTableEl.append(ingredientsTableBodyEl);
    
    let len = h ? 21 : 16;
    for(let i=1; i<len; i++) {
        if(recipe["strIngredient" + i] !== "" && recipe["strIngredient" + i] !== null) {
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
            case 'mealSbmName': fetchData(API_MEAL_URL + API_SEARCH_NAME + value, true); break;
            case 'mealSbmIngredient': fetchData(API_MEAL_URL + API_FILTER_INGREDIENT + value, true); break;
            case 'mealSbmCategory':  fetchData(API_MEAL_URL + API_FILTER_CATEGORY + value, true); break;
            case 'mealSbmArea': fetchData(API_MEAL_URL + API_FILTER_AREA + value, true); break;

            case 'cocktailSbmName': fetchData(API_COCKTAIL_URL + API_SEARCH_NAME + value, false); break;
            case 'cocktailSbmIngredient': fetchData(API_COCKTAIL_URL + API_FILTER_INGREDIENT + value, false); break;
            case 'cocktailSbmCategory': fetchData(API_COCKTAIL_URL + API_FILTER_CATEGORY + false); break;
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

    let param = window.location.search;
    param = param.substring(1,param.length);


    let newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'search-form is-flex column is-flex-wrap');
    newDiv.setAttribute('id', 'search-form');
    const label = document.createElement('label')
    let input = document.createElement('input');
    input.setAttribute('id', param + name)
    input.setAttribute('name', 'input-box');
    input.setAttribute('class', "input is-primary is-rounded")
    label.setAttribute('for' ,param + name);
    let button = document.createElement('button');
    button.setAttribute('value', param + 'Sbm'+ name);
    button.setAttribute('id','submit-btn');
    button.setAttribute('class','button shadow is-warning m-2 p-2 is-rounded');
    button.innerHTML = "Submit"

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

// If user is searching for cocktail, remove 'area' button
$(function() {
    if(window.location.search !== "?meal") {
        $('#Area').hide();
        $('#Category').hide();
    }
});