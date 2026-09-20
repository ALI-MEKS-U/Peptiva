/* =========================================================
   PEPTIVA — MAIN JAVASCRIPT
   ========================================================= */

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzbrR6dZI7aMHuqDHF5AQkd3id5UhrnDPrAPhgryURTHKo6Y2wzuXKJECG0Ct912jpc/exec";

const INSTAPAY_NUMBER = "01277728571";


/* =========================================================
   PRODUCTS
========================================================= */

const products = [
  {
    id: "PT-001",
    name: "BPC-157 + TB-500",
    category: "recovery",
    price: 3800,
    image: "BPC VIAL.png",
    description:
      "Research compound combination commonly studied in recovery-related research.",
    howItWorks:
      "BPC-157 and TB-500 are studied in preclinical research involving tissue repair, recovery and cellular processes."
  },

  {
    id: "PT-002",
    name: "Retatrutide 10 MG",
    category: "research",
    price: 4600,
    image: "RETA10MG.png",
    description:
      "Research compound intended for laboratory research purposes.",
    howItWorks:
      "Retatrutide is an investigational multi-receptor peptide studied in metabolic research."
  },

  {
    id: "PT-003",
    name: "SLU-PP-332",
    category: "metabolic",
    price: 4600,
    image: "SLU.png",
    description:
      "Research compound used for laboratory and scientific research.",
    howItWorks:
      "SLU-PP-332 is studied in research related to metabolism and cellular energy pathways."
  },

  {
    id: "PT-004",
    name: "IGF-1",
    category: "performance",
    price: 4600,
    image: "igf1.png",
    description:
      "Research material intended for laboratory research purposes.",
    howItWorks:
      "IGF-1 is a growth-factor related molecule studied in cellular and biological research."
  },

  {
    id: "PT-005",
    name: "Retatrutide 20 MG",
    category: "research",
    price: 8500,
    image: "RETA10MG.png",
    description:
      "Research compound intended for laboratory research purposes.",
    howItWorks:
      "Retatrutide is an investigational multi-receptor peptide studied in metabolic research."
  },

  {
    id: "PT-006",
    name: "Trizpetide 60 MG",
    category: "metabolic",
    price: 8400,
    image: "TRIZ VIAL.png",
    description:
      "Research compound intended for laboratory research purposes.",
    howItWorks:
      "This compound is presented for laboratory research and scientific investigation."
  },

  {
    id: "PT-007",
    name: "GHK-CU 50 MG",
    category: "recovery",
    price: 6000,
    image: "GHK.png",
    description:
      "Copper peptide research material.",
    howItWorks:
      "GHK-Cu is studied in research involving cellular signaling and biological processes."
  },

  {
    id: "PT-008",
    name: "KPV 10 MG",
    category: "recovery",
    price: 4800,
    image: "kpv.png",
    description:
      "Research peptide intended for laboratory research.",
    howItWorks:
      "KPV is studied in preclinical research involving peptide signaling and inflammatory pathways."
  },

  {
    id: "PT-009",
    name: "MOTS-c 10 MG",
    category: "metabolic",
    price: 5600,
    image: "mots c.png",
    description:
      "Research peptide intended for laboratory research.",
    howItWorks:
      "MOTS-c is studied in research related to cellular metabolism and energy regulation."
  }
];


/* =========================================================
   CART
========================================================= */

let cart = [];

try {
  const savedCart = localStorage.getItem("peptiva_cart");

  if (savedCart) {
    cart = JSON.parse(savedCart);

    if (!Array.isArray(cart)) {
      cart = [];
    }
  }
} catch (error) {
  console.error("Cart loading error:", error);
  cart = [];
}


/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function formatPrice(price) {
  return Number(price || 0).toLocaleString("en-US") + " EGP";
}


function saveCart() {
  try {
    localStorage.setItem("peptiva_cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Could not save cart:", error);
  }
}


function getProduct(productId) {
  return products.find(function (product) {
    return product.id === productId;
  });
}


/* =========================================================
   PRODUCTS RENDER
========================================================= */

