/* 
const listaProductos = [
    { 
      id: "1", 
      // img: 'https://picsum.photos/300/400?random=1',
      title: "Vestido Elegance", 
      price: 99.99, 
      description: "Diseño moderno y elegante ideal para ocasiones especiales." 
   },
    { id: "2", title: "Blazer Premium", price: 129.99, description: "Estilo sofisticado y minimalista para cualquier ocasión." },
    { id: "3", title: "Conjunto Urban", price: 89.99, description: "Comodidad y estilo urbano combinados en una sola prenda." }
];
 */
let listaProductos = [];
let productShown = 0; // contador de productos
let productPerPage = 4; // cantidad de productos

function apiProduts() {
   fetch('https://dummyjson.com/products')
      .then( res => {
         return res.json();
      })
      .then( data => {
         console.log(data);
         listaProductos = data.products;
         console.log(listaProductos);
         
         crearProductos();
      })
      .catch( err => {console.log(err) })
}

// Recupera el carrito almacenado en localStorage.
// Si no existe, inicializa un array vacío.
let shoppingCart = JSON.parse(localStorage.getItem('productarticle')) || [];

// Recupera el precio total almacenado.
// Si no existe, comienza en 0.
let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

// Recupera la cantidad total de productos agregados.
// Si no existe, comienza en 0.
let count = parseInt(localStorage.getItem('totalCount')) || 0;


// Función encargada de mostrar los productos en carrito.html
const handleCart = () => {

   // Recupera el carrito almacenado.
   const shoppingCart =
      JSON.parse(localStorage.getItem('productarticle')) || [];

   // Recupera el total almacenado.
   const total =
      JSON.parse(localStorage.getItem('totalPrice')) || 0;

   // Obtiene el contenedor donde se mostrará el carrito.
   const carritoProduct = document.getElementById('itemProducts');

   // Si el contenedor no existe, sale de la función.
   if (!carritoProduct) return;

   // Si el carrito está vacío, muestra un mensaje.
   if (shoppingCart.length === 0) {
      carritoProduct.innerHTML =
         '<p>El carrito está vacío</p>';
      return;
   }

   // Elimina el mensaje inicial de carrito vacío.
   const emptyMessage = document.querySelector('.carrito-empty');

   if (emptyMessage) {
      emptyMessage.remove();
   }

   // Crea una tabla para mostrar los productos.
   const tabla = document.createElement('table');

   tabla.classList.add('name-class-tabla');

   // Encabezado de la tabla.
   let encabezado = `
      <thead>
         <tr>
            <th>Nombre del Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
         </tr>
      </thead>
   `;

   // Inicio del cuerpo de la tabla.
   let cuerpo = '<tbody>';

   // Recorre todos los productos del carrito.
   shoppingCart.forEach( producto => {

      cuerpo += `
         <tr>
            <td>${producto.title}</td>
            <td>$${producto.price}</td>
            <td>${producto.count}</td>
         </tr>
      `;
   });

   // Cierre del cuerpo de la tabla.
   cuerpo += '</tbody>';

/*
   Opcional:

   La variable "total" ya está disponible.
   Podrías mostrar el importe total del carrito
   debajo de la tabla.
*/

   // Inserta encabezado y cuerpo en la tabla.
   tabla.innerHTML = encabezado + cuerpo;

   // Agrega la tabla al contenedor.
   carritoProduct.appendChild(tabla);
};


// Función para vaciar completamente el carrito.
function limpiarCarrito() {

   // Solicita confirmación al usuario.
   if (confirm('Revise su pedido antes de finalizar la operación')) {

      // Reinicia las variables en memoria.
      shoppingCart = [];
      totalPrice = 0;
      count = 0;

      // Elimina los datos almacenados.
/*       localStorage.removeItem('productarticle');
      localStorage.removeItem('totalPrice');
      localStorage.removeItem('totalCount'); */
      localStorage.clear();

      // Recarga la página para actualizar la vista.
      location.reload();
   }
}


function crearProductos () {

   const nextProducts = listaProductos.slice(productShown,productPerPage + productShown);

   const cardProductos = document.getElementById('productCard');

   nextProducts.forEach( productos => {

      const card = document.createElement('article');
      card.className = 'product-card';

      // <img src="${productos.img}" alt="imagen de ${productos.title}"
      card.innerHTML = `

               <img src="${productos.images[0]}" alt="imagen de ${productos.title}"
                  class="product-image">

               <div class="product-content">

                  <h3 class="product-title">
                     ${productos.title}
                  </h3>

                  <p class="product-description">
                     ${productos.description}
                  </p>

                  <p class="product-price">
                     <span>Precio:</span> 
                     <span class="price">$${productos.price}</span>
                  </p>

                  <button type="button" class="product-button">
                     Añadir al Carrito
                  </button>

               </div>
      `;
      cardProductos.appendChild(card);
  } );
  
  // Obtiene todas las tarjetas de productos de la página.
  const articles = document.querySelectorAll('.product-card');
  
  // Recorre cada tarjeta para asociarle la funcionalidad del botón Comprar.
  articles.forEach( article => {
  
     // Obtiene el botón Comprar.
     const button = article.querySelector('.product-button');
  
     // Obtiene el nombre del producto.
     const titleProduct = article.querySelector('.product-title').textContent;
  
     // Obtiene el precio eliminando el símbolo "$".
     const priceProduct = article.querySelector('.product-price .price').textContent.slice(1);
  
     // Evento que se ejecuta al hacer clic en Comprar.
     button.addEventListener('click', () => {
  
        // Crea un objeto producto.
        const product = {
           title: titleProduct,
           price: priceProduct,
           count: 1,
        };
  
        /*
           MEJORA PENDIENTE:
  
           Actualmente cada clic agrega un nuevo objeto al carrito.
  
           Ejemplo:
           [
              { title: 'Vestido', count: 1 },
              { title: 'Vestido', count: 1 }
           ]
  
           Lo ideal sería verificar si el producto ya existe.
           Si existe:
              - aumentar su propiedad count
           Si no existe:
              - agregarlo al carrito
  
           Esto evitaría productos duplicados.
        */
  
        // Agrega el producto al array del carrito.
        shoppingCart.push(product);
  
        // Acumula el precio total.
        totalPrice += parseFloat(product.price);
  
        // Incrementa el contador general.
        count += 1;
  
        // Guarda el carrito actualizado.
        localStorage.setItem('productarticle', JSON.stringify(shoppingCart));
  
        // Guarda el total con dos decimales.
        localStorage.setItem('totalPrice', totalPrice.toFixed(2));
  
        // Guarda la cantidad total de productos.
        localStorage.setItem('totalCount', count);
  
        // Actualiza el contador visual del carrito.
        document.querySelector('.count').textContent = count;
     });
  });

  const btnMas = document.getElementById('mostrarProducts');
  productShown += 4

  /* total de productos */ 
//   btnMas.style.display = 'none';
}



// Espera a que el DOM esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {
   // Si existe el contenedor de productos, estamos en index.html
   if (document.getElementById('productCard')) {
      //crearProductos();
      apiProduts();

      const btnMas = document.getElementById('mostrarProducts');
      btnMas.addEventListener('click', crearProductos );

      
      if (count > 0) {
         document.querySelector('.count').textContent = count;
      }
   }

   // Si existe el contenedor del carrito, estamos en carrito.html
   if (document.getElementById('itemProducts')) {
      handleCart();
   }
});




