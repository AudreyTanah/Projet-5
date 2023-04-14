let urlValue = window.location.href; //mise sur le document
let url = new URL(urlValue); //new(clé)
let searchParams = new URLSearchParams(url.search);
let id = "";
if (searchParams.has('id')) { //Récupère l'id et crée la condition pour récupérer les données
id = searchParams.get('id')
const apiProductsUrl = 'https://projet-5-production.up.railway.app/api/products/';
const productPage = apiProductsUrl + id;

fetch(productPage).then((response) => {return response.json()})
.then((data) => {
const eltProductImage = document.getElementsByClassName('item__img')[0];
eltProductImage.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}Photographie d'un canapé">`;
const eltTitle = document.getElementById('title');
eltTitle.innerHTML = `${data.name}`;
const eltPrice = document.getElementById('price');
eltPrice.innerHTML = `${data.price}`;
const eltDescription = document.getElementById('description');
eltDescription.innerHTML = `${data.description}`;


//crée l'Elément pour la balise color
let selectElement = document.createElement('select');
const colors = [];
for(let color of colors) {
  let optionElement = document.createElement('option');
  optionElement.setAttribute('value', color);
  optionElement.innerHTML = color;
  selectElement.appendChild(optionElement);
}
document.body.appendChild(selectElement);

//Itération options couleur
const eltColors = document.getElementById('colors'); 
for (let i=0; i<data.colors.length; i ++) {
  eltColors.innerHTML += `<option value="${data.colors[i]}">${data.colors[i]}</option>`
}
})

//Ecoute des mouvements des champs remplis par l'utilisateur sur la Page Produit
const button = document.querySelector('#addToCart')
button.addEventListener("click", click) 
function click() {
const color = document.querySelector('#colors').value
const quantity = document.querySelector('#quantity').value
if (isCartInvalid(color, quantity)) return 
saveDataColorQuantity(color,quantity)//Appel de la fonction(73 à 94) contenant plusieurs données pour direction sur la page Panier
}
}

//Message d'alerte pour remplir les champs + 
//Permet de rester sur la page au click sur le bouton Panier en cas de champs non remplis
function isCartInvalid(color, quantity) {
  if (color == null || color === '' || quantity == null || quantity == 0) {
    alert("Veuillez choisir une couleur et une quantité !")
    return true
  }
}

//..................................Local Storage...........................................
//Création du Panier Array avec les éléments du produit choisi par l'utilisateur
let cart = JSON.parse(localStorage.getItem('cart'));//Array cart récoltant tous les produits
if (cart == null) {
  localStorage.setItem('cart', JSON.stringify([]));
  cart = []; //Rajout
}

//Création fonction données d'un produit qui sera inséré dans le tableau du Local Storage
function saveDataColorQuantity(color, quantity) {
  const dataProduct = {
    id: id,
    color: color,
    quantity: Number(quantity)
  }
  let findProduct = cart.find(product => product.id === id && product.color === color);
  if (findProduct != undefined) {                 //condition pour additionner                           
    dataProduct.quantity += findProduct.quantity;//le même produit de même couleur                              
    findProduct.quantity = dataProduct.quantity;
    if (dataProduct.quantity > 100) {                                  //condition pour ne pas dépasser 100 produits 
      alert("Vous ne pouvez pas ajouter plus de 100 fois ce produit");//message d'alerte si dépassement
      return;
    }
    alert ("Le produit est déjà choisi. La quantité augmente")
  }

  if (findProduct === undefined) {//Si le findProduct (tableau du même produit de même couleur) 
    cart.push(dataProduct);      //est undefined - push les autres produits (dataProduct) dans le Local Storage
  }
  saveProducts(cart);//Appel de la fonction pour l'Ajout dans le Local Storage
  alert ("Le produit est bien ajouté au Panier") 
  window.location.href = "/html/cart.html";
  }
  //Ajout de la cart dans le Local Storage
    function saveProducts(cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
  }





