// =====================================================
// PEPTIVA — SCRIPT.JS
// CART + PRODUCTS + CHECKOUT + GOOGLE SHEETS DIAGNOSTIC
// =====================================================


// =====================================================
// GOOGLE APPS SCRIPT
// =====================================================

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwgSxYuLxk6bErFBDPh0jf93XgD9t9xWIJdxUPUEDTS98wiSnrA7FQ/exec";


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
      "Research peptide combination for laboratory research.",
    howItWorks:
      "BPC-157 and TB-500 are studied in research settings for cellular and tissue-related processes."
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
      "Retatrutide is being studied for its activity across multiple metabolic hormone pathways."
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
      "Research material supplied for laboratory research.",
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
      "Retatrutide is being studied for activity across multiple metabolic hormone pathways."
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
      "This compound is provided for research and laboratory use."
  },

  {
    id: "PT-007",
    name: "GHK-CU",
    subtitle: "50 MG",
    category: "research",
    price: 6000,
    image: "images/GHK.png",
    description:
      "Copper peptide supplied for laboratory research.",
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
      "Research peptide supplied for laboratory research.",
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
      "Research peptide supplied for laboratory research.",
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
  document.getElementById("overlay");

const cartPanel =
  document.getElementById("cartPanel");

const cartItems =
  document.getElementById("cartItems");

const cartTotal =
  document.getElementById("cartTotal");

const checkoutPanel =
  document.getElementById("checkoutPanel");

const checkoutForm =
  document.getElementById("checkoutForm");

const successOverlay =
  document.getElementById("successOverlay");

const orderIdElement =
  document.getElementById("orderId");


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

    updateCart();

    setupProductButtons();

    setupCheckout();

    setupMobileMenu();

    setupFilters();

    setupSearch();

    setupModal();

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
// UPDATE CART
// =====================================================

function updateCart() {

  if (cartCount) {

    const count =
      cart.reduce(
        function (total, item) {

          return (
            total +
            Number(item.quantity)
          );

        },
        0
      );

    cartCount.textContent =
      count;

  }


  if (cartItems) {

    if (cart.length === 0) {

      cartItems.innerHTML = `
        <div class="empty-cart">
          <p>Your cart is empty.</p>
        </div>
      `;

    } else {

      cartItems.innerHTML =
        cart.map(
          function (item, index) {

            return `
              <div class="cart-item">

                <img
                  src="${item.image}"
                  alt="${item.name}"
                  class="cart-item-image"
                >

                <div class="cart-item-info">

                  <h4>
                    ${item.name}
                  </h4>

                  <p>
                    ${item.subtitle || ""}
                  </p>

                  <strong>
                    ${Number(item.price).toLocaleString()} EGP
                  </strong>

                  <div class="cart-controls">

                    <button
                      type="button"
                      onclick="decreaseQuantity(${index})"
                    >
                      −
                    </button>

                    <span>
                      ${item.quantity}
                    </span>

                    <button
                      type="button"
                      onclick="increaseQuantity(${index})"
                    >
                      +
                    </button>

                  </div>

                  <button
                    type="button"
                    class="remove-item"
                    onclick="removeFromCart(${index})"
                  >
                    Remove
                  </button>

                </div>

              </div>
            `;

          }
        ).join("");

    }

  }


  if (cartTotal) {

    cartTotal.textContent =
      `${getCartTotal().toLocaleString()} EGP`;

  }

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


  const existing =
    cart.find(
      function (item) {
        return item.id === productId;
      }
    );


  if (existing) {

    existing.quantity += 1;

  } else {

    cart.push({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      category: product.category,
      price: product.price,
      image: product.image,
      quantity: 1
    });

  }


  saveCart();

  updateCart();

  openCart();

}


// =====================================================
// INCREASE QUANTITY
// =====================================================

function increaseQuantity(index) {

  if (!cart[index]) {
    return;
  }

  cart[index].quantity += 1;

  saveCart();

  updateCart();

}


// =====================================================
// DECREASE QUANTITY
// =====================================================

function decreaseQuantity(index) {

  if (!cart[index]) {
    return;
  }

  cart[index].quantity -= 1;


  if (cart[index].quantity <= 0) {

    cart.splice(index, 1);

  }


  saveCart();

  updateCart();

}


// =====================================================
// REMOVE FROM CART
// =====================================================

function removeFromCart(index) {

  if (!cart[index]) {
    return;
  }

  cart.splice(index, 1);

  saveCart();

  updateCart();

}


// =====================================================
// OPEN CART
// =====================================================

function openCart() {

  if (cartPanel) {

    cartPanel.classList.add(
      "active"
    );

  }

  if (cartOverlay) {

    cartOverlay.classList.add(
      "active"
    );

  }

}


// =====================================================
// CLOSE CART
// =====================================================

function closeCart() {

  if (cartPanel) {

    cartPanel.classList.remove(
      "active"
    );

  }

  if (cartOverlay) {

    cartOverlay.classList.remove(
      "active"
    );

  }

}


// =====================================================
// CART BUTTON
// =====================================================

if (cartButton) {

  cartButton.addEventListener(
    "click",
    function () {

      openCart();

    }
  );

}


// =====================================================
// OVERLAY
// =====================================================

if (cartOverlay) {

  cartOverlay.addEventListener(
    "click",
    function () {

      closeCart();

      closeCheckout();

    }
  );

}


// =====================================================
// PRODUCT BUTTONS
// =====================================================

function setupProductButtons() {

  const buttons =
    document.querySelectorAll(
      "[data-product-id]"
    );


  buttons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const productId =
            button.dataset.productId;

          addToCart(productId);

        }
      );

    }
  );

}


