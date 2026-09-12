// =====================================================
// PEPTIVA
// =====================================================


// =====================================================
// GOOGLE APPS SCRIPT
// =====================================================

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxje_aP7klVE9F9vuDBKZk8ut2JxDmnLL825aKT4G7oacgKIuf6TTFlLx2oIR7bM7x/exec";


// =====================================================
// INSTAPAY
// =====================================================

const INSTAPAY_NUMBER =
  "alimekwy08@instapay";


const INSTAPAY_LINK =
  "https://ipn.eg/S/alimekwy08/instapay/4bRNlE";


// =====================================================
// PRODUCTS
// =====================================================

const products = [

  {
    id: "PT-001",
    name: "BPC-157 + TB-500 5/5 mg",
    category: "recovery",
    price: 3800,
    description:
      "Research-focused peptide combination.",
    image: "BPC VIAL.png"
  },


  {
    id: "PT-002",
    name: "Retatrutide 10mg",
    category: "research",
    price: 4600,
    description:
      "Research-focused product.",
    image: "RETA10MG.png"
  },


  {
    id: "PT-003",
    name: "SLU-PP-332 60 Capsules",
    category: "research",
    price: 4600,
    description:
      "Research-focused compound.",
    image: "SLU.png"
  },


  {
    id: "PT-004",
    name: "IGF-1 1mg",
    category: "research",
    price: 4600,
    description:
      "Research-focused product.",
    image: "igf1.png"
  },


  {
    id: "PT-005",
    name: "Retatrutide 20mg",
    category: "research",
    price: 8500,
    description:
      "Research-focused product.",
    image: "RETA10MG.png"
  },


  {
    id: "PT-006",
    name: "Trizpetide 60mg",
    category: "other",
    price: 8400,
    description:
      "Research-focused product.",
    image: "TRIZ VIAL.png"
  },


  {
    id: "PT-007",
    name: "GHK-CU 50mg",
    category: "research",
    price: 6000,
    description:
      "Research-focused product.",
    image: "GHK.png"
  },


  {
    id: "PT-008",
    name: "KPV 10mg",
    category: "research",
    price: 4800,
    description:
      "Research-focused peptide product.",
    image: "kpv.png"
  }

  
];


// =====================================================
// CART
// =====================================================

let cart =
  JSON.parse(
    localStorage.getItem(
      "peptidesCart"
    )
  ) || [];


// =====================================================
// SELECTED PRODUCT
// =====================================================

let selectedProduct = null;


// =====================================================
// START
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderProducts("all");

    updateCart();

    setupFilters();

    setupSearch();

    setupCart();

    setupCheckout();

    setupProductModal();

    setupMobileMenu();

  }
);


// =====================================================
// RENDER PRODUCTS
// =====================================================

function renderProducts(
  category = "all"
) {

  const grid =
    document.getElementById(
      "productsGrid"
    );


  if (!grid) return;


  grid.innerHTML = "";


  const searchInput =
    document.getElementById(
      "productSearch"
    );


  const searchTerm =
    searchInput
      ? searchInput.value
          .trim()
          .toLowerCase()
      : "";


  let filteredProducts =
    category === "all"
      ? products
      : products.filter(
          product =>
            product.category ===
            category
        );


  if (searchTerm) {

    filteredProducts =
      filteredProducts.filter(
        product =>
          product.name
            .toLowerCase()
            .includes(searchTerm)
      );

  }


  if (
    filteredProducts.length === 0
  ) {

    grid.innerHTML = `
      <div class="no-products">

        <h3>
          No products found
        </h3>

        <p>
          Try another search.
        </p>

      </div>
    `;

    return;

  }


  filteredProducts.forEach(
    product => {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "product-card";


      let imageHTML = "";


      if (product.image) {

        imageHTML = `

          <div class="product-image">

            <img
              src="${product.image}"
              alt="${product.name}"
              class="product-vial"
            >

          </div>

        `;

      }
      else {

        imageHTML = `

          <div class="product-image">

            <div class="product-placeholder">
              ${product.name.charAt(0)}
            </div>

          </div>

        `;

      }


      card.innerHTML = `

        ${imageHTML}


        <div class="product-info">

          <div class="product-category">
            ${product.category}
          </div>


          <h3>
            ${product.name}
          </h3>


          <p>
            ${product.description}
          </p>


          <div class="product-bottom">

            <strong>
              EGP ${formatPrice(product.price)}
            </strong>


            <button
              class="add-button"
              data-id="${product.id}"
              type="button"
            >
              Add to Cart
            </button>

          </div>

        </div>

      `;


      grid.appendChild(card);


      card.addEventListener(
        "click",
        event => {

          if (
            event.target.closest(
              ".add-button"
            )
          ) {

            return;

          }


          openProductModal(
            product
          );

        }
      );

    }
  );


  document
    .querySelectorAll(
      ".add-button"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            addToCart(
              button.dataset.id
            );

          }
        );

      }
    );

}


