const CORS = 'https://'
const API_MEAL_URL = CORS + 'www.themealdb.com/api/json/v1/1/';
const CAPI_ATEGORY_LIST = API_MEAL_URL + 'categories.php';
const API_RANDOM_MEAL = API_MEAL_URL + 'random.php';
const API_SEARCH_NAME = API_MEAL_URL + 'search.php?s=' // dish name at the end
const API_FILTER_INGREDIENT = API_MEAL_URL + 'filter.php?i=' // add ingredient
const API_FILTER_CATEGORY = API_MEAL_URL + 'filter.php?c=' // add category
const API_FILTER_AREA = API_MEAL_URL + 'filter.php?a=' // add country

const BTN_SEARCH_NAME = $('#search-name-btn');
const BTN_SEARCH_INGREDIENT = $('#search-ingredient-btn');
const BTN_RANDOM_SEARCH = $('#search-random');

BTN_SEARCH_NAME.on("click", function(event) {
    event.preventDefault();
    let name = $('#search-name-input').val();
    fetchData(API_SEARCH_NAME + name);
});

BTN_SEARCH_INGREDIENT.on("click", function(event) {
    event.preventDefault();
    let name = $('#search-ingredient-input').val();
    fetchData(API_FILTER_INGREDIENT + name);
});

BTN_RANDOM_SEARCH.on("click", function(event) {
    event.preventDefault();
    fetchData(API_RANDOM_MEAL);
});

$(function(){
    $("#includedContent").load("selection_page.html"); 
  });
  
function fetchData(url) {
    fetch(url).then(function(response) {
        if(response.ok) { // if city exists (== connection success)
            response.json().then(function (data) {
                console.log(data);

            });
        };
    });
};



// script.js:12 Uncaught TypeError: BTN_SEARCH_NAME.addEventListener is not a function
//     at script.js:12:17