// =====================================================
// CHECKOUT
// =====================================================

function setupCheckout() {

  const checkoutButton =
    document.getElementById(
      "checkoutButton"
    );


  if (checkoutButton) {

    checkoutButton.addEventListener(
      "click",
      function () {

        if (cart.length === 0) {

          alert(
            "Your cart is empty."
          );

          return;

        }

        openCheckout();

      }
    );

  }


  if (checkoutForm) {

    checkoutForm.addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();

        await submitOrder();

      }
    );

  }

}


// =====================================================
// OPEN CHECKOUT
// =====================================================

function openCheckout() {

  if (cartPanel) {

    cartPanel.classList.remove(
      "active"
    );

  }


  if (checkoutPanel) {

    checkoutPanel.classList.add(
      "active"
    );

  }


  if (cartOverlay) {

    cartOverlay.classList.add(
      "active"
    );

  }

}


// =====================================================
// CLOSE CHECKOUT
// =====================================================

function closeCheckout() {

  if (checkoutPanel) {

    checkoutPanel.classList.remove(
      "active"
    );

  }

}


// =====================================================
// SUBMIT ORDER
// =====================================================

async function submitOrder() {

  console.log(
    "===================================="
  );

  console.log(
    "PEPTIVA ORDER DIAGNOSTIC START"
  );

  console.log(
    "===================================="
  );


  const name =
    document.getElementById(
      "customerName"
    )?.value.trim() || "";


  const phone =
    document.getElementById(
      "customerPhone"
    )?.value.trim() || "";


  const city =
    document.getElementById(
      "customerCity"
    )?.value.trim() || "";


  const notes =
    document.getElementById(
      "customerNotes"
    )?.value.trim() || "";


  const transactionReference =
    document.getElementById(
      "transactionReference"
    )?.value.trim() || "";


  console.log(
    "Customer:",
    {
      name,
      phone,
      city
    }
  );


  console.log(
    "Transaction Reference:",
    transactionReference
  );


  console.log(
    "Cart:",
    cart
  );


  if (!name) {

    alert(
      "Please enter your name."
    );

    return;

  }


  if (!phone) {

    alert(
      "Please enter your phone number."
    );

    return;

  }


  if (!city) {

    alert(
      "Please enter your city."
    );

    return;

  }


  if (cart.length === 0) {

    alert(
      "Your cart is empty."
    );

    return;

  }


  const orderId =
    "PEP-" +
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
          function (item) {

            return (
              `${item.name} × ${item.quantity}`
            );

          }
        )
        .join("\n"),

    total:
      getCartTotal()

  };


  console.log(
    "ORDER DATA CREATED:"
  );

  console.log(
    orderData
  );


  // ===================================================
  // SEND TO GOOGLE SHEETS
  // ===================================================

  let googleResult = false;


  try {

    googleResult =
      await sendOrderToGoogleSheets(
        orderData
      );


    console.log(
      "Google Sheets fetch completed:",
      googleResult
    );

  }
  catch (error) {

    console.error(
      "Google Sheets fetch ERROR:",
      error
    );

  }


  // ===================================================
  // SAVE LOCAL COPY
  // ===================================================

  saveOrderLocally(
    orderData
  );


  console.log(
    "Order saved locally."
  );


  // ===================================================
  // CLEAR CART
  // ===================================================

  cart = [];

  saveCart();

  updateCart();


  if (checkoutForm) {

    checkoutForm.reset();

  }


  closeCheckout();

  closeCart();


  showSuccess(
    orderId
  );


  console.log(
    "===================================="
  );

  console.log(
    "PEPTIVA ORDER DIAGNOSTIC END"
  );

  console.log(
    "===================================="

  );

}


