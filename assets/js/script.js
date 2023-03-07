const CORS = 'https://'
const MEAL_URL = CORS + 'www.themealdb.com/api/json/v1/1/list.php?i=list';
const CATEGORY_LIST = MEAL_URL + 'categories.php';
const RANDOM_MEAL = MEAL_URL + 'random.php';
const SEARCH_NAME = MEAL_URL + 'search.php?s=' // dish name at the end
const FILTER_INGREDIENT = MEAL_URL + 'filter.php?i=' // add ingredient
const FILTER_CATEGORY = MEAL_URL + 'filter.php?c=' // add category
const FILTER_AREA = MEAL_URL + 'filter.php?a=' // add country

fetchData();
function fetchData() {
    fetch(MEAL_URL).then(function(response) {
        if(response.ok) { // if city exists (== connection success)
            response.json().then(function (data) {
                console.log(data);

            });
        };
    });
};


