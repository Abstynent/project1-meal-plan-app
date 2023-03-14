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
// Arrays for Categories and Area
const MEAL_CATEGORIES = [
    "Beef", "Breakfast", "Chicken", "Dessert",
    "Goat", "Lamb", "Pasta", "Pork",
    "Seafood", "Side", "Starter",
    "Vegan", "Vegetarian", "Miscellaneous"
];
const MEAL_AREAS = [
    "American", "British", "Canadian", "Chinese",
    "Croatian", "Dutch", "Egyptian", "French",
    "Greek", "Indian", "Irish", "Italian",
    "Jamaican", "Japanese", "Kenyan", "Malaysian",
    "Mexican", "Moroccan", "Polish", "Portuguese",
    "Russian", "Spanish", "Thai", "Tunisian",
    "Turkish", "Unknown", "Vietnamese"
];
const COCKTAIL_CATEGORIES = [
    "Cocktail", "Shake", "Cocoa", "Shot",
    "Coffee / Tea", "Homemade Liqueur", "Punch / Party Drink",
    "Beer", "Soft Drink", "Other"
];
const BTNS = document.querySelectorAll('button');
const SEARCH_DISPLAY = $('<div id="search-display" class="columns is-align-items-center is-centered is-multiline">'); 
const SEARCH = $('#search');
const SELECT_MEAL_CATEGORY = $('#meal-category-select');
const SELECT_MEAL_AREA = $('#meal-area-select');
const SELECT_COCKTAIL_CATEGORY = $('#cocktail-category-select');
const SELECT_COCKTAIL_ALCOHOLIC = $('#cocktail-alcoholic');