// =====================================================
// GOOGLE SHEETS SEND — DIAGNOSTIC VERSION
// =====================================================

async function sendOrderToGoogleSheets(
  orderData
) {

  console.log(
    "------------------------------------"
  );

  console.log(
    "GOOGLE SHEETS SEND START"
  );


  console.log(
    "Endpoint:",
    GOOGLE_SCRIPT_URL
  );


  console.log(
    "Method: POST"
  );


  console.log(
    "Mode: no-cors"
  );


  console.log(
    "Payload:"
  );


  console.log(
    JSON.stringify(
      orderData,
      null,
      2
    )
  );


  const payload =
    JSON.stringify(
      orderData
    );


  try {

    const response =
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
            payload

        }
      );


    console.log(
      "GOOGLE SHEETS FETCH FINISHED"
    );


    console.log(
      "Response type:",
      response.type
    );


    console.log(
      "Response status:",
      response.status
    );


    console.log(
      "Response URL:",
      response.url
    );


    console.log(
      "IMPORTANT: no-cors prevents reading Google's response."
    );


    console.log(
      "If there is no browser/network error, the POST request was sent."
    );


    console.log(
      "------------------------------------"
    );


    return true;

  }
  catch (error) {

    console.error(
      "GOOGLE SHEETS FETCH FAILED"
    );


    console.error(
      error
    );


    console.log(
      "------------------------------------"
    );


    return false;

  }

}


// =====================================================
// SUCCESS
// =====================================================

function showSuccess(
  orderId
) {

  if (orderIdElement) {

    orderIdElement.textContent =
      orderId;

  }


  if (successOverlay) {

    successOverlay.classList.add(
      "active"
    );

  }

}


// =====================================================
// CLOSE SUCCESS
// =====================================================

function closeSuccess() {

  if (successOverlay) {

    successOverlay.classList.remove(
      "active"
    );

  }

}


// =====================================================
// MOBILE MENU
// =====================================================

function setupMobileMenu() {

  const menuButton =
    document.getElementById(
      "menuButton"
    );

  const nav =
    document.querySelector(
      ".nav"
    );


  if (
    menuButton &&
    nav
  ) {

    menuButton.addEventListener(
      "click",
      function () {

        nav.classList.toggle(
          "active"
        );

      }
    );

  }

}


// =====================================================
// FILTERS
// =====================================================

