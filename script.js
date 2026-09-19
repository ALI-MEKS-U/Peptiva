// =====================================================
// PEPTIVA — SCRIPT.JS
// Products + Search + Filters + Modal + Cart
// Checkout + InstaPay + Google Sheets
// =====================================================


// =====================================================
// GOOGLE APPS SCRIPT
// =====================================================

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzbrR6dZI7aMHuqDHF5AQkd3id5UhrnDPrAPhgryURTHKo6Y2wzuXKJECG0Ct912jpc/exec";


// =====================================================
// INSTAPAY
// =====================================================

const INSTAPAY_NUMBER = "01277728571";


// =====================================================
// PRODUCTS
// =====================================================

const products = [

  {
    id: "PT-001",
    name: "BPC-157 + TB-500",
    subtitle: "5/5 MG",
    category: "recovery",
    price: 3800,
    image: "images/BPC VIAL.png",
    description:
      "Research product supplied for laboratory research purposes.",
    howItWorks:
      "This product is presented for laboratory research purposes only."
  },

  {
    id: "PT-002",
    name: "Retatrutide",
    subtitle: "10 MG",
    category: "research",
    price: 4600,
    image: "images/RETA10MG.png",
    description:
      "Research product supplied for laboratory research purposes.",
    howItWorks:
      "This product is presented for laboratory research purposes only."
  },

  {
    id: "PT-003",
    name: "SLU-PP-332",
    subtitle: "60 Capsules",
    category: "research",
    price: 4600,
    image: "images/SLU.png",
    description:
      "Research product supplied for laboratory research purposes.",
    howItWorks:
      "This product is presented for laboratory research purposes only."
  },

  {
    id: "PT-004",
    name: "IGF-1",
    subtitle: "1 MG",
    category: "research",
    price: 4600,
    image: "images/igf1.png",
    description:
      "Research product supplied for laboratory research purposes.",
    howItWorks:
      "This product is presented for laboratory research purposes only."
  },

  {
    id: "PT-005",
    name: "Retatrutide",
    subtitle: "20 MG",
    category: "research",
    price: 8500,
    image: "images/RETA10MG.png",
    description:
      "Research product supplied for laboratory research purposes.",
    howItWorks:
      "This product is presented for laboratory research purposes only."
  },

  {
    id: "PT-006",
    name: "Trizpetide",
    subtitle: "60 MG",
    category: "other",
    price: 8400,
    image: "images/TRIZ VIAL.png",
    description:
      "Research product supplied for laboratory research purposes.",
    howItWorks:
      "This product is presented for laboratory research purposes only."
  },

  {
    id: "PT-007",
    name: "GHK-CU",
    subtitle: "50 MG",
    category: "research",
    price: 6000,
    image: "images/GHK.png",
    description:
      "Research product supplied for laboratory research purposes.",
    howItWorks:
      "This product is presented for laboratory research purposes only."
  },

  {
    id: "PT-008",
    name: "KPV",
    subtitle: "10 MG",
    category: "research",
    price: 4800,
    image: "images/kpv.png",
    description:
      "Research product supplied for laboratory research purposes.",
    howItWorks:
      "This product is presented for laboratory research purposes only."
  },

  {
    id: "PT-009",
    name: "MOTS-c",
    subtitle: "10 MG",
    category: "research",
    price: 5600,
    image: "images/mots c.png",
    description:
      "Research product supplied for laboratory research purposes.",
    howItWorks:
      "This product is presented for laboratory research purposes only."
  }

];


// =====================================================
// CART
// =====================================================

let cart = [];

try {

  cart =
    JSON.parse(
      localStorage.getItem("peptidesCart")
    ) || [];

} catch (error) {

  console.warn(
    "PEPTIVA: Could not load cart from localStorage."
  );

  cart = [];

}


// =====================================================
// DOM ELEMENTS
// =====================================================

const cartButton =
  document.getElementById("cartButton");

const cartCount =
  document.getElementById("cartCount");

const cartOverlay =
  document.getElementById("cartOverlay");

const cartPanel =
  document.querySelector(
    "#cartOverlay .side-panel"
  );

const cartItems =
  document.getElementById("cartItems");

const cartTotal =
  document.getElementById("cartTotal");

const checkoutButton =
  document.getElementById("checkoutButton");

const checkoutOverlay =
  document.getElementById("checkoutOverlay");