function renderProducts(filter = "all") {
  const grid = document.getElementById("productsGrid");

  if (!grid) {
    return;
  }

  let filteredProducts = products;

  if (filter && filter !== "all") {
    filteredProducts = products.filter(function (product) {
      return product.category === filter;
    });
  }

  grid.innerHTML = filteredProducts
    .map(function (product) {
      return `
        <article class="product-card">

          <div class="product-image-wrap">

            <img
              src="${escapeHTML(product.image)}"
              alt="${escapeHTML(product.name)}"
              class="product-image product-vial"
              loading="lazy"
              onerror="this.style.opacity='0.25';"
            >

            <span class="research-badge">
              RESEARCH
            </span>

          </div>

          <div class="product-card-content">

            <div class="product-info">

              <span class="product-category">
                ${escapeHTML(product.category)}
              </span>

              <h3>
                ${escapeHTML(product.name)}
              </h3>

              <p>
                ${escapeHTML(product.description)}
              </p>

            </div>

            <div class="product-card-bottom">

              <div class="product-price">
                ${formatPrice(product.price)}
              </div>

              <div class="product-actions">

                <button
                  type="button"
                  class="btn secondary product-view-button"
                  data-product-id="${escapeHTML(product.id)}"
                >
                  View
                </button>

                <button
                  type="button"
                  class="btn primary product-add-button"
                  data-product-id="${escapeHTML(product.id)}"
                >
                  Add to Cart
                </button>

              </div>

            </div>

          </div>

        </article>
      `;
    })
    .join("");

  attachProductEvents();
}


/* =========================================================
   PRODUCT EVENTS
========================================================= */

function attachProductEvents() {
  const addButtons = document.querySelectorAll(".product-add-button");

  addButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();

      const productId = button.getAttribute("data-product-id");

      addToCart(productId);
    });
  });


  const viewButtons = document.querySelectorAll(".product-view-button");

  viewButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();

      const productId = button.getAttribute("data-product-id");

      openProductModal(productId);
    });
  });


  const cards = document.querySelectorAll(".product-card");

  cards.forEach(function (card) {
    const image = card.querySelector(".product-image");

    if (image) {
      image.addEventListener("click", function () {
        const button = card.querySelector(".product-view-button");

        if (button) {
          openProductModal(
            button.getAttribute("data-product-id")
          );
        }
      });
    }
  });
}


/* =========================================================
   FILTERS
========================================================= */

function setupFilters() {
  const filterButtons =
    document.querySelectorAll("[data-category]");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const category =
        button.getAttribute("data-category") || "all";

      filterButtons.forEach(function (item) {
        item.classList.remove("active");
      });

      button.classList.add("active");

      renderProducts(category);
    });
  });
}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(productId) {
  const product = getProduct(productId);

  if (!product) {
    return;
  }

  const existingItem = cart.find(function (item) {
    return item.id === productId;
  });

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart();

  updateCartUI();

  openCart();

  showNotification(
    product.name + " added to cart"
  );
}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(productId) {
  cart = cart.filter(function (item) {
    return item.id !== productId;
  });

  saveCart();

  updateCartUI();
}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(productId, amount) {
  const item = cart.find(function (cartItem) {
    return cartItem.id === productId;
  });

  if (!item) {
    return;
  }

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();

  updateCartUI();
}


/* =========================================================
   CART TOTAL
========================================================= */

function getCartTotal() {
  return cart.reduce(function (total, item) {
    return total + Number(item.price) * Number(item.quantity);
  }, 0);
}


function getCartCount() {
  return cart.reduce(function (total, item) {
    return total + Number(item.quantity);
  }, 0);
}


/* =========================================================
   CART UI
========================================================= */

function updateCartUI() {
  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.textContent = getCartCount();
  }

  renderCart();
}