// =====================================================
// SEARCH
// =====================================================

function setupSearch() {

  const search =
    document.getElementById(
      "productSearch"
    );


  if (!search) return;


  search.addEventListener(
    "input",
    () => {

      const activeFilter =
        document.querySelector(
          ".filter.active"
        );


      renderProducts(
        activeFilter
          ? activeFilter.dataset.filter
          : "all"
      );

    }
  );

}


// =====================================================
// FILTERS
// =====================================================

function setupFilters() {

  const filters =
    document.querySelectorAll(
      ".filter"
    );


  filters.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          filters.forEach(
            item =>
              item.classList.remove(
                "active"
              )
          );


          button.classList.add(
            "active"
          );


          renderProducts(
            button.dataset.filter
          );

        }
      );

    }
  );

}


// =====================================================
// ADD TO CART
// =====================================================

function addToCart(
  productId
) {

  const product =
    products.find(
      item =>
        item.id === productId
    );


  if (!product) return;


  const existing =
    cart.find(
      item =>
        item.id === productId
    );


  if (existing) {

    existing.quantity += 1;

  }
  else {

    cart.push({

      id:
        product.id,

      name:
        product.name,

      price:
        product.price,

      quantity:
        1

    });

  }


  saveCart();

  updateCart();

  openCart();

}


// =====================================================
// REMOVE FROM CART
// =====================================================

function removeFromCart(
  productId
) {

  cart =
    cart.filter(
      item =>
        item.id !== productId
    );


  saveCart();

  updateCart();

}


// =====================================================
// CHANGE QUANTITY
// =====================================================

function changeQuantity(
  productId,
  amount
) {

  const item =
    cart.find(
      product =>
        product.id === productId
    );


  if (!item) return;


  item.quantity += amount;


  if (item.quantity <= 0) {

    removeFromCart(
      productId
    );

    return;

  }


  saveCart();

  updateCart();

}


// =====================================================
// SAVE CART
// =====================================================

function saveCart() {

  localStorage.setItem(
    "peptidesCart",
    JSON.stringify(cart)
  );

}


// =====================================================
// CART TOTAL
// =====================================================

function getCartTotal() {

  return cart.reduce(
    (
      total,
      item
    ) => {

      return (
        total +
        item.price *
        item.quantity
      );

    },
    0
  );

}


// =====================================================
// CART COUNT
// =====================================================

function getCartCount() {

  return cart.reduce(
    (
      total,
      item
    ) => {

      return (
        total +
        item.quantity
      );

    },
    0
  );

}


// =====================================================
// UPDATE CART
// =====================================================

function updateCart() {

  const cartCount =
    document.getElementById(
      "cartCount"
    );


  const cartItems =
    document.getElementById(
      "cartItems"
    );


  const cartTotal =
    document.getElementById(
      "cartTotal"
    );


  const checkoutTotal =
    document.getElementById(
      "checkoutTotal"
    );


  if (cartCount) {

    cartCount.textContent =
      getCartCount();

  }


  if (cartTotal) {

    cartTotal.textContent =
      `EGP ${formatPrice(
        getCartTotal()
      )}`;

  }


  if (checkoutTotal) {

    checkoutTotal.textContent =
      `EGP ${formatPrice(
        getCartTotal()
      )}`;

  }


  if (!cartItems) return;


  if (cart.length === 0) {

    cartItems.innerHTML = `

      <div class="empty-cart">

        <p>
          Your cart is empty.
        </p>

      </div>

    `;

    return;

  }


  cartItems.innerHTML = "";


  cart.forEach(
    item => {

      const cartItem =
        document.createElement(
          "div"
        );


      cartItem.className =
        "cart-item";


      cartItem.innerHTML = `

        <div class="cart-item-info">

          <h4>
            ${item.name}
          </h4>

          <span>
            EGP ${formatPrice(
              item.price
            )}
          </span>

        </div>


        <div class="cart-controls">

          <button
            class="quantity-button"
            data-action="minus"
            data-id="${item.id}"
            type="button"
          >
            −
          </button>


          <span>
            ${item.quantity}
          </span>


          <button
            class="quantity-button"
            data-action="plus"
            data-id="${item.id}"
            type="button"
          >
            +
          </button>


          <button
            class="remove-button"
            data-id="${item.id}"
            type="button"
          >
            ×
          </button>

        </div>

      `;


      cartItems.appendChild(
        cartItem
      );

    }
  );


  document
    .querySelectorAll(
      ".quantity-button"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const amount =
              button.dataset.action ===
              "plus"
                ? 1
                : -1;


            changeQuantity(
              button.dataset.id,
              amount
            );

          }
        );

      }
    );


  document
    .querySelectorAll(
      ".remove-button"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            removeFromCart(
              button.dataset.id
            );

          }
        );

      }
    );

}