const checkoutPanel =
  document.querySelector(
    "#checkoutOverlay .checkout-panel"
  );

const checkoutForm =
  document.getElementById("orderForm");

const successOverlay =
  document.getElementById("successOverlay");

const successOrderId =
  document.getElementById("successOrderId");

const closeSuccess =
  document.getElementById("closeSuccess");

const productModal =
  document.getElementById("productModal");

const productsGrid =
  document.getElementById("productsGrid");

const productSearch =
  document.getElementById("productSearch");

const closeProductModal =
  document.getElementById(
    "closeProductModal"
  );

const modalProductImage =
  document.getElementById(
    "modalProductImage"
  );

const modalProductCategory =
  document.getElementById(
    "modalProductCategory"
  );

const modalProductName =
  document.getElementById(
    "modalProductName"
  );

const modalProductDescription =
  document.getElementById(
    "modalProductDescription"
  );

const modalProductPrice =
  document.getElementById(
    "modalProductPrice"
  );

const modalAddToCart =
  document.getElementById(
    "modalAddToCart"
  );

const checkoutTotal =
  document.getElementById(
    "checkoutTotal"
  );

const closeCart =
  document.getElementById(
    "closeCart"
  );

const closeCheckout =
  document.getElementById(
    "closeCheckout"
  );

const menuButton =
  document.getElementById(
    "menuButton"
  );

const navLinks =
  document.querySelector(
    ".nav-links"
  );


// =====================================================
// CURRENT MODAL PRODUCT
// =====================================================

let currentModalProduct = null;


// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    console.log(
      "PEPTIVA: Website initialized."
    );

    console.log(
      "PEPTIVA: Products loaded:",
      products.length
    );

    console.log(
      "PEPTIVA: Google Sheets URL:",
      GOOGLE_SCRIPT_URL
    );

    cleanCart();

    renderProducts();

    updateCart();

    setupCart();

    setupCheckout();

    setupMobileMenu();

    setupFilters();

    setupSearch();

    setupModal();

    setupSuccess();

    setupGlobalEvents();

  }
);


// =====================================================
// CLEAN CART
// =====================================================

function cleanCart() {

  if (!Array.isArray(cart)) {
    cart = [];
    saveCart();
    return;
  }

  cart = cart.filter(function (item) {

    if (!item) {
      return false;
    }

    const productExists =
      products.some(function (product) {

        return product.id === item.id;

      });

    if (!productExists) {
      return false;
    }

    item.quantity =
      Math.max(
        1,
        parseInt(item.quantity, 10) || 1
      );

    item.price =
      Number(item.price) || 0;

    return true;

  });

  saveCart();

}


// =====================================================
// LOCAL STORAGE
// =====================================================

function saveCart() {

  try {

    localStorage.setItem(
      "peptidesCart",
      JSON.stringify(cart)
    );

  } catch (error) {

    console.error(
      "PEPTIVA: Could not save cart.",
      error
    );

  }

}


function saveOrderLocally(orderData) {

  try {

    const orders =
      JSON.parse(
        localStorage.getItem(
          "peptidesOrders"
        )
      ) || [];

    orders.push(orderData);

    localStorage.setItem(
      "peptidesOrders",
      JSON.stringify(orders)
    );

  } catch (error) {

    console.error(
      "PEPTIVA: Could not save order locally.",
      error
    );

  }

}


// =====================================================
// FORMAT PRICE
// =====================================================

function formatPrice(price) {

  return `${Number(price).toLocaleString("en-US")} EGP`;

}


// =====================================================
// CART TOTAL
// =====================================================

