/* =====================================================
   PEPTIVA — SCRIPT.JS
   Products + Search + Filters + Modal + Cart
   Checkout + InstaPay + Google Sheets
   ===================================================== */


/* =====================================================
   GOOGLE APPS SCRIPT
===================================================== */

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzbrR6dZI7aMHuqDHF5AQkd3id5UhrnDPrAPhgryURTHKo6Y2wzuXKJECG0Ct912jpc/exec";


/* =====================================================
   PRODUCTS
===================================================== */

const products = [

  {
    id: "PT-001",
    name: "BPC-157 + TB-500",
    subtitle: "5/5 MG",
    category: "recovery",
    categoryLabel: "Recovery",
    price: 3800,
    image: "BPC VIAL.png",
    description: "Recovery peptide."
  },

  {
    id: "PT-002",
    name: "Retatrutide",
    subtitle: "10 MG",
    category: "research",
    categoryLabel: "Research",
    price: 5000,
    image: "RETA10MG.png",
    description: "Fat Loss peptide."
  },

  {
    id: "PT-003",
    name: "SLU-PP-332",
    subtitle: "60 Capsules",
    category: "research",
    categoryLabel: "Research",
    price: 5500,
    image: "SLU.png",
    description: "Fat Loss peptide."
  },

  {
    id: "PT-004",
    name: "IGF-1",
    subtitle: "1 MG",
    category: "research",
    categoryLabel: "Research",
    price: 4600,
    image: "igf1.png",
    description: "Performance peptide"
  },

  {
    id: "PT-005",
    name: "Retatrutide",
    subtitle: "20 MG",
    category: "research",
    categoryLabel: "Research",
    price: 8300,
    image: "RETA10MG.png",
    description: "Fat Loss peptide"
  },

  {
    id: "PT-006",
    name: "Trizpetide",
    subtitle: "60 MG",
    category: "other",
    categoryLabel: "Other",
    price: 8700,
    image: "TRIZ VIAL.png",
    description: "Research-focused product."
  },

  {
    id: "PT-007",
    name: "GHK-CU",
    subtitle: "50 MG",
    category: "research",
    categoryLabel: "Research",
    price: 6000,
    image: "GHK.png",
    description: "Wellness peptide."
  },

  {
    id: "PT-008",
    name: "KPV",
    subtitle: "10 MG",
    category: "research",
    categoryLabel: "Research",
    price: 4800,
    image: "kpv.png",
    description: "Wellness peptide."
  },

  {
    id: "PT-009",
    name: "MOTS-c",
    subtitle: "10 MG",
    category: "research",
    categoryLabel: "Research",
    price: 5600,
    image: "mots c.png",
    description: "Wellness peptide."
  }

];


/* =====================================================
   GLOBAL STATE
===================================================== */

let cart = [];

let currentFilter = "all";

let currentSearch = "";

let selectedProductId = null;


/* =====================================================
   DOM
===================================================== */

const productsGrid =
  document.getElementById("productsGrid");

const productSearch =
  document.getElementById("productSearch");

const filterButtons =
  document.querySelectorAll(".filter");

const cartButton =
  document.getElementById("cartButton");

const cartCount =
  document.getElementById("cartCount");

const cartOverlay =
  document.getElementById("cartOverlay");

const closeCart =
  document.getElementById("closeCart");

const cartItems =
  document.getElementById("cartItems");

const cartTotal =
  document.getElementById("cartTotal");

const checkoutButton =
  document.getElementById("checkoutButton");

const checkoutOverlay =
  document.getElementById("checkoutOverlay");

const closeCheckout =
  document.getElementById("closeCheckout");

const checkoutTotal =
  document.getElementById("checkoutTotal");

const orderForm =
  document.getElementById("orderForm");

const productModal =
  document.getElementById("productModal");

const closeProductModal =
  document.getElementById("closeProductModal");

const modalProductImage =
  document.getElementById("modalProductImage");

const modalProductCategory =
  document.getElementById("modalProductCategory");

const modalProductName =
  document.getElementById("modalProductName");

const modalProductDescription =
  document.getElementById("modalProductDescription");

const modalProductPrice =
  document.getElementById("modalProductPrice");

const modalAddToCart =
  document.getElementById("modalAddToCart");

const successOverlay =
  document.getElementById("successOverlay");

const successOrderId =
  document.getElementById("successOrderId");

const closeSuccess =
  document.getElementById("closeSuccess");

const menuButton =
  document.getElementById("menuButton");

const navLinks =
  document.querySelector(".nav-links");


/* =====================================================
   HELPERS
===================================================== */

