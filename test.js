const API_URL = "https://www.themealdb.com/api/json/v1/1/categories.php";
const FILTER = "https://www.themealdb.com/api/json/v1/1/filter.php"
const formEl = document.querySelector("form");

fetch(API_URL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    const categories = data.categories;
    for (let i = 0; i < categories.length; i++) {
      const optionEl = document.createElement("option");
      optionEl.textContent = categories[i].strCategory;
      optionEl.value = categories[i].strCategory;
      formEl.category.append(optionEl);
    }
  });
formEl.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log(formEl.category.value);
  fetch(FILTER + "?c=" + formEl.category.value)
  .then(function(response){
    return response.json()
  })
  .then(function(data){
    console.log(data)

  })
});