function getCartTotal() {

  return cart.reduce(
    function (total, item) {

      return (
        total +
        Number(item.price) *
        Number(item.quantity)
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
    function (total, item) {

      return (
        total +
        Number(item.quantity)
      );

    },
    0
  );

}


// =====================================================
// RENDER PRODUCTS
// =====================================================

function renderProducts(
  productList = products
) {

  if (!productsGrid) {
    return;
  }


  if (!productList.length) {

    productsGrid.innerHTML = `
      <div class="empty-products">
        <p>No products found.</p>
      </div>
    `;

    return;

  }


  productsGrid.innerHTML =
    productList.map(
      function (product) {

        return `
          <article
            class="product-card"
            data-product-id="${escapeHTML(product.id)}"
            data-category="${escapeHTML(product.category)}"
          >

            <div
              class="product-image-wrap"
              data-product-id="${escapeHTML(product.id)}"
            >

              <img
                src="${escapeHTML(product.image)}"
                alt="${escapeHTML(product.name)}"
                class="product-image"
                loading="lazy"
                onerror="this.style.opacity='0.25';"
              >

              <span class="research-badge">
                RESEARCH
              </span>

            </div>


            <div class="product-card-content">

              <span class="product-category">
                ${escapeHTML(product.category)}
              </span>

              <h3>
                ${escapeHTML(product.name)}
              </h3>

              <p class="product-subtitle">
                ${escapeHTML(product.subtitle)}
              </p>

              <p class="product-description">
                ${escapeHTML(product.description)}
              </p>


              <div class="product-card-bottom">

                <strong class="product-price">
                  ${formatPrice(product.price)}
                </strong>

                <button
                  type="button"
                  class="product-add-button"
                  data-product-id="${escapeHTML(product.id)}"
                  aria-label="Add ${escapeHTML(product.name)} to cart"
                >
                  Add to Cart
                </button>

              </div>

            </div>

          </article>
        `;

      }
    ).join("");


  setupProductCardEvents();

}


// =====================================================
// PRODUCT CARD EVENTS
// =====================================================

function setupProductCardEvents() {

  if (!productsGrid) {
    return;
  }


  const cards =
    productsGrid.querySelectorAll(
      ".product-card"
    );


  cards.forEach(function (card) {

    card.addEventListener(
      "click",
      function (event) {

        const clickedButton =
          event.target.closest(
            ".product-add-button"
          );

        if (clickedButton) {
          return;
        }

        const productId =
          card.dataset.productId;

        openProductModal(productId);

      }
    );

  });


  const addButtons =
    productsGrid.querySelectorAll(
      ".product-add-button"
    );


  addButtons.forEach(function (button) {

    button.addEventListener(
      "click",
      function (event) {

        event.preventDefault();
        event.stopPropagation();

        const productId =
          button.dataset.productId;

        addToCart(productId);

      }
    );

  });

}


// =====================================================
// ADD TO CART
// =====================================================

function addToCart(productId) {

  const product =
    products.find(
      function (item) {
        return item.id === productId;
      }
    );


  if (!product) {

    console.error(
      "PEPTIVA: Product not found:",
      productId
    );

    return;

  }


  const existingItem =
    cart.find(
      function (item) {
        return item.id === productId;
      }
    );


  if (existingItem) {

    existingItem.quantity =
      Number(existingItem.quantity) + 1;

  } else {

    cart.push({

      id: product.id,

      name: product.name,

      subtitle: product.subtitle,

      price: Number(product.price),

      image: product.image,

      quantity: 1

    });

  }


  saveCart();

  updateCart();

  showCartNotification(
    `${product.name} added to cart`
  );

}


// =====================================================
// REMOVE FROM CART
// =====================================================

function removeFromCart(productId) {

  cart =
    cart.filter(
      function (item) {
        return item.id !== productId;
      }
    );

  saveCart();

  updateCart();

}


// =====================================================
// CHANGE QUANTITY
// =====================================================

function changeQuantity(
  productId,
  change
) {

  const item =
    cart.find(
      function (cartItem) {
        return cartItem.id === productId;
      }
    );


  if (!item) {
    return;
  }


  item.quantity =
    Number(item.quantity) + Number(change);


  if (item.quantity <= 0) {

    removeFromCart(productId);

    return;

  }


  saveCart();

  updateCart();

}


// =====================================================
// UPDATE CART
// =====================================================

function updateCart() {

  renderCart();

  updateCartCount();

  updateCheckoutTotal();

}


// =====================================================
// UPDATE CART COUNT
// =====================================================

function updateCartCount() {

  if (!cartCount) {
    return;
  }


  const count =
    getCartCount();


  cartCount.textContent =
    count;


  if (count > 0) {

    cartCount.classList.add(
      "has-items"
    );

  } else {

    cartCount.classList.remove(
      "has-items"
    );

  }

}


// =====================================================
// RENDER CART
// =====================================================

function renderCart() {

  if (!cartItems) {
    return;
  }


  if (!cart.length) {

    cartItems.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">
          🛒
        </div>

        <h3>
          Your cart is empty
        </h3>

        <p>
          Add a product to get started.
        </p>
      </div>
    `;

    if (cartTotal) {
      cartTotal.textContent =
        formatPrice(0);
    }

    return;

  }


  cartItems.innerHTML =
    cart.map(
      function (item) {

        return `
          <div
            class="cart-item"
            data-cart-id="${escapeHTML(item.id)}"
          >

            <div class="cart-item-image">

              <img
                src="${escapeHTML(item.image)}"
                alt="${escapeHTML(item.name)}"
                onerror="this.style.opacity='0.3';"
              >

            </div>


            <div class="cart-item-info">

              <h3>
                ${escapeHTML(item.name)}
              </h3>

              <span>
                ${escapeHTML(item.subtitle)}
              </span>

              <strong>
                ${formatPrice(item.price)}
              </strong>


              <div class="cart-item-controls">

                <button
                  type="button"
                  class="quantity-button"
                  data-action="decrease"
                  data-product-id="${escapeHTML(item.id)}"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span class="quantity">
                  ${item.quantity}
                </span>

                <button
                  type="button"
                  class="quantity-button"
                  data-action="increase"
                  data-product-id="${escapeHTML(item.id)}"
                  aria-label="Increase quantity"
                >
                  +
                </button>

                <button
                  type="button"
                  class="remove-item"
                  data-action="remove"
                  data-product-id="${escapeHTML(item.id)}"
                >
                  Remove
                </button>

              </div>

            </div>

          </div>
        `;

      }
    ).join("");


  if (cartTotal) {

    cartTotal.textContent =
      formatPrice(
        getCartTotal()
      );

  }


  const controls =
    cartItems.querySelectorAll(
      "[data-action]"
    );


  controls.forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

        const action =
          button.dataset.action;

        const productId =
          button.dataset.productId;


        if (action === "increase") {

          changeQuantity(
            productId,
            1
          );

        }


        if (action === "decrease") {

          changeQuantity(
            productId,
            -1
          );

        }


        if (action === "remove") {

          removeFromCart(
            productId
          );

        }

      }
    );

  });

}


// =====================================================
// CART SETUP
// =====================================================

function setupCart() {

  if (cartButton) {

    cartButton.addEventListener(
      "click",
      function () {

        openOverlay(
          cartOverlay
        );

      }
    );

  }


  if (closeCart) {

    closeCart.addEventListener(
      "click",
      function () {

        closeOverlay(
          cartOverlay
        );

      }
    );

  }


  if (checkoutButton) {

    checkoutButton.addEventListener(
      "click",
      function () {

        if (!cart.length) {

          showCartNotification(
            "Your cart is empty"
          );

          return;

        }


        updateCheckoutTotal();

        closeOverlay(
          cartOverlay
        );

        openOverlay(
          checkoutOverlay
        );

      }
    );

  }

}


// =====================================================
// CHECKOUT SETUP
// =====================================================

function setupCheckout() {

  if (closeCheckout) {

    closeCheckout.addEventListener(
      "click",
      function () {

        closeOverlay(
          checkoutOverlay
        );

      }
    );

  }


  if (!checkoutForm) {
    return;
  }


  checkoutForm.addEventListener(
    "submit",
    handleCheckoutSubmit
  );

}


// =====================================================
// UPDATE CHECKOUT TOTAL
// =====================================================

function updateCheckoutTotal() {

  if (!checkoutTotal) {
    return;
  }


  checkoutTotal.textContent =
    formatPrice(
      getCartTotal()
    );

}


// =====================================================
// CHECKOUT SUBMISSION
// =====================================================

async function handleCheckoutSubmit(
  event
) {

  event.preventDefault();


  if (!cart.length) {

    alert(
      "Your cart is empty."
    );

    return;

  }


  const customerName =
    document.getElementById(
      "customerName"
    )?.value.trim() || "";


  const customerPhone =
    document.getElementById(
      "customerPhone"
    )?.value.trim() || "";


  const customerCity =
    document.getElementById(
      "customerCity"
    )?.value.trim() || "";


  const customerNotes =
    document.getElementById(
      "customerNotes"
    )?.value.trim() || "";


  const transactionReference =
    document.getElementById(
      "transactionReference"
    )?.value.trim() || "";


  if (
    !customerName ||
    !customerPhone ||
    !customerCity ||
    !transactionReference
  ) {

    alert(
      "Please complete all required fields."
    );

    return;

  }


  const total =
    getCartTotal();


  const orderId =
    generateOrderId();


  const orderItems =
    cart.map(
      function (item) {

        return {

          id: item.id,

          name: item.name,

          subtitle: item.subtitle,

          quantity: item.quantity,

          price: item.price,

          subtotal:
            Number(item.price) *
            Number(item.quantity)

        };

      }
    );


  const orderData = {

    orderId: orderId,

    timestamp:
      new Date().toISOString(),

    customerName:
      customerName,

    customerPhone:
      customerPhone,

    customerCity:
      customerCity,

    customerNotes:
      customerNotes,

    transactionReference:
      transactionReference,

    paymentMethod:
      "InstaPay",

    total:
      total,

    items:
      orderItems,

    itemsText:
      orderItems
        .map(function (item) {

          return (
            `${item.name} (${item.subtitle}) x${item.quantity}`
          );

        })
        .join(" | ")

  };


  const submitButton =
    checkoutForm.querySelector(
      'button[type="submit"]'
    );


  const originalButtonText =
    submitButton
      ? submitButton.textContent
      : "Confirm Order";


  if (submitButton) {

    submitButton.disabled =
      true;

    submitButton.textContent =
      "Submitting...";

  }


  try {

    /*
     * Save locally first.
     * This means the order is not lost if
     * the Google Apps Script request fails.
     */

    saveOrderLocally(
      orderData
    );


    /*
     * Send order to Google Apps Script.
     */

    await sendOrderToGoogleSheets(
      orderData
    );


    /*
     * Clear cart only after submission.
     */

    cart = [];

    saveCart();

    updateCart();


    if (checkoutForm) {
      checkoutForm.reset();
    }


    closeOverlay(
      checkoutOverlay
    );


    showSuccess(
      orderId
    );


  } catch (error) {

    console.error(
      "PEPTIVA: Order submission error:",
      error
    );


    /*
     * The order was already saved locally.
     * Show the customer the order ID so it
     * can still be referenced.
     */

    cart = [];

    saveCart();

    updateCart();


    if (checkoutForm) {
      checkoutForm.reset();
    }


    closeOverlay(
      checkoutOverlay
    );


    showSuccess(
      orderId
    );


    console.warn(
      "PEPTIVA: Order was saved locally, but Google Sheets confirmation could not be verified."
    );

  } finally {

    if (submitButton) {

      submitButton.disabled =
        false;

      submitButton.textContent =
        originalButtonText;

    }

  }

}


// =====================================================
// GOOGLE SHEETS SUBMISSION
// =====================================================

async function sendOrderToGoogleSheets(
  orderData
) {

  if (!GOOGLE_SCRIPT_URL) {

    throw new Error(
      "Google Apps Script URL is missing."
    );

  }


  /*
   * URLSearchParams is used instead of
   * application/json because Google Apps Script
   * deployments commonly work better with
   * form-style POST requests from a static site.
   */

  const body =
    new URLSearchParams();


  body.append(
    "orderId",
    orderData.orderId
  );

  body.append(
    "timestamp",
    orderData.timestamp
  );

  body.append(
    "customerName",
    orderData.customerName
  );

  body.append(
    "customerPhone",
    orderData.customerPhone
  );

  body.append(
    "customerCity",
    orderData.customerCity
  );

  body.append(
    "customerNotes",
    orderData.customerNotes
  );

  body.append(
    "transactionReference",
    orderData.transactionReference
  );

  body.append(
    "paymentMethod",
    orderData.paymentMethod
  );

  body.append(
    "total",
    orderData.total
  );

  body.append(
    "items",
    orderData.itemsText
  );

  body.append(
    "itemsJson",
    JSON.stringify(
      orderData.items
    )
  );


  /*
   * no-cors is important for a static GitHub Pages
   * frontend talking to a Google Apps Script endpoint.
   *
   * With no-cors, the browser does not expose the
   * response body to JavaScript, but the POST itself
   * can still be sent to the deployed endpoint.
   */

  await fetch(
    GOOGLE_SCRIPT_URL,
    {

      method: "POST",

      mode: "no-cors",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded;charset=UTF-8"
      },

      body:
        body.toString()

    }
  );

}


// =====================================================
// GENERATE ORDER ID
// =====================================================

function generateOrderId() {

  const now =
    new Date();


  const year =
    now.getFullYear();


  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");


  const day =
    String(
      now.getDate()
    ).padStart(2, "0");


  const random =
    Math.floor(
      1000 +
      Math.random() * 9000
    );


  return `PEP-${year}${month}${day}-${random}`;

}


// =====================================================
// PRODUCT MODAL
// =====================================================

function setupModal() {

  if (closeProductModal) {

    closeProductModal.addEventListener(
      "click",
      function () {

        closeOverlay(
          productModal
        );

      }
    );

  }


  if (modalAddToCart) {

    modalAddToCart.addEventListener(
      "click",
      function () {

        if (!currentModalProduct) {
          return;
        }


        addToCart(
          currentModalProduct.id
        );

        closeOverlay(
          productModal
        );

      }
    );

  }


  if (productModal) {

    productModal.addEventListener(
      "click",
      function (event) {

        if (
          event.target ===
          productModal
        ) {

          closeOverlay(
            productModal
          );

        }

      }
    );

  }

}


// =====================================================
// OPEN PRODUCT MODAL
// =====================================================

function openProductModal(
  productId
) {

  const product =
    products.find(
      function (item) {

        return (
          item.id ===
          productId
        );

      }
    );


  if (!product) {
    return;
  }


  currentModalProduct =
    product;


  if (modalProductImage) {

    modalProductImage.src =
      product.image;

    modalProductImage.alt =
      product.name;

  }


  if (modalProductCategory) {

    modalProductCategory.textContent =
      product.category.toUpperCase();

  }


  if (modalProductName) {

    modalProductName.textContent =
      product.name;

  }


  if (modalProductDescription) {

    modalProductDescription.textContent =
      product.description;

  }


  if (modalProductPrice) {

    modalProductPrice.textContent =
      formatPrice(
        product.price
      );

  }


  /*
   * Update the "How it works" section
   * if the element exists.
   */

  const modalHowItWorks =
    productModal?.querySelector(
      ".product-how p"
    );


  if (modalHowItWorks) {

    modalHowItWorks.textContent =
      product.howItWorks ||
      "This product is presented for laboratory research purposes only.";

  }


  openOverlay(
    productModal
  );

}


// =====================================================
// SEARCH
// =====================================================

function setupSearch() {

  if (!productSearch) {
    return;
  }


  productSearch.addEventListener(
    "input",
    function () {

      applyProductFilters();

    }
  );

}


// =====================================================
// FILTERS
// =====================================================

function setupFilters() {

  const filterButtons =
    document.querySelectorAll(
      ".filter"
    );


  if (!filterButtons.length) {
    return;
  }


  filterButtons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          filterButtons.forEach(
            function (item) {

              item.classList.remove(
                "active"
              );

            }
          );


          button.classList.add(
            "active"
          );


          applyProductFilters();

        }
      );

    }
  );

}


// =====================================================
// APPLY SEARCH + FILTER
// =====================================================

function applyProductFilters() {

  const searchTerm =
    productSearch
      ? productSearch.value
          .trim()
          .toLowerCase()
      : "";


  const activeFilter =
    document.querySelector(
      ".filter.active"
    );


  const selectedCategory =
    activeFilter
      ? activeFilter.dataset.filter
      : "all";


  const filteredProducts =
    products.filter(
      function (product) {

        const matchesCategory =
          selectedCategory === "all" ||
          product.category ===
            selectedCategory;


        const searchableText =
          [
            product.name,
            product.subtitle,
            product.category,
            product.description
          ]
            .join(" ")
            .toLowerCase();


        const matchesSearch =
          !searchTerm ||
          searchableText.includes(
            searchTerm
          );


        return (
          matchesCategory &&
          matchesSearch
        );

      }
    );


  renderProducts(
    filteredProducts
  );

}


// =====================================================
// MOBILE MENU
// =====================================================

function setupMobileMenu() {

  if (
    !menuButton ||
    !navLinks
  ) {
    return;
  }


  menuButton.addEventListener(
    "click",
    function () {

      navLinks.classList.toggle(
        "active"
      );

      menuButton.classList.toggle(
        "active"
      );

    }
  );


  const links =
    navLinks.querySelectorAll(
      "a"
    );


  links.forEach(
    function (link) {

      link.addEventListener(
        "click",
        function () {

          navLinks.classList.remove(
            "active"
          );

          menuButton.classList.remove(
            "active"
          );

        }
      );

    }
  );

}


// =====================================================
// SUCCESS
// =====================================================

function setupSuccess() {

  if (closeSuccess) {

    closeSuccess.addEventListener(
      "click",
      function () {

        closeOverlay(
          successOverlay
        );

      }
    );

  }


  if (successOverlay) {

    successOverlay.addEventListener(
      "click",
      function (event) {

        if (
          event.target ===
          successOverlay
        ) {

          closeOverlay(
            successOverlay
          );

        }

      }
    );

  }

}


// =====================================================
// SHOW SUCCESS
// =====================================================

function showSuccess(
  orderId
) {

  if (successOrderId) {

    successOrderId.textContent =
      orderId;

  }


  openOverlay(
    successOverlay
  );

}


// =====================================================
// GLOBAL EVENTS
// =====================================================

function setupGlobalEvents() {

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key ===
        "Escape"
      ) {

        closeAllOverlays();

      }

    }
  );


  /*
   * Clicking the dark overlay closes the
   * corresponding panel.
   */

  if (cartOverlay) {

    cartOverlay.addEventListener(
      "click",
      function (event) {

        if (
          event.target ===
          cartOverlay
        ) {

          closeOverlay(
            cartOverlay
          );

        }

      }
    );

  }


  if (checkoutOverlay) {

    checkoutOverlay.addEventListener(
      "click",
      function (event) {

        if (
          event.target ===
          checkoutOverlay
        ) {

          closeOverlay(
            checkoutOverlay
          );

        }

      }
    );

  }

}


// =====================================================
// OPEN OVERLAY
// =====================================================

function openOverlay(
  overlay
) {

  if (!overlay) {
    return;
  }


  overlay.classList.add(
    "active"
  );


  document.body.classList.add(
    "no-scroll"
  );

}


// =====================================================
// CLOSE OVERLAY
// =====================================================

function closeOverlay(
  overlay
) {

  if (!overlay) {
    return;
  }


  overlay.classList.remove(
    "active"
  );


  /*
   * Only remove body lock when there
   * are no other open overlays.
   */

  const activeOverlays =
    document.querySelectorAll(
      ".overlay.active"
    );


  if (!activeOverlays.length) {

    document.body.classList.remove(
      "no-scroll"
    );

  }

}


// =====================================================
// CLOSE ALL OVERLAYS
// =====================================================

function closeAllOverlays() {

  const overlays =
    document.querySelectorAll(
      ".overlay.active"
    );


  overlays.forEach(
    function (overlay) {

      overlay.classList.remove(
        "active"
      );

    }
  );


  document.body.classList.remove(
    "no-scroll"
  );

}


// =====================================================
// CART NOTIFICATION
// =====================================================

function showCartNotification(
  message
) {

  /*
   * Remove an existing notification
   * to prevent duplicates.
   */

  const existing =
    document.querySelector(
      ".cart-notification"
    );


  if (existing) {
    existing.remove();
  }


  const notification =
    document.createElement(
      "div"
    );


  notification.className =
    "cart-notification";


  notification.textContent =
    message;


  document.body.appendChild(
    notification
  );


  /*
   * Small inline fallback styling so
   * the notification still looks okay
   * even if CSS doesn't contain it.
   */

  notification.style.position =
    "fixed";

  notification.style.right =
    "20px";

  notification.style.bottom =
    "20px";

  notification.style.zIndex =
    "99999";

  notification.style.padding =
    "12px 18px";

  notification.style.borderRadius =
    "10px";

  notification.style.background =
    "#111";

  notification.style.color =
    "#fff";

  notification.style.fontSize =
    "14px";

  notification.style.boxShadow =
    "0 10px 30px rgba(0,0,0,.25)";


  setTimeout(
    function () {

      notification.style.opacity =
        "0";

      notification.style.transform =
        "translateY(10px)";

      notification.style.transition =
        "all .25s ease";


      setTimeout(
        function () {

          notification.remove();

        },
        300
      );

    },
    1800
  );

}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHTML(
  value
) {

  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


// =====================================================
// SMOOTH NAVIGATION
// =====================================================

document.addEventListener(
  "click",
  function (event) {

    const link =
      event.target.closest(
        'a[href^="#"]'
      );


    if (!link) {
      return;
    }


    const targetId =
      link.getAttribute(
        "href"
      );


    if (
      !targetId ||
      targetId === "#"
    ) {
      return;
    }


    const target =
      document.querySelector(
        targetId
      );


    if (!target) {
      return;
    }


    event.preventDefault();


    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }
);


// =====================================================
// PEPTIVA READY
// =====================================================

console.log(
  "PEPTIVA: script.js loaded successfully."
);
