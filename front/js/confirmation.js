const orderId = getOrderId()
displayOrderId(orderId)//Appel de la fonction et autre fonction paramétrée comme une constante

//Récupération orderId depuis URLSearchParams
function getOrderId() {
const queryString = window.location.search; //mise sur le document
let urlParams = new URLSearchParams(queryString);
return urlParams.get("orderId")
}

//Affichage numéro Commande sur la Page
function displayOrderId(orderId) {
const orderIdElement = document.querySelector("#orderId")
orderIdElement.textContent = orderId
}
