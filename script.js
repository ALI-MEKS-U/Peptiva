```javascript
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

const INSTAPAY_NUMBER =
  "01277728571";


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
      "Research peptide combination supplied for laboratory research purposes.",
    howItWorks:
      "BPC-157 and TB-500 are studied in preclinical research involving cellular and tissue-related processes."
  },

  {
    id: "PT-002",
    name: "Retatrutide",
    subtitle: "10 MG",
    category: "research",
    price: 4600,
    image: "images/RETA10MG.png",
    description:
      "Research compound supplied for laboratory research purposes.",
    howItWorks:
      "Retatrutide is being studied in preclinical research involving multiple metabolic hormone pathways."
  },

  {
    id: "PT-003",
    name: "SLU-PP-332",
    subtitle: "60 Capsules",
    category: "research",
    price: 4600,
    image: "images/SLU.png",
    description:
      "Research compound supplied for laboratory research purposes.",
    howItWorks:
      "SLU-PP-332 is studied in preclinical research involving metabolic pathways."
  },

  {
    id: "PT-004",
    name: "IGF-1",
    subtitle: "1 MG",
    category: "research",
    price: 4600,
    image: "images/igf1.png",
    description:
      "Research material supplied for laboratory research purposes.",
    howItWorks:
      "IGF-1 is studied in research involving growth-factor signaling pathways."
  },

  {
    id: "PT-005",
    name: "Retatrutide",
    subtitle: "20 MG",
    category: "research",
    price: 8500,
    image: "images/RETA10MG.png",
    description:
      "Research compound supplied for laboratory research purposes.",
    howItWorks:
      "Retatrutide is being studied in preclinical research involving metabolic hormone pathways."
  },

  {
    id: "PT-006",
    name: "Trizpetide",
    subtitle: "60 MG",
    category: "other",
    price: 8400,
    image: "images/TRIZ VIAL.png",
    description:
      "Research compound supplied for laboratory research purposes.",
    howItWorks:
      "This compound is provided for laboratory research purposes."
  },

  {
    id: "PT-007",
    name: "GHK-CU",
    subtitle: "50 MG",
    category: "research",
    price: 6000,
    image: "images/GHK.png",
    description:
      "Copper peptide supplied for laboratory research purposes.",
    howItWorks:
      "GHK-Cu is studied in research involving copper-binding peptide activity."
  },

  {
    id: "PT-008",
    name: "KPV",
    subtitle: "10 MG",
    category: "research",
    price: 4800,
    image: "images/kpv.png",
    description:
      "Research peptide supplied for laboratory research purposes.",
    howItWorks:
      "KPV is studied in laboratory research involving peptide signaling."
  },

  {
    id: "PT-009",
    name: "MOTS-c",
    subtitle: "10 MG",
    category: "research",
    price: 5600,
    image: "images/mots c.png",
    description:
      "Research peptide supplied for laboratory research purposes.",
    howItWorks:
      "MOTS-c is studied in preclinical research involving cellular and metabolic pathways."
  }

];


// =====================================================
// CART
// =====================================================

let cart =
  JSON.parse(
    localStorage.getItem("peptidesCart")
  ) || [];


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
  document.querySelector("#cartOverlay .side-panel");

const cartItems =
  document.getElementById("cartItems");

const cartTotal =
  document.getElementById("cartTotal");

const checkoutButton =
  document.getElementById("checkoutButton");

const checkoutOverlay =
  document.getElementById("checkoutOverlay");

const checkoutPanel =
  document.querySelector("#checkoutOverlay .checkout-panel");

const checkoutForm =
  document.getElementById("orderForm");

const successOverlay =
  document.getElementById("successOverlay");

const successOrderId =
  document.getElementById("successOrderId");

const productModal =
  document.getElementById("productModal");

const productsGrid =
  document.getElementById("productsGrid");

const productSearch =
  document.getElementById("productSearch");


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


    renderProducts();

    updateCart();

    setupCart();

    setupCheckout();

    setupMobileMenu();

    setupFilters();

    setupSearch();

    setupModal();

    setupSuccess();

  }
);


// =====================================================
// LOCAL STORAGE
// =====================================================

function saveCart() {

  localStorage.setItem(
    "peptidesCart",
    JSON.stringify(cart)
  );

}


function saveOrderLocally(orderData) {

  const orders =
    JSON.parse(
      localStorage.getItem("peptidesOrders")
    ) || [];

  orders.push(orderData);

  localStorage.setItem(
    "peptidesOrders",
    JSON.stringify(orders)
  );

}


// =====================================================
// FORMAT PRICE
// =====================================================

function formatPrice(price) {

  return `${Number(price).toLocaleString()} EGP`;

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
// RENDER PRODUCTS
// =====================================================

function renderProducts() {

  if (!productsGrid) {
    return;
  }


  if (products.length === 0) {

    productsGrid.innerHTML = `
      <div class="empty-products">
        <p>No products available.</p>
      </div>
    `;

    return;

  }


  productsGrid.innerHTML =
    products.map(
      function (product) {

        return `
          <article
            class="product-card"
            data-product-id="${product.id}"
            data-category="${product.category}"
          >

            <div class="product-image-wrap">

              <img
                src="${product.image}"
                alt="${product.name}"
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
                ${product.category}
              </span>

              <h3>
                ${product.name}
              </h3>

              <p class="product-subtitle">
                ${product.subtitle}
              </p>

              <p class="product-description">
                ${product.description}
              </p>


              <div class="product-card-bottom">

                <strong class="product-price">
                  ${formatPrice(product.price)}
                </strong>

                <button
                  type="button"
                  class="product-add-button"
                  data-product-id="${product.id}"
                  aria-label="Add ${product.name} to cart"
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

```
