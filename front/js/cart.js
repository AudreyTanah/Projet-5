let cart = JSON.parse(localStorage.getItem('cart'));//Recupération tableau produits Local Storage
let productApi = [];
cart.forEach((product) => {
  let id = product.id; //id produit Local Storage
  //Récupération des autres données du produit en fonction de l'id
  const apiProductsUrl = 'https://projet-5-production.up.railway.app/api/products/';
  const productPage = apiProductsUrl + id;
  fetch(productPage)
    .then((response) => response.json())
    .then((data) => {
      productApi.push(data);
      const eltCart = document.getElementById('cart__items');
      eltCart.innerHTML += `<article class="cart__item" data-id=${product.id} data-color="${product.color}">
    <div class="cart__item__img">
      <img src="${data.imageUrl}" alt="${data.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${data.name}</h2>
        <p>${product.color}</p>
        <p class="price">${data.price}</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : ${product.quantity}</p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
    </article>`;
      addModifyQuantityListener();
      handleTotalPriceAndQuantity();
      deleteItem();
    });
});

function handleTotalPriceAndQuantity() {
  let totalPrice = 0;
  let totalQuantity = 0;
  const cardsItems = document.querySelectorAll(".cart__item");
  cardsItems.forEach(cardItem => {
    const cardItemQuantity = cardItem.querySelector(".itemQuantity");
    const quantityValue = Number(cardItemQuantity.value);
    const cardItemPrice = cardItem.querySelector(".price");
    const priceValue = Number(cardItemPrice.innerText);
    totalPrice += quantityValue * priceValue;
    totalQuantity += quantityValue;
  });
  const totalPriceDiv = document.getElementById("totalPrice");
  totalPriceDiv.innerText = totalPrice;
  const totalQuantityDiv = document.getElementById("totalQuantity");
  totalQuantityDiv.innerText = totalQuantity;
}
//Sélection de la div et écoute avec le addEventListener associé à la fonction modifyQuantity
function addModifyQuantityListener() {
  const getQuantityInputs = document.querySelectorAll('.itemQuantity');
  getQuantityInputs.forEach((input) => {
    input.addEventListener("change", modifyQuantity);
  });
}
function modifyQuantity(event) {
  const input = event.target;
  const quantityValue = Number(input.value);
  const article = input.closest('.cart__item');
  const articleId = article.dataset.id;
  const articleColor = article.dataset.color;
  const quantityDiv = input.previousElementSibling;//Cible l'élément de la balise p où il y a la quantité
  cart.forEach(item => {
    if (item.id === articleId && item.color === articleColor) {
      item.quantity = quantityValue;
      quantityDiv.innerText = `Qté : ${quantityValue}`;
      localStorage.setItem("cart", JSON.stringify(cart));//Quantité modifiée remise dans le Local Storage
    }
  });
  handleTotalPriceAndQuantity();//Appel dans la fonction modifyQuantity de cette fonction
}
//Supression du produit sur la Page Panier
function deleteItem() {
  const itemsToDelete = document.querySelectorAll('.deleteItem');
  itemsToDelete.forEach((itemToDelete) => {
    itemToDelete.addEventListener("click", deleteI);//Appel de la fonction DeleteI au ("click")
  });
}

function deleteI(event) {
  const article = event.target.closest('.cart__item');
  const articleId = article.dataset.id;
  const articleColor = article.dataset.color;
  
  const filterArray = [];//Nouveau tableau pour récupérer
  cart.forEach(function (item) {
    if (item.id !== articleId || item.color !== articleColor) { //Si l'articleId est différent de l'item.id
      filterArray.push(item);                                  //ou si l'articleColor est différent de l'item color
    }                                                         //Garde ces canapés et push-les dans le Local Storage
  });                                                        //Car ne correspondant plus au produit à supprimer ("click")
  cart = filterArray; //Nouveau tableau cart mis à jour à la supression d'un produit
  localStorage.setItem("cart", JSON.stringify(cart));
  article.remove();//Supression de l'article
  handleTotalPriceAndQuantity();//Appel de nouveau à la fonction
} //pour bien retirer le Total des produits et du Prix au ("click")



//...................................Commander.............................................
const orderButton = document.querySelector('#order');
orderButton.addEventListener("click", (e) => submitForm(e));
function submitForm(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert("Veuillez choisir un produit avant de remplir le formulaire !");
    return;
  }
  if (hasEmptyFields()) return; //Bloque le formulaire avant de l'envoyer
  if (isNameOrCityInvalid("#firstName", "Veuillez renseigner un prénom correct !")) return;
  if (isNameOrCityInvalid("#lastName", "Veuillez renseigner un nom correct !")) return;
  if (isNameOrCityInvalid("#city", "Veuillez renseigner une ville correcte !")) return;

  if (isEmailInvalid()) return;
  const body = makeRequestBody();
  fetch("https://projet-5-production.up.railway.app/api/products/order", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }
  }
  )
    .then((res) => res.json())
    .then((data) => {
      window.location.href = "/html/confirmation.html?orderId=" + data.orderId;
    })
    .catch((err) => console.log(err));
}

function hasEmptyFields() {
  const form = document.querySelector(".cart__order__form");
  const inputs = form.querySelectorAll("input");

  for (const input of inputs) {
    if (input.value === "") {
      alert("Veuillez remplir tous les champs");
      return true;
    }
  }
  return false;
}
//Fonction Prénom, Nom, Ville invalides
function isNameOrCityInvalid(nameSelector, errorMessage) {
  const name = document.querySelector(nameSelector).value.trim();
  const regex = /^[a-zéêèîïôöàâüû\s\-']{2,}$/i;

  if (regex.test(name) === false) {
    alert(errorMessage);
    return true;
  }

  return false;
}
//Fonction email invalide
function isEmailInvalid() {
  const email = document.querySelector("#email").value.trim();
  const regex = /^[A-Za-z0-9_.\-]+@[A-Za-z0-9_.\-]+\..+$/;
  if (regex.test(email) === false) {
    alert("Veuillez renseigner un email correct !");
    return true;
  }
  return false;
}
//Fonction Récupération des données inscrites dans le formulaire
function makeRequestBody() {
  const form = document.querySelector(".cart__order__form");
  const firstName = form.elements.firstName.value;
  const lastName = form.elements.lastName.value;
  const address = form.elements.address.value;
  const city = form.elements.city.value;
  const email = form.elements.email.value;
  const body = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: getIdsFromLocalStorage()
  };
  return body;
}
//Fonction Récupération Produit ids
function getIdsFromLocalStorage() {
  const ids = [];
  cart.forEach(function (product) {
    ids.push(product.id);
  });
  return ids;
}





