// =====================================================
// CART SETUP
// =====================================================

function setupCart() {

  const cartButton =
    document.getElementById(
      "cartButton"
    );


  const closeCart =
    document.getElementById(
      "closeCart"
    );


  const checkoutButton =
    document.getElementById(
      "checkoutButton"
    );


  if (cartButton) {

    cartButton.addEventListener(
      "click",
      openCart
    );

  }


  if (closeCart) {

    closeCart.addEventListener(
      "click",
      closeCartPanel
    );

  }


  if (checkoutButton) {

    checkoutButton.addEventListener(
      "click",
      () => {

        if (
          cart.length === 0
        ) {

          alert(
            "Your cart is empty."
          );

          return;

        }


        closeCartPanel();

        openCheckout();

      }
    );

  }

}


// =====================================================
// OPEN CART
// =====================================================

function openCart() {

  const overlay =
    document.getElementById(
      "cartOverlay"
    );


  if (overlay) {

    overlay.classList.add(
      "active"
    );

  }

}


// =====================================================
// CLOSE CART
// =====================================================

function closeCartPanel() {

  const overlay =
    document.getElementById(
      "cartOverlay"
    );


  if (overlay) {

    overlay.classList.remove(
      "active"
    );

  }

}


// =====================================================
// PRODUCT MODAL
// =====================================================

function openProductModal(
  product
) {

  const modal =
    document.getElementById(
      "productModal"
    );


  const image =
    document.getElementById(
      "modalProductImage"
    );


  const name =
    document.getElementById(
      "modalProductName"
    );


  const category =
    document.getElementById(
      "modalProductCategory"
    );


  const description =
    document.getElementById(
      "modalProductDescription"
    );


  const price =
    document.getElementById(
      "modalProductPrice"
    );


  if (!modal) return;


  selectedProduct =
    product;


  if (image) {

    image.src =
      product.image;

    image.alt =
      product.name;

  }


  if (name) {

    name.textContent =
      product.name;

  }


  if (category) {

    category.textContent =
      product.category;

  }


  if (description) {

    description.textContent =
      product.description;

  }


  if (price) {

    price.textContent =
      `EGP ${formatPrice(
        product.price
      )}`;

  }


  modal.classList.add(
    "active"
  );

}


// =====================================================
// PRODUCT MODAL SETUP
// =====================================================

function setupProductModal() {

  const closeButton =
    document.getElementById(
      "closeProductModal"
    );


  const addButton =
    document.getElementById(
      "modalAddToCart"
    );


  const modal =
    document.getElementById(
      "productModal"
    );


  if (closeButton) {

    closeButton.addEventListener(
      "click",
      closeProductModal
    );

  }


  if (addButton) {

    addButton.addEventListener(
      "click",
      () => {

        if (!selectedProduct)
          return;


        addToCart(
          selectedProduct.id
        );


        closeProductModal();

      }
    );

  }


  if (modal) {

    modal.addEventListener(
      "click",
      event => {

        if (
          event.target === modal
        ) {

          closeProductModal();

        }

      }
    );

  }

}


// =====================================================
// CLOSE PRODUCT MODAL
// =====================================================

function closeProductModal() {

  const modal =
    document.getElementById(
      "productModal"
    );


  if (modal) {

    modal.classList.remove(
      "active"
    );

  }


  selectedProduct =
    null;

}


// =====================================================
// CHECKOUT
// =====================================================