function setupFilters() {

  const filterButtons =
    document.querySelectorAll(
      "[data-filter]"
    );


  filterButtons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const filter =
            button.dataset.filter;


          filterButtons.forEach(
            function (btn) {

              btn.classList.remove(
                "active"
              );

            }
          );


          button.classList.add(
            "active"
          );


          const cards =
            document.querySelectorAll(
              ".product-card"
            );


          cards.forEach(
            function (card) {

              const category =
                card.dataset.category;


              if (
                filter === "all" ||
                category === filter
              ) {

                card.style.display =
                  "";

              } else {

                card.style.display =
                  "none";

              }

            }
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

  const searchInput =
    document.getElementById(
      "searchInput"
    );


  if (!searchInput) {
    return;
  }


  searchInput.addEventListener(
    "input",
    function () {

      const search =
        searchInput.value
          .toLowerCase()
          .trim();


      const cards =
        document.querySelectorAll(
          ".product-card"
        );


      cards.forEach(
        function (card) {

          const text =
            card.textContent
              .toLowerCase();


          if (
            text.includes(search)
          ) {

            card.style.display =
              "";

          } else {

            card.style.display =
              "none";

          }

        }
      );

    }
  );

}


// =====================================================
// PRODUCT MODAL
// =====================================================

function setupModal() {

  const modal =
    document.getElementById(
      "productModal"
    );


  const modalClose =
    document.getElementById(
      "modalClose"
    );


  if (!modal) {
    return;
  }


  document
    .querySelectorAll(
      ".product-card"
    )
    .forEach(
      function (card) {

        card.addEventListener(
          "click",
          function (event) {

            if (
              event.target.closest(
                "button"
              )
            ) {

              return;

            }


            const productId =
              card.dataset.productId;


            openProductModal(
              productId
            );

          }
        );

      }
    );


  if (modalClose) {

    modalClose.addEventListener(
      "click",
      function () {

        modal.classList.remove(
          "active"
        );

      }
    );

  }


  modal.addEventListener(
    "click",
    function (event) {

      if (
        event.target === modal
      ) {

        modal.classList.remove(
          "active"
        );

      }

    }
  );

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
          item.id === productId
        );

      }
    );


  if (!product) {
    return;
  }


  const modal =
    document.getElementById(
      "productModal"
    );


  const modalImage =
    document.getElementById(
      "modalImage"
    );


  const modalTitle =
    document.getElementById(
      "modalTitle"
    );


  const modalSubtitle =
    document.getElementById(
      "modalSubtitle"
    );


  const modalDescription =
    document.getElementById(
      "modalDescription"
    );


  const modalHowWorks =
    document.getElementById(
      "modalHowWorks"
    );


  const modalPrice =
    document.getElementById(
      "modalPrice"
    );


  if (modalImage) {

    modalImage.src =
      product.image;

    modalImage.alt =
      product.name;

  }


  if (modalTitle) {

    modalTitle.textContent =
      product.name;

  }


  if (modalSubtitle) {

    modalSubtitle.textContent =
      product.subtitle;

  }


  if (modalDescription) {

    modalDescription.textContent =
      product.description;

  }


  if (modalHowWorks) {

    modalHowWorks.textContent =
      product.howItWorks;

  }


  if (modalPrice) {

    modalPrice.textContent =
      `${product.price.toLocaleString()} EGP`;

  }


  if (modal) {

    modal.classList.add(
      "active"
    );

  }

}


// =====================================================
// GLOBAL FUNCTIONS
// =====================================================

window.addToCart =
  addToCart;

window.increaseQuantity =
  increaseQuantity;

window.decreaseQuantity =
  decreaseQuantity;

window.removeFromCart =
  removeFromCart;

window.openCart =
  openCart;

window.closeCart =
  closeCart;

window.openCheckout =
  openCheckout;

window.closeCheckout =
  closeCheckout;

window.closeSuccess =
  closeSuccess;

window.openProductModal =
  openProductModal;


// =====================================================
// END OF PEPTIVA SCRIPT
// =====================================================

console.log(
  "PEPTIVA script.js loaded successfully."
);
