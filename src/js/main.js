// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import { getJSON } from './utils/getJSON';


let persons,

    chosenHobbyFilter = 'all',

    chosenSortOption,

    hobbies = [];


async function start() {

    persons = await getJSON('/json/books.json');


    displayPersons();


}


function displayPersons() {

    // filter according to hobby and call displayPersons

    let filteredBooks = persons.filter(

        ({ hobby }) => chosenHobbyFilter === 'all'

            || chosenHobbyFilter === hobby

    );

    if (chosenSortOption === 'Last name') { sortByLastName(filteredBooks); }

    if (chosenSortOption === 'Age') { sortByAge(filteredBooks); }

    let htmlArray = filteredBooks.map(({

        id, title, author, description, category, price, image

    }) => /*html*/`
    
    <div class="col-lg-3 col-md-4 col-sm-6 book-row">
        <img class="book-image" src="${image}">
        <h5 class="book-title">${title}</h1>
        <p class="book-author">${author}</p>
        <p class="book-category"><span class="book-category-header">Category: </span>${category}</p>
        <p class="book-price">$${price}<button id="${id}" class="book-button btn btn-success">Add to Cart</button></p>
        
    </div>
   
  `);

    document.querySelector('.book-list').innerHTML = htmlArray.join('');


    let elements = []
    for (let i = 1; i <= filteredBooks.length; i++) {
        elements.push(document.getElementById(i.toString()))
        elements[i - 1].addEventListener("click", addToCart);
        elements[i - 1].myParam = elements[i - 1].id;
    }
}

let cart = []
async function addToCart(evt) {
    //alert(evt.currentTarget.myParam)
    cart.push(parseInt(evt.currentTarget.myParam) - 1)
    const myInt = parseInt(evt.currentTarget.myParam) - 1;

}

async function getDataArray() {
    const url = '/json/books.json'; // replace with your JSON endpoint URL

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            // data is the JSON object returned from the API
            const dataArray = [];
            dataArray.push(...data); // add the data to the dataArray
            return dataArray;
        })
        .catch(error => console.error(error));
}

let itemsInCart = []

let viewCart = async event => {
    try {
        const result = await getDataArray();

        // adds the title and price for every book in cart
        for (let i = 0; i < cart.length; i++) {
            // index 0 in the nested array holds the title, index 1 in the nested array hold price
            itemsInCart[i] = new Array(result[cart[i]].title, result[cart[i]].price)
        }

    } catch (error) {
        alert(error);
    }

};



//document.getElementById('viewCartButton').addEventListener("click", viewCart)


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("viewCartButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = async function () {

    await viewCart();
    let cartArray = [];
    for (let i = 0; i < cart.length; i++) {
        const htmlString = `
    
    <div class="col-lg-3 col-md-4 col-sm-6 book-row">
      <h5 class="book-title">${itemsInCart[i][0]}</h5>
      <p class="book-price">$${itemsInCart[i][1]}</p>
    </div>
    
  `;
        cartArray.push(htmlString);

    }

    document.getElementById('modal-text').innerHTML = cartArray.join('');
    modal.style.display = "block"

};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

start();