function formatPrice(price) {
  return `EGP ${Number(price).toLocaleString("en-US")}`;
}


function getProductById(id) {
  return products.find(product => product.id === id);
}


function generateOrderId() {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const random =
    Math.floor(1000 + Math.random() * 9000);

  return `PEP-${date}-${random}`;
}


/* =====================================================
   LOCAL STORAGE
===================================================== */

function saveCart() {
  try {
    localStorage.setItem(
      "peptiva_cart",
      JSON.stringify(cart)
    );
  } catch (error) {
    console.error(
      "Could not save cart:",
      error
    );
  }
}


function loadCart() {
  try {

    const saved =
      localStorage.getItem("peptiva_cart");

    if (!saved) {
      cart = [];
      return;
    }

    const parsed =
      JSON.parse(saved);

    if (Array.isArray(parsed)) {
      cart = parsed;
    } else {
      cart = [];
    }

  } catch (error) {

    console.error(
      "Could not load cart:",
      error
    );

    cart = [];
  }
}


/* =====================================================
   PRODUCTS
===================================================== */

function renderProducts() {

  if (!productsGrid) {
    console.error(
      "productsGrid not found."
    );
    return;
  }

  const search =
    currentSearch
      .trim()
      .toLowerCase();


  const filteredProducts =
    products.filter(product => {

      const matchesFilter =
        currentFilter === "all" ||
        product.category === currentFilter;


      const searchableText = `
        ${product.name}
        ${product.subtitle}
        ${product.categoryLabel}
        ${product.description}
        ${product.id}
      `.toLowerCase();


      const matchesSearch =
        !search ||
        searchableText.includes(search);


      return (
        matchesFilter &&
        matchesSearch
      );

    });


  if (filteredProducts.length === 0) {

    productsGrid.innerHTML = `
      <div
        style="
          grid-column: 1 / -1;
          padding: 60px 20px;
          text-align: center;
          color: #9999a8;
        "
      >
        <h3
          style="
            color: white;
            margin-bottom: 8px;
          "
        >
          No products found
        </h3>

        <p>
          Try another search or category.
        </p>
      </div>
    `;

    return;
  }


  productsGrid.innerHTML =
    filteredProducts
      .map(createProductCard)
      .join("");
}


/* =====================================================
   PRODUCT CARD
===================================================== */

function createProductCard(product) {

  return `
    <article
      class="product-card"
      data-product-id="${product.id}"
    >

      <div class="product-image-wrap">

        <img
          class="product-image product-vial"
          src="${escapeAttribute(product.image)}"
          alt="${escapeAttribute(product.name)}"
          loading="lazy"
          onerror="this.style.display='none'; this.parentElement.classList.add('image-missing');"
        >

        <span class="research-badge">
          RESEARCH
        </span>

      </div>


      <div class="product-card-content">

        <span class="product-category">
          ${escapeHTML(product.categoryLabel)}
        </span>


        <h3>
          ${escapeHTML(product.name)}
        </h3>


        <div class="product-subtitle">
          ${escapeHTML(product.subtitle)}
        </div>


        <p class="product-description">
          ${escapeHTML(product.description)}
        </p>


        <div class="product-card-bottom">

          <strong class="product-price">
            ${formatPrice(product.price)}
          </strong>


          <div
            style="
              display:flex;
              gap:7px;
            "
          >

            <button
              class="product-view-button"
              type="button"
              data-action="view"
              data-id="${product.id}"
            >
              View
            </button>


            <button
              class="product-add-button"
              type="button"
              data-action="add"
              data-id="${product.id}"
            >
              Add
            </button>

          </div>

        </div>

      </div>

    </article>
  `;
}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {
  return escapeHTML(value);
}


/* =====================================================
   PRODUCT GRID EVENTS
===================================================== */

if (productsGrid) {

  productsGrid.addEventListener(
    "click",
    function(event) {

      const button =
        event.target.closest("button");

      if (!button) {
        return;
      }


      const action =
        button.dataset.action;

      const id =
        button.dataset.id;


      if (!id) {
        return;
      }


      if (action === "view") {
        openProductModal(id);
      }


      if (action === "add") {
        addToCart(id);
      }

    }
  );

}


/* =====================================================
   SEARCH
===================================================== */

if (productSearch) {

  productSearch.addEventListener(
    "input",
    function(event) {

      currentSearch =
        event.target.value;

      renderProducts();

    }
  );

}


/* =====================================================
   FILTERS
===================================================== */

filterButtons.forEach(button => {

  button.addEventListener(
    "click",
    function() {

      filterButtons.forEach(
        btn => btn.classList.remove("active")
      );

      button.classList.add("active");

      currentFilter =
        button.dataset.filter || "all";

      renderProducts();

    }
  );

});


