fetch ("https://projet-5-production.up.railway.app/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(productsData) {
    const eltItems = document.getElementById('items');
    for (let product of productsData) {
      eltItems.innerHTML += `<a href="/html/product.html?id=${product._id}"> 
      <article>
        <img src= "${product.imageUrl}" alt= "${product.altTxt}">
        <h3 class="productName">${product.name}</h3>
        <p class="productDescription">${product.description}</p>
      </article>
      </a>`; 
    } 
  /*le += (ligne12) va concaténer, itérer pour afficher tous les produits
  sans ça avec qu'un = il nous affiche que le dernier canapé*/
  });