let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
let currentRecipe;
let backHandler;
let meal;
// <-------------------- FUNCTIONS TO DISPLAY LIST OF ITEMS FROM API REQUEST
// function to generate list based on user selection 
// h -> handler to determinate if user is looking for meal or drink. h == true -> meal, false -> drink
function fetchData(url, h) { 
    fetch(url).then(function(response) {
        if(response.ok) { 
            response.json().then(function (data) {
                let handler = h ? data.meals : data.drinks;
                if(handler === null) { 
                    displayErroMsg(true);
                    return; 
                };

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
                    backHandler = handler;
                    meal = h;         
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
                currentRecipe = data["meals"];
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
    let instructionsEl = $('<div id="recipe-description" class="rows m-4">').text(handler[0].strInstructions);
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
    
    let btn = document.createElement('button');
    btn.setAttribute('id', 'savebtn');
    btn.innerHTML = 'save recipe';
    let back = document.createElement('button');
    back.innerHTML = 'back';
    back.setAttribute('id', 'backbtn');

    SEARCH_DISPLAY.append(recipeColumnEl);
    recipeColumnEl.append(recipeTitleEl).append(ingredientsTableEl);
    ingredientsTableEl.append(ingredientsTableBodyEl);
    
    let len = h ? 21 : 16;
    for(let i=1; i<len; i++) {
        if(recipe["strIngredient" + i] !== "" && recipe["strIngredient" + i] !== null) {
                let ingredientsTableRowEl = $('<tr>');
                let ingredientsTableMeasureEl = $('<td>').text(recipe["strMeasure" + i]);
                let ingredientsTableItemEl = $('<td>');
                let ingredientsLinkEl = 
                    $('<a id="' + recipe["strIngredient" + i] +'" value="' + h 
                    + '" onclick="fetchSearchByIngredient(event)">').text(recipe["strIngredient" + i]);
                    let buttonRow = $('<tr>');

                ingredientsTableItemEl.append(ingredientsLinkEl);
    
                ingredientsTableBodyEl.append(ingredientsTableRowEl);
                ingredientsTableBodyEl.append(buttonRow);
                buttonRow.append(back);
                buttonRow.append(btn);
                ingredientsTableRowEl.append(ingredientsTableMeasureEl);
                ingredientsTableRowEl.append(ingredientsTableItemEl);
        };
    };
    document.getElementById('savebtn').addEventListener('click', save);
    document.getElementById('backbtn').addEventListener('click', previous);
};

function fetchSearchByIngredient(e) { 
    let h = e.target.getAttribute('value') === "true" ? true : false;
    let value = e.target.text;
    let url = h ? API_MEAL_URL : API_COCKTAIL_URL;
    SEARCH_DISPLAY.empty();
    $('#recipe-description').remove();
    fetchData(url + API_FILTER_INGREDIENT + value, h);
};

function save (){
    let data = JSON.parse(localStorage.getItem("savedRecipes"));
    
    savedRecipes.push(currentRecipe);
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    
}

SEARCH.on('click', function(event) {
    if(event.target.id === 'submit-btn') {
        let value = $('input[name="input-box"').val();
        if(value.length < 1) {
            displayErroMsg(false);
            return;
        }
        switch(event.target.value) {
            case 'mealSbmName': fetchData(API_MEAL_URL + API_SEARCH_NAME + value, true); break;
            case 'mealSbmIngredient': fetchData(API_MEAL_URL + API_FILTER_INGREDIENT + value, true); break;
            // case 'mealSbmCategory':  fetchData(API_MEAL_URL + API_FILTER_CATEGORY + value, true); break;
            // case 'mealSbmArea': fetchData(API_MEAL_URL + API_FILTER_AREA + value, true); break;

            case 'cocktailSbmName': fetchData(API_COCKTAIL_URL + API_SEARCH_NAME + value, false); break;
            case 'cocktailSbmIngredient': fetchData(API_COCKTAIL_URL + API_FILTER_INGREDIENT + value, false); break;
            // case 'cocktailSbmCategory': fetchData(API_COCKTAIL_URL + API_FILTER_CATEGORY + false); break;
        };
    };
});
BTNS.forEach(btn => {
    btn.addEventListener('click', makeButton);
})

function makeButton(e) {
    let parent = document.getElementById('search-by-div');
    let name = e.target.id;
    let div = document.getElementById('search-form');
    div.remove();

    let param = window.location.search;
    param = param.substring(1,param.length);


    let newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'search-form is-flex column m-2 p-2 is-flex-wrap-wrap');
    newDiv.setAttribute('id', 'search-form');
    const label = document.createElement('label')
    let input = document.createElement('input');
    input.setAttribute('id', 'search-box-input')
    input.setAttribute('name', 'input-box');
    input.setAttribute('class', "input is-primary is-rounded")
    label.setAttribute('for' ,param + name);
    let button = document.createElement('button');
    button.setAttribute('value', param + 'Sbm'+ name);
    button.setAttribute('id','submit-btn');
    button.setAttribute('class','button shadow is-warning m-3 p-4 is-rounded');
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

// append elements in select tags on the search page, based on user selection meal/drink
function appendSelectEl(option) {
    if(option) {
        for(let i=0; i<MEAL_CATEGORIES.length; i++) {
            let element = $('<option value="' + MEAL_CATEGORIES[i] + '">').text(MEAL_CATEGORIES[i]);
            $('#meal-category-select').append(element)
        };

        for(let i=0; i<MEAL_AREAS.length; i++) {
            let element = $('<option value="' + MEAL_AREAS[i] + '">').text(MEAL_AREAS[i]);
            $('#meal-area-select').append(element)
        };
    } else {
        for(let i=0; i<COCKTAIL_CATEGORIES.length; i++) {
            let element = $('<option value="' + COCKTAIL_CATEGORIES[i] + '">').text(COCKTAIL_CATEGORIES[i]);
            $('#cocktail-category-select').append(element)
        };
    }
}

$(function() {
    let path = getPathValue();

    if(path === "search.html") {
        let selectedOption =  window.location.search; // can that be in jquery?
        if(selectedOption === "?meal") {
            appendSelectEl(true);
            // $('#meal-area-div').hide();
            // $('#meal-category-div').hide();
            $('#cocktail-category-div').hide();
            $('#cocktail-alcoholic-div').hide();
        } else if(selectedOption === "?cocktail") {
            $('#meal-area-div').hide();
            $('#meal-category-div').hide();
            appendSelectEl(false);
        } else { // go back to index.html if selection was not made
            window.location.href = "index.html";
        };
    }
});


function getPathValue() {
    let path = $(location).attr('pathname');
    return path.slice(path.lastIndexOf("/")+1);
};
// Function to create dom element and display it on the page in case of fetch error
function displayErroMsg(bln) {
    let value = $('input[name="input-box"').val();
    $('.error-msg').remove();

    let msg = bln ? $('<h1>').text('"' + value + '" not found.') : $('<h1>').text('Input field cannot be empty.');
    msg.addClass('has-text-danger title error-msg');
    msg.insertBefore('#search-box-input');

};

// SELECT event listeners
SELECT_MEAL_CATEGORY.change(function() {
    let value = SELECT_MEAL_CATEGORY.val();
    fetchData(API_MEAL_URL + API_FILTER_CATEGORY + value, true);
});
SELECT_MEAL_AREA.change(function() {
    let value = SELECT_MEAL_AREA.val();
    fetchData(API_MEAL_URL + API_FILTER_AREA + value, true);
});
SELECT_COCKTAIL_CATEGORY.change(function() {
    let value = SELECT_COCKTAIL_CATEGORY.val();
    fetchData(API_COCKTAIL_URL + API_FILTER_CATEGORY + value, false);
});
SELECT_COCKTAIL_ALCOHOLIC.change(function() {
    let value = SELECT_COCKTAIL_ALCOHOLIC.val();
    fetchData(API_COCKTAIL_URL + API_FILTER_AREA + value, false);
});


$(function() {
    if(window.location.search == "?meal") {
        let backNav = document.getElementById("navbar")
        let backBtn = document.createElement("div")
        backBtn.innerHTML = `<a href="./search.html?meal"><img class="positionbackbtn" src="./assets/images/left-arrow.png" /></a>`
        backNav.prepend(backBtn) 
    }
    else if(window.location.search == "?cocktail") {
        let backNav = document.getElementById("navbar")
        let backBtn = document.createElement("div")
        backBtn.innerHTML = `<a href="./search.html?cocktail"><img class="positionbackbtn" src="./assets/images/left-arrow.png" /></a>`
        backNav.prepend(backBtn);
    }
});

$(function() {
    if(window.location.search) {
        let backNav = document.getElementById("navbar")
        let homeBtn = document.createElement("div")
        homeBtn.innerHTML = `<a href="./index.html"><img class="positionbackbtn" src="./assets/images/home.png" /></a>`
        backNav.append(homeBtn);
       
    }
});

let currentTime = dayjs();

async function setTime() {
    let currentTime = dayjs();
    $("#currentDay").text(currentTime.format("MMM D YYYY"));
    $("#currentTime").text(currentTime.format("HH:mm:ss"));
  };
  setTime();
  setInterval(setTime, 1000);

function getPathValue() {
    let path = $(location).attr('pathname');
    return path.slice(path.lastIndexOf("/")+1);
};

// SELECT event listeners
SELECT_MEAL_CATEGORY.change(function() {
    let value = SELECT_MEAL_CATEGORY.val();
    fetchData(API_MEAL_URL + API_FILTER_CATEGORY + value, true);
});
SELECT_MEAL_AREA.change(function() {
    let value = SELECT_MEAL_AREA.val();
    fetchData(API_MEAL_URL + API_FILTER_AREA + value, true);
});
SELECT_COCKTAIL_CATEGORY.change(function() {
    let value = SELECT_COCKTAIL_CATEGORY.val();
    fetchData(API_COCKTAIL_URL + API_FILTER_CATEGORY + value, false);
});
SELECT_COCKTAIL_ALCOHOLIC.change(function() {
    let value = SELECT_COCKTAIL_ALCOHOLIC.val();
    fetchData(API_COCKTAIL_URL + API_FILTER_AREA + value, false);
});

function previous () {

    if (meal) {
        let parent = document.getElementById('search-display');
        while(parent.firstChild) {
            parent.removeChild(parent.lastChild);
        }
        let disc = document.getElementsByClassName('rows');
        while (disc.length > 0 ) {
            disc[0].parentNode.removeChild(disc[0]);
        }
        while(parent.firstChild) {
            parent.removeChild(parent.lastChild);
        }
        for(let i=0; i<backHandler.length; i++) {
            let img_url = backHandler[i].strMealThumb;
            let id = backHandler[i].idMeal;
            let strType = backHandler[i].strMeal;
            let column = $('<div class="column is-link border-radius is-one-fifth has-text-centered m-1">');
            let link = $('<a id="' + id + '" value="' + meal + '" onclick="selectRecipe(event)">');
            let img = $('<img class="shadow img border-radius" src="' + img_url + '" alt="' + strType +'">');
            let pTag = $('<p>').text(strType);
            let main = $('.main-content');
            main.empty().append(SEARCH_DISPLAY);
            
            SEARCH_DISPLAY.append(column);
            column.append(link);
            link.append(img).append(pTag);        
        };
}
if(!meal) {
    let parent = document.getElementById('search-display');
    while(parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
    let disc = document.getElementsByClassName('rows');
    while (disc.length > 0 ) {
        disc[0].parentNode.removeChild(disc[0]);
    }
    for(let i=0; i<backHandler.length; i++) {
        let img_url = backHandler[i].strDrinkThumb;
        let id = backHandler[i].idDrink;
        let strType = backHandler[i].strDrink;
        let column = $('<div class="column is-link border-radius is-one-fifth has-text-centered m-1">');
        let link = $('<a id="' + id + '" value="' + meal + '" onclick="selectRecipe(event)">');
        let img = $('<img class="shadow img border-radius" src="' + img_url + '" alt="' + strType +'">');
        let pTag = $('<p>').text(strType);
        let main = $('.main-content');
        main.empty().append(SEARCH_DISPLAY);
        
        SEARCH_DISPLAY.append(column);
        column.append(link);
        link.append(img).append(pTag); 
    }
}
}