/* =====================================================
   PRODUCT MODAL
===================================================== */

function openProductModal(productId) {

  const product =
    getProductById(productId);

  if (!product) {
    return;
  }


  selectedProductId =
    product.id;


  if (modalProductImage) {

    modalProductImage.src =
      product.image;

    modalProductImage.alt =
      product.name;

    modalProductImage.onerror =
      function() {
        this.style.display = "none";
      };

  }


  if (modalProductCategory) {

    modalProductCategory.textContent =
      product.categoryLabel.toUpperCase();

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
      formatPrice(product.price);

  }


  if (productModal) {

    productModal.classList.add("active");

    document.body.style.overflow =
      "hidden";

  }

}


function closeProductModalFunction() {

  if (!productModal) {
    return;
  }

  productModal.classList.remove("active");

  document.body.style.overflow = "";

  selectedProductId = null;
}


if (closeProductModal) {

  closeProductModal.addEventListener(
    "click",
    closeProductModalFunction
  );

}


if (productModal) {

  productModal.addEventListener(
    "click",
    function(event) {

      if (
        event.target === productModal
      ) {
        closeProductModalFunction();
      }

    }
  );

}


if (modalAddToCart) {

  modalAddToCart.addEventListener(
    "click",
    function() {

      if (!selectedProductId) {
        return;
      }

      addToCart(selectedProductId);

      closeProductModalFunction();

    }
  );

}


/* =====================================================
   CART
===================================================== */

function addToCart(productId) {

  const product =
    getProductById(productId);

  if (!product) {
    return;
  }


  const existing =
    cart.find(
      item => item.id === productId
    );


  if (existing) {

    existing.quantity += 1;

  } else {

    cart.push({
      id: product.id,
      quantity: 1
    });

  }


  saveCart();

  renderCart();

  updateCartCount();

  showCartButtonFeedback();

}


function increaseQuantity(productId) {

  const item =
    cart.find(
      cartItem => cartItem.id === productId
    );

  if (!item) {
    return;
  }


  item.quantity += 1;

  saveCart();

  renderCart();

  updateCartCount();

}


function decreaseQuantity(productId) {

  const item =
    cart.find(
      cartItem => cartItem.id === productId
    );

  if (!item) {
    return;
  }


  item.quantity -= 1;


  if (item.quantity <= 0) {

    cart =
      cart.filter(
        cartItem =>
          cartItem.id !== productId
      );

  }


  saveCart();

  renderCart();

  updateCartCount();

}


function removeFromCart(productId) {

  cart =
    cart.filter(
      item =>
        item.id !== productId
    );


  saveCart();

  renderCart();

  updateCartCount();

}


function getCartCount() {

  return cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

}


function getCartTotal() {

  return cart.reduce(
    (total, item) => {

      const product =
        getProductById(item.id);

      if (!product) {
        return total;
      }

      return (
        total +
        product.price *
        Number(item.quantity || 0)
      );

    },
    0
  );

}


/* =====================================================
   CART COUNT
===================================================== */

function updateCartCount() {

  if (!cartCount) {
    return;
  }

  cartCount.textContent =
    getCartCount();

}


/* =====================================================
   CART RENDER
===================================================== */

