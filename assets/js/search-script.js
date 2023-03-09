const btns = document.querySelectorAll('button');

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
}