function renderCart() {
  const cartContainer =
    document.getElementById("cartItems");

  if (!cartContainer) {
    return;
  }

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <p>Add a product to continue.</p>
      </div>
    `;
  } else {
    cartContainer.innerHTML = cart
      .map(function (item) {
        return `
          <div class="cart-item">

            <div class="cart-item-image">
              <img
                src="${escapeHTML(item.image)}"
                alt="${escapeHTML(item.name)}"
              >
            </div>

            <div class="cart-item-info">

              <h4>
                ${escapeHTML(item.name)}
              </h4>

              <span>
                ${formatPrice(item.price)}
              </span>

              <div class="cart-quantity">

                <button
                  type="button"
                  class="quantity-btn"
                  data-cart-minus="${escapeHTML(item.id)}"
                >
                  −
                </button>

                <span>
                  ${item.quantity}
                </span>

                <button
                  type="button"
                  class="quantity-btn"
                  data-cart-plus="${escapeHTML(item.id)}"
                >
                  +
                </button>

              </div>

            </div>

            <button
              type="button"
              class="cart-remove"
              data-cart-remove="${escapeHTML(item.id)}"
            >
              ×
            </button>

          </div>
        `;
      })
      .join("");
  }


  const totalElement =
    document.getElementById("cartTotal");

  if (totalElement) {
    totalElement.textContent =
      formatPrice(getCartTotal());
  }


  attachCartEvents();
}


/* =========================================================
   CART EVENTS
========================================================= */

function attachCartEvents() {
  document
    .querySelectorAll("[data-cart-minus]")
    .forEach(function (button) {
      button.addEventListener("click", function () {
        changeQuantity(
          button.getAttribute("data-cart-minus"),
          -1
        );
      });
    });


  document
    .querySelectorAll("[data-cart-plus]")
    .forEach(function (button) {
      button.addEventListener("click", function () {
        changeQuantity(
          button.getAttribute("data-cart-plus"),
          1
        );
      });
    });


  document
    .querySelectorAll("[data-cart-remove]")
    .forEach(function (button) {
      button.addEventListener("click", function () {
        removeFromCart(
          button.getAttribute("data-cart-remove")
        );
      });
    });
}


/* =========================================================
   CART OPEN / CLOSE
========================================================= */

function openCart() {
  const cartPanel =
    document.getElementById("cartPanel");

  const overlay =
    document.getElementById("overlay");

  if (cartPanel) {
    cartPanel.classList.add("active");
  }

  if (overlay) {
    overlay.classList.add("active");
  }
}


function closeCart() {
  const cartPanel =
    document.getElementById("cartPanel");

  const overlay =
    document.getElementById("overlay");

  if (cartPanel) {
    cartPanel.classList.remove("active");
  }

  if (overlay) {
    overlay.classList.remove("active");
  }
}


/* =========================================================
   PRODUCT MODAL
========================================================= */

function openProductModal(productId) {
  const product = getProduct(productId);

  if (!product) {
    return;
  }

  const modal =
    document.getElementById("productModal");

  const modalProductImage =
    document.getElementById("modalProductImage");

  const modalProductName =
    document.getElementById("modalProductName");

  const modalProductPrice =
    document.getElementById("modalProductPrice");

  const modalProductDescription =
    document.getElementById("modalProductDescription");

  const modalProductHow =
    document.getElementById("modalProductHow");

  const modalAddButton =
    document.getElementById("modalAddToCart");


  if (modalProductImage) {
    modalProductImage.src = product.image;
    modalProductImage.alt = product.name;
    modalProductImage.style.opacity = "1";
  }


  if (modalProductName) {
    modalProductName.textContent = product.name;
  }


  if (modalProductPrice) {
    modalProductPrice.textContent =
      formatPrice(product.price);
  }


  if (modalProductDescription) {
    modalProductDescription.textContent =
      product.description;
  }


  if (modalProductHow) {
    modalProductHow.textContent =
      product.howItWorks;
  }


  if (modalAddButton) {
    modalAddButton.onclick = function () {
      addToCart(product.id);
    };
  }


  if (modal) {
    modal.classList.add("active");
  }

  const overlay =
    document.getElementById("overlay");

  if (overlay) {
    overlay.classList.add("active");
  }
}


function closeProductModal() {
  const modal =
    document.getElementById("productModal");

  if (modal) {
    modal.classList.remove("active");
  }

  const overlay =
    document.getElementById("overlay");

  if (overlay) {
    overlay.classList.remove("active");
  }
}


/* =========================================================
   CHECKOUT
========================================================= */

function openCheckout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty.");
    return;
  }

  const checkoutPanel =
    document.getElementById("checkoutPanel");

  const overlay =
    document.getElementById("overlay");

  if (checkoutPanel) {
    checkoutPanel.classList.add("active");
  }

  if (overlay) {
    overlay.classList.add("active");
  }

  renderCheckoutSummary();
}


function closeCheckout() {
  const checkoutPanel =
    document.getElementById("checkoutPanel");

  const overlay =
    document.getElementById("overlay");

  if (checkoutPanel) {
    checkoutPanel.classList.remove("active");
  }

  if (overlay) {
    overlay.classList.remove("active");
  }
}


function renderCheckoutSummary() {
  const summary =
    document.getElementById("checkoutSummary");

  if (!summary) {
    return;
  }

  summary.innerHTML = cart
    .map(function (item) {
      return `
        <div class="checkout-summary-item">

          <span>
            ${escapeHTML(item.name)}
            × ${item.quantity}
          </span>

          <strong>
            ${formatPrice(item.price * item.quantity)}
          </strong>

        </div>
      `;
    })
    .join("");

  const total =
    document.getElementById("checkoutTotal");

  if (total) {
    total.textContent =
      formatPrice(getCartTotal());
  }
}


/* =========================================================
   ORDER DATA
========================================================= */

function collectCustomerData() {
  const nameInput =
    document.getElementById("customerName");

  const phoneInput =
    document.getElementById("customerPhone");

  const emailInput =
    document.getElementById("customerEmail");

  const addressInput =
    document.getElementById("customerAddress");

  return {
    name: nameInput ? nameInput.value.trim() : "",
    phone: phoneInput ? phoneInput.value.trim() : "",
    email: emailInput ? emailInput.value.trim() : "",
    address: addressInput ? addressInput.value.trim() : ""
  };
}


function createProductsText() {
  return cart
    .map(function (item) {
      return (
        item.name +
        " x" +
        item.quantity +
        " - " +
        formatPrice(item.price * item.quantity)
      );
    })
    .join("\n");
}


/* =========================================================
   SEND ORDER TO GOOGLE SHEETS
========================================================= */

async function submitOrder() {
  if (cart.length === 0) {
    showNotification("Your cart is empty.");
    return;
  }

  const customer = collectCustomerData();

  if (!customer.name) {
    showNotification("Please enter your name.");
    return;
  }

  if (!customer.phone) {
    showNotification("Please enter your phone number.");
    return;
  }


  const submitButton =
    document.getElementById("submitOrderButton");

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
  }


  const orderData = {
    timestamp: new Date().toISOString(),

    customer: customer,

    products: cart,

    products_text: createProductsText(),

    total: getCartTotal(),

    total_text: formatPrice(getCartTotal()),

    source: "Peptiva Website"
  };


  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(orderData)
    });


    showNotification(
      "Order submitted successfully."
    );


    cart = [];

    saveCart();

    updateCartUI();

    closeCheckout();

    closeCart();


  } catch (error) {

    console.error(
      "Order submission error:",
      error
    );

    showNotification(
      "There was a problem submitting your order."
    );

  } finally {

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Submit Order";
    }
  }
}


/* =========================================================
   INSTAPAY
========================================================= */

function copyInstapayNumber() {
  if (!INSTAPAY_NUMBER) {
    return;
  }

  if (
    navigator.clipboard &&
    navigator.clipboard.writeText
  ) {
    navigator.clipboard
      .writeText(INSTAPAY_NUMBER)
      .then(function () {
        showNotification(
          "InstaPay number copied."
        );
      })
      .catch(function () {
        showNotification(
          INSTAPAY_NUMBER
        );
      });
  } else {
    showNotification(
      INSTAPAY_NUMBER
    );
  }
}


/* =========================================================
   NOTIFICATION
========================================================= */

function showNotification(message) {
  let notification =
    document.getElementById(
      "peptivaNotification"
    );

  if (!notification) {
    notification =
      document.createElement("div");

    notification.id =
      "peptivaNotification";

    notification.style.position =
      "fixed";

    notification.style.bottom =
      "25px";

    notification.style.left =
      "50%";

    notification.style.transform =
      "translateX(-50%)";

    notification.style.zIndex =
      "99999";

    notification.style.padding =
      "14px 22px";

    notification.style.borderRadius =
      "12px";

    notification.style.background =
      "#08080d";

    notification.style.color =
      "#ffffff";

    notification.style.border =
      "1px solid rgba(101,165,255,.35)";

    notification.style.boxShadow =
      "0 15px 40px rgba(0,0,0,.45)";

    notification.style.fontSize =
      "14px";

    notification.style.fontWeight =
      "600";

    document.body.appendChild(
      notification
    );
  }


  notification.textContent =
    message;

  notification.style.display =
    "block";


  clearTimeout(
    window.peptivaNotificationTimer
  );


  window.peptivaNotificationTimer =
    setTimeout(function () {
      notification.style.display =
        "none";
    }, 2500);
}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {
  const menuButton =
    document.getElementById("menuButton");

  const nav =
    document.querySelector(".nav");

  if (!menuButton || !nav) {
    return;
  }

  menuButton.addEventListener(
    "click",
    function () {
      nav.classList.toggle("active");
    }
  );
}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {
  const links =
    document.querySelectorAll(
      'a[href^="#"]'
    );

  links.forEach(function (link) {
    link.addEventListener(
      "click",
      function () {
        const targetId =
          link.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        const target =
          document.querySelector(
            targetId
          );

        if (target) {
          setTimeout(function () {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }, 50);
        }
      }
    );
  });
}


/* =========================================================
   CLOSE BUTTONS
========================================================= */

function setupCloseButtons() {

  const overlay =
    document.getElementById("overlay");

  if (overlay) {
    overlay.addEventListener(
      "click",
      function () {
        closeCart();
        closeCheckout();
        closeProductModal();
      }
    );
  }


  const cartButton =
    document.getElementById("cartButton");

  if (cartButton) {
    cartButton.addEventListener(
      "click",
      function () {
        openCart();
      }
    );
  }


  const closeCartButton =
    document.getElementById("closeCart");

  if (closeCartButton) {
    closeCartButton.addEventListener(
      "click",
      function () {
        closeCart();
      }
    );
  }


  const checkoutButton =
    document.getElementById("checkoutButton");

  if (checkoutButton) {
    checkoutButton.addEventListener(
      "click",
      function () {
        openCheckout();
      }
    );
  }


  const closeCheckoutButton =
    document.getElementById(
      "closeCheckout"
    );

  if (closeCheckoutButton) {
    closeCheckoutButton.addEventListener(
      "click",
      function () {
        closeCheckout();
      }
    );
  }


  const closeProductButton =
    document.getElementById(
      "closeProductModal"
    );

  if (closeProductButton) {
    closeProductButton.addEventListener(
      "click",
      function () {
        closeProductModal();
      }
    );
  }


  const submitButton =
    document.getElementById(
      "submitOrderButton"
    );

  if (submitButton) {
    submitButton.addEventListener(
      "click",
      function (event) {
        event.preventDefault();
        submitOrder();
      }
    );
  }


  const copyButton =
    document.getElementById(
      "copyInstapay"
    );

  if (copyButton) {
    copyButton.addEventListener(
      "click",
      function (event) {
        event.preventDefault();
        copyInstapayNumber();
      }
    );
  }
}


/* =========================================================
   ESC KEY
========================================================= */

function setupEscapeKey() {
  document.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Escape") {
        closeCart();
        closeCheckout();
        closeProductModal();
      }

    }
  );
}


/* =========================================================
   IMAGE ERROR HANDLING
========================================================= */

function setupImageFallbacks() {
  document
    .querySelectorAll("img")
    .forEach(function (image) {

      image.addEventListener(
        "error",
        function () {
          console.warn(
            "Image failed to load:",
            image.src
          );
        }
      );

    });
}


/* =========================================================
   INIT
========================================================= */

function initPeptiva() {

  renderProducts();

  updateCartUI();

  setupFilters();

  setupMobileMenu();

  setupNavigation();

  setupCloseButtons();

  setupEscapeKey();

  setupImageFallbacks();

}


/* =========================================================
   START
========================================================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initPeptiva
  );

} else {

  initPeptiva();

}
