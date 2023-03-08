const CORS = 'https://'
const API_MEAL_URL = CORS + 'www.themealdb.com/api/json/v1/1/';
const API_SEARCH_NAME = API_MEAL_URL + 'search.php?s=' // dish name at the end

var searchDisplayEl = $('#search-display');
fetchData();
function fetchData() {
    fetch(API_SEARCH_NAME + 'chicken').then(function(response) {
        if(response.ok) { // if city exists (== connection success)
            response.json().then(function (data) {
                // console.log(data.meals.length);
                for(let i=0; i<data.meals.length; i++) {
                    let img_url = data.meals[i].strMealThumb;
                    let column = $('<div class="column is-link has-background-primary is-one-fifth has-text-centered m-1">');
                    let link = $('<a value="' + i + '" id="' + data.meals[i].idMeal + '">');
                    let img = $('<img width=200 src="' + img_url + '">');
                    let pTag = $('<p>').text(data.meals[i].strMeal);

                    searchDisplayEl.append(column);
                    column.append(link);
                    link.append(img).append(pTag);          
                };

            });
        };
    });
};

searchDisplayEl.on('click', function(event) {
    console.log(event.target);
});