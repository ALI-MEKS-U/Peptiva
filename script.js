// =====================================================
// OPEN CART
// =====================================================

function openCart() {

  const cartOverlay =
    document.getElementById("cartOverlay");

  if (!cartOverlay) {
    console.error("PEPTIVA: cartOverlay not found");
    return;
  }

  cartOverlay.classList.add("active");

  document.body.classList.add("no-scroll");

  // Make sure cart is updated before opening
  updateCart();
}


// =====================================================
// CLOSE CART
// =====================================================

function closeCart() {

  const cartOverlay =
    document.getElementById("cartOverlay");

  if (!cartOverlay) {
    return;
  }

  cartOverlay.classList.remove("active");

  document.body.classList.remove("no-scroll");
}


// =====================================================
// CART SETUP
// =====================================================

function setupCart() {

  // OPEN CART BUTTON
  if (cartButton) {

    cartButton.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        openCart();

      }
    );

  }


  // CLOSE CART BUTTON
  if (closeCart) {

    closeCart.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        closeCart();

      }
    );

  }


  // CLICK OUTSIDE CART
  if (cartOverlay) {

    cartOverlay.addEventListener(
      "click",
      function (event) {

        if (
          event.target === cartOverlay
        ) {

          closeCart();

        }

      }
    );

  }

}