function setupCheckout() {

  const form =
    document.getElementById(
      "orderForm"
    );


  const closeButton =
    document.getElementById(
      "closeCheckout"
    );


  if (closeButton) {

    closeButton.addEventListener(
      "click",
      closeCheckout
    );

  }


  if (!form) return;


  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      if (
        cart.length === 0
      ) {

        alert(
          "Your cart is empty."
        );

        return;

      }


      const name =
        document
          .getElementById(
            "customerName"
          )
          .value
          .trim();


      const phone =
        document
          .getElementById(
            "customerPhone"
          )
          .value
          .trim();


      const city =
        document
          .getElementById(
            "customerCity"
          )
          .value
          .trim();


      const notes =
        document
          .getElementById(
            "customerNotes"
          )
          .value
          .trim();


      const transactionReference =
        document
          .getElementById(
            "transactionReference"
          )
          .value
          .trim();


      if (
        !transactionReference
      ) {

        alert(
          "Please enter your InstaPay transaction reference."
        );

        return;

      }


      const orderId =
        "ORD-" +
        Date.now();


      const orderData = {

        order_id:
          orderId,

        date:
          new Date().toISOString(),

        payment_method:
          "InstaPay",

        payment_account:
          INSTAPAY_NUMBER,

        payment_link:
          INSTAPAY_LINK,

        payment_reference:
          transactionReference,

        payment_status:
          "Pending Payment",

        customer: {

          name:
            name,

          phone:
            phone,

          city:
            city,

          notes:
            notes

        },

        products:
          cart,

        products_text:
          cart
            .map(
              item =>
                `${item.name} × ${item.quantity}`
            )
            .join("\n"),

        total:
          getCartTotal()

      };


      const submitButton =
        form.querySelector(
          'button[type="submit"]'
        );


      if (submitButton) {

        submitButton.disabled =
          true;

        submitButton.textContent =
          "Submitting...";

      }


      try {

        await sendOrderToGoogleSheets(
          orderData
        );


        saveOrderLocally(
          orderData
        );


        cart = [];


        saveCart();

        updateCart();


        form.reset();


        closeCheckout();


        showSuccess(
          orderId
        );

      }
      catch (error) {

        console.error(
          "Order error:",
          error
        );


        alert(
          "There was a problem submitting the order. Please try again."
        );

      }


      if (submitButton) {

        submitButton.disabled =
          false;

        submitButton.textContent =
          "Confirm Order";

      }

    }
  );

}


// =====================================================
// GOOGLE SHEETS
// =====================================================

async function sendOrderToGoogleSheets(
  orderData
) {

  await fetch(
    GOOGLE_SCRIPT_URL,
    {

      method:
        "POST",

      mode:
        "no-cors",

      headers: {

        "Content-Type":
          "text/plain;charset=utf-8"

      },

      body:
        JSON.stringify(
          orderData
        )

    }
  );

}


// =====================================================
// SAVE ORDER LOCALLY
// =====================================================

function saveOrderLocally(
  orderData
) {

  const orders =
    JSON.parse(
      localStorage.getItem(
        "peptidesOrders"
      )
    ) || [];


  orders.push(
    orderData
  );


  localStorage.setItem(
    "peptidesOrders",
    JSON.stringify(
      orders
    )
  );

}


// =====================================================
// OPEN CHECKOUT
// =====================================================

function openCheckout() {

  updateCart();


  const overlay =
    document.getElementById(
      "checkoutOverlay"
    );


  if (overlay) {

    overlay.classList.add(
      "active"
    );

  }

}


// =====================================================
// CLOSE CHECKOUT
// =====================================================

function closeCheckout() {

  const overlay =
    document.getElementById(
      "checkoutOverlay"
    );


  if (overlay) {

    overlay.classList.remove(
      "active"
    );

  }

}


// =====================================================
// SUCCESS
// =====================================================

function showSuccess(
  orderId
) {

  const overlay =
    document.getElementById(
      "successOverlay"
    );


  const orderNumber =
    document.getElementById(
      "successOrderId"
    );


  if (orderNumber) {

    orderNumber.textContent =
      orderId;

  }


  if (overlay) {

    overlay.classList.add(
      "active"
    );

  }

}


// =====================================================
// SUCCESS CLOSE
// =====================================================

document.addEventListener(
  "click",
  event => {

    if (
      event.target.id ===
      "closeSuccess"
    ) {

      const overlay =
        document.getElementById(
          "successOverlay"
        );


      if (overlay) {

        overlay.classList.remove(
          "active"
        );

      }

    }

  }
);


// =====================================================
// MOBILE MENU
// =====================================================

function setupMobileMenu() {

  const menuButton =
    document.getElementById(
      "menuButton"
    );


  const navLinks =
    document.querySelector(
      ".nav-links"
    );


  if (
    !menuButton ||
    !navLinks
  ) {

    return;

  }


  menuButton.addEventListener(
    "click",
    () => {

      navLinks.classList.toggle(
        "mobile-active"
      );

    }
  );


  navLinks
    .querySelectorAll("a")
    .forEach(
      link => {

        link.addEventListener(
          "click",
          () => {

            navLinks.classList.remove(
              "mobile-active"
            );

          }
        );

      }
    );

}


// =====================================================
// PRICE FORMAT
// =====================================================

function formatPrice(
  number
) {

  return Number(number)
    .toLocaleString(
      "en-US"
    );

}