function renderCart() {

  if (!cartItems) {
    return;
  }


  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="empty-cart">
        Your cart is empty.
      </div>
    `;

    if (cartTotal) {
      cartTotal.textContent =
        "EGP 0";
    }

    if (checkoutButton) {
      checkoutButton.disabled = true;
      checkoutButton.style.opacity = "0.5";
      checkoutButton.style.cursor = "not-allowed";
    }

    return;
  }


  if (checkoutButton) {
    checkoutButton.disabled = false;
    checkoutButton.style.opacity = "";
    checkoutButton.style.cursor = "";
  }


  cartItems.innerHTML =
    cart.map(item => {

      const product =
        getProductById(item.id);

      if (!product) {
        return "";
      }


      const quantity =
        Number(item.quantity || 1);


      const subtotal =
        product.price * quantity;


      return `
        <div class="cart-item">

          <div class="cart-item-image">

            <img
              src="${escapeAttribute(product.image)}"
              alt="${escapeAttribute(product.name)}"
              onerror="this.style.display='none';"
            >

          </div>


          <div class="cart-item-info">

            <h3>
              ${escapeHTML(product.name)}
            </h3>

            <span>
              ${escapeHTML(product.subtitle)}
            </span>

            <strong>
              ${formatPrice(subtotal)}
            </strong>


            <div class="cart-item-controls">

              <button
                class="quantity-button"
                type="button"
                data-cart-action="decrease"
                data-id="${product.id}"
              >
                −
              </button>


              <span class="quantity">
                ${quantity}
              </span>


              <button
                class="quantity-button"
                type="button"
                data-cart-action="increase"
                data-id="${product.id}"
              >
                +
              </button>


              <button
                class="remove-item"
                type="button"
                data-cart-action="remove"
                data-id="${product.id}"
              >
                Remove
              </button>

            </div>

          </div>

        </div>
      `;

    }).join("");


  if (cartTotal) {

    cartTotal.textContent =
      formatPrice(getCartTotal());

  }

}


/* =====================================================
   CART EVENTS
===================================================== */

if (cartItems) {

  cartItems.addEventListener(
    "click",
    function(event) {

      const button =
        event.target.closest("button");

      if (!button) {
        return;
      }


      const action =
        button.dataset.cartAction;

      const id =
        button.dataset.id;


      if (!id) {
        return;
      }


      if (action === "increase") {
        increaseQuantity(id);
      }


      if (action === "decrease") {
        decreaseQuantity(id);
      }


      if (action === "remove") {
        removeFromCart(id);
      }

    }
  );

}


/* =====================================================
   CART OPEN / CLOSE
===================================================== */

function openCart() {

  if (!cartOverlay) {
    return;
  }

  renderCart();

  cartOverlay.classList.add("active");

  document.body.style.overflow =
    "hidden";

}


function closeCartFunction() {

  if (!cartOverlay) {
    return;
  }

  cartOverlay.classList.remove("active");

  document.body.style.overflow = "";

}


if (cartButton) {

  cartButton.addEventListener(
    "click",
    openCart
  );

}


if (closeCart) {

  closeCart.addEventListener(
    "click",
    closeCartFunction
  );

}


if (cartOverlay) {

  cartOverlay.addEventListener(
    "click",
    function(event) {

      if (
        event.target === cartOverlay
      ) {
        closeCartFunction();
      }

    }
  );

}


/* =====================================================
   CART BUTTON FEEDBACK
===================================================== */

function showCartButtonFeedback() {

  if (!cartButton) {
    return;
  }


  const originalText =
    cartButton.innerHTML;


  cartButton.innerHTML =
    `Added <span>${getCartCount()}</span>`;


  setTimeout(
    function() {

      cartButton.innerHTML =
        `Cart <span>${getCartCount()}</span>`;

    },
    900
  );

}


/* =====================================================
   CHECKOUT
===================================================== */

function openCheckout() {

  if (cart.length === 0) {

    alert(
      "Your cart is empty."
    );

    return;
  }


  if (checkoutTotal) {

    checkoutTotal.textContent =
      formatPrice(getCartTotal());

  }


  if (cartOverlay) {
    cartOverlay.classList.remove("active");
  }


  if (checkoutOverlay) {

    checkoutOverlay.classList.add("active");

    document.body.style.overflow =
      "hidden";

  }

}


function closeCheckoutFunction() {

  if (!checkoutOverlay) {
    return;
  }

  checkoutOverlay.classList.remove("active");

  document.body.style.overflow = "";

}


if (checkoutButton) {

  checkoutButton.addEventListener(
    "click",
    openCheckout
  );

}


if (closeCheckout) {

  closeCheckout.addEventListener(
    "click",
    closeCheckoutFunction
  );

}


if (checkoutOverlay) {

  checkoutOverlay.addEventListener(
    "click",
    function(event) {

      if (
        event.target === checkoutOverlay
      ) {
        closeCheckoutFunction();
      }

    }
  );

}


/* =====================================================
   ORDER DATA
===================================================== */

function buildProductsText() {

  return cart
    .map(item => {

      const product =
        getProductById(item.id);

      if (!product) {
        return "";
      }


      const quantity =
        Number(item.quantity || 1);


      const subtotal =
        product.price * quantity;


      return [
        `${product.name}`,
        `${product.subtitle}`,
        `Qty: ${quantity}`,
        `${formatPrice(subtotal)}`
      ].join(" | ");

    })
    .filter(Boolean)
    .join(" || ");

}


/* =====================================================
   SUBMIT ORDER
===================================================== */

if (orderForm) {

  orderForm.addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();


      if (cart.length === 0) {

        alert(
          "Your cart is empty."
        );

        return;
      }


      const customerName =
        document
          .getElementById("customerName")
          ?.value
          .trim();


      const customerPhone =
        document
          .getElementById("customerPhone")
          ?.value
          .trim();


      const customerCity =
        document
          .getElementById("customerCity")
          ?.value
          .trim();


      const customerNotes =
        document
          .getElementById("customerNotes")
          ?.value
          .trim();


      const transactionReference =
        document
          .getElementById("transactionReference")
          ?.value
          .trim();


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


      const orderId =
        generateOrderId();


      const total =
        getCartTotal();


      const payload = {

        order_id: orderId,

        customer: {

          name: customerName,

          phone: customerPhone,

          city: customerCity,

          notes: customerNotes

        },

        products_text:
          buildProductsText(),

        total:
          total,

        payment_method:
          "InstaPay",

        payment_account:
          "alimekwy08@instapay",

        payment_reference:
          transactionReference,

        payment_status:
          "Payment Reference Submitted"

      };


      const submitButton =
        orderForm.querySelector(
          'button[type="submit"]'
        );


      const originalButtonText =
        submitButton
          ? submitButton.textContent
          : "Confirm Order";


      if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
          "Submitting...";

        submitButton.style.opacity =
          "0.7";

      }


      try {

        /*
         * IMPORTANT:
         * text/plain avoids unnecessary CORS
         * preflight requests with Google Apps Script.
         */

        const response =
          await fetch(
            GOOGLE_SCRIPT_URL,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "text/plain;charset=utf-8"
              },

              body:
                JSON.stringify(payload)

            }
          );


        let result = null;


        try {

          const responseText =
            await response.text();

          if (responseText) {

            result =
              JSON.parse(responseText);

          }

        } catch (parseError) {

          console.warn(
            "Could not parse Google response:",
            parseError
          );

        }


        /*
         * If Google returned a clear failure,
         * do not show success.
         */

        if (
          result &&
          result.success === false
        ) {

          throw new Error(
            result.error ||
            "Google Sheets rejected the order."
          );

        }


        /*
         * Success
         */

        closeCheckoutFunction();


        if (successOrderId) {

          successOrderId.textContent =
            orderId;

        }


        if (successOverlay) {

          successOverlay.classList.add(
            "active"
          );

        }


        /*
         * Clear cart after successful submission.
         */

        cart = [];

        saveCart();

        renderCart();

        updateCartCount();


        /*
         * Clear form.
         */

        orderForm.reset();


      } catch (error) {

        console.error(
          "Order submission error:",
          error
        );


        alert(
          "There was a problem submitting your order. Please try again."
        );


      } finally {

        if (submitButton) {

          submitButton.disabled = false;

          submitButton.textContent =
            originalButtonText;

          submitButton.style.opacity =
            "";

        }

      }

    }
  );

}


/* =====================================================
   SUCCESS
===================================================== */

function closeSuccessFunction() {

  if (!successOverlay) {
    return;
  }

  successOverlay.classList.remove(
    "active"
  );

  document.body.style.overflow = "";

}


if (closeSuccess) {

  closeSuccess.addEventListener(
    "click",
    closeSuccessFunction
  );

}


if (successOverlay) {

  successOverlay.addEventListener(
    "click",
    function(event) {

      if (
        event.target === successOverlay
      ) {
        closeSuccessFunction();
      }

    }
  );

}


/* =====================================================
   MOBILE MENU
===================================================== */

if (menuButton && navLinks) {

  menuButton.addEventListener(
    "click",
    function() {

      navLinks.classList.toggle(
        "active"
      );

    }
  );


  navLinks
    .querySelectorAll("a")
    .forEach(link => {

      link.addEventListener(
        "click",
        function() {

          navLinks.classList.remove(
            "active"
          );

        }
      );

    });

}


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key !== "Escape") {
      return;
    }


    if (
      productModal &&
      productModal.classList.contains("active")
    ) {
      closeProductModalFunction();
    }


    if (
      cartOverlay &&
      cartOverlay.classList.contains("active")
    ) {
      closeCartFunction();
    }


    if (
      checkoutOverlay &&
      checkoutOverlay.classList.contains("active")
    ) {
      closeCheckoutFunction();
    }


    if (
      successOverlay &&
      successOverlay.classList.contains("active")
    ) {
      closeSuccessFunction();
    }

  }
);


/* =====================================================
   INITIALIZE
===================================================== */

function initializePeptiva() {

  console.log(
    "PEPTIVA initializing..."
  );


  console.log(
    `Products loaded: ${products.length}`
  );


  loadCart();

  renderProducts();

  renderCart();

  updateCartCount();


  console.log(
    "PEPTIVA initialized successfully."
  );

}


/* =====================================================
   START
===================================================== */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializePeptiva
  );

} else {

  initializePeptiva();

}
