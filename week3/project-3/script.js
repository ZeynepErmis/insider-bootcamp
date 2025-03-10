$(document).ready(function () {
  /**
   * Fetches product data from the Fake Store API and processes it.
   *
   * This function retrieves a list of products from the API, selects the first 20 items,
   * and also picks 20 random products for a slider display. It then renders both the
   * product list and the slider on the page.
   */
  function fetchProducts() {
    // Make an AJAX request to fetch product data from the API
    $.get({
      url: "https://fakestoreapi.com/products",
      method: "GET",
      dataType: "json",
    })
      .done(function (data) {
        let products = data.slice(0, 20);
        let randomProducts = shuffleArray(data).slice(0, 20);

        renderProducts(products);
        renderProductSlider(randomProducts);
      })
      .fail(function (error) {
        // Log an error message if the request fails
        console.log(
          "An error occurred while loading, please try again:",
          error
        );
      });
  }
  fetchProducts();

  /**
   * Shuffles an array randomly using Fisher-Yates algorithm.
   * @param {Array} array - The array to shuffle.
   * @returns {Array} - The shuffled array.
   */
  function shuffleArray(array) {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Implements a debounce function to limit the frequency of function execution.
   * This is useful for optimizing search functionality by reducing API calls.
   *
   * @param {Function} func - The function to debounce
   * @param {Number} delay - The delay in milliseconds
   * @returns {Function} - A debounced version of the function
   */
  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Create a debounced version of the search function with a 300ms delay
  const debouncedSearch = debounce(searchProducts, 300);

  /**
   * Event listener for input in the search bar.
   * Triggers the debounced search function with the trimmed input value.
   */
  $("#search-input").on("input", function () {
    debouncedSearch($(this).val().trim());
  });

  /**
   * Event listener for when the search input gains focus.
   * If the input is not empty, it immediately triggers a search.
   */
  $("#search-input").on("focus", function () {
    let query = $(this).val().trim();
    if (query.length > 0) {
      searchProducts(query);
    }
  });

  /**
   * Fetches products from the API and filters them based on the search query.
   * If the query is empty, it hides the search results.
   *
   * @param {String} query - The search query input by the user
   */
  function searchProducts(query) {
    if (query.length < 1) {
      $("#search-results").hide();
      return;
    }

    $.get(`https://fakestoreapi.com/products`, function (data) {
      let filteredProducts = data.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );

      displayResults(filteredProducts);
    });
  }

  /**
   * Displays the filtered search results in a list.
   * If no products match the query, the results list is hidden.
   *
   * @param {Array} products - The filtered list of products
   */
  function displayResults(products) {
    let resultList = document.getElementById("search-results");
    resultList.innerHTML = "";

    if (products.length === 0) {
      resultList.style.display = "none";
      return;
    }

    products.forEach((product) => {
      let listItem = document.createElement("li");
      listItem.setAttribute("data-fancybox", "");
      listItem.setAttribute("data-src", `#modal-${product.id}`);
      listItem.setAttribute("data-id", product.id);
      listItem.textContent = product.title;

      resultList.appendChild(listItem);
    });

    resultList.style.display = "block";
  }

  /**
   * Event listener to hide the search results when clicking outside the search bar.
   */
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".search-bar").length) {
      $("#search-results").hide();
    }
  });

  /**
   * Renders a product slider using Slick Slider.
   * @param {Array} products - The list of products to display in the slider.
   */
  function renderProductSlider(products) {
    let sliderContainer = $(".product-slider");
    sliderContainer.empty();

    products.forEach((product) => {
      let slideItem = `
        <div class="slide-item">
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title}</h3>
        </div>
      `;

      document.querySelectorAll(".slide-item h3").forEach((h3) => {
        let maxLength = 25;
        if (h3.textContent.length > maxLength) {
          h3.textContent = h3.textContent.substring(0, maxLength) + "...";
        }
      });

      sliderContainer.append(slideItem);
    });

    // Initialize Slick Slider with settings
    sliderContainer.slick({
      arrows: false,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      adaptiveHeight: true,
      responsive: [
        {
          breakpoint: 1024, // When screen width is below 1024px
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 600, // When screen width is below 600px
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    });
  }

  /**
   * Renders a list of products into the HTML container.
   * @param {Array} products - The list of products to display.
   */
  function renderProducts(products) {
    $("#productList").empty();

    products.forEach((product) => {
      let starHtml = renderStars(product.rating.rate);

      let productCard = `
        <div class="product-card" data-id="${product.id}">
          <img src="${product.image}" alt="${product.title}">
          <h3 class="product-title">${product.title}</h3>
          <div class="rating">
          <span class="rating-score">${product.rating.rate}</span>
          <div class="stars">${starHtml}</div>
          <span class="rating-count">(${product.rating.count})</span>
          </div>
          <p class="product-price">${product.price}$</p>
          
          <div class="product-actions">
          <div class="left-actions">
            <button class="favorite-btn">
              <i class="fa-regular fa-heart heart-icon"></i>
            </button>
            <button class="add-to-cart">
              <i class="fa-solid fa-cart-shopping"></i>
            </button>
          </div>
          <button class="view-details" data-fancybox data-src="#modal-${product.id}" href="javascript:;">
            <i class="fa-solid fa-eye"></i>
          </button>
        </div>
        </div>
        
        <!-- Modal Content -->
        <div id="modal-${product.id}" class="modal-content" style="display: none;">
          <h2>${product.title}</h2>
          <img src="${product.image}" alt="${product.title}" style="width: 20%; height: auto;">
          <p><strong>Category:</strong> ${product.category}</p>
          <p><strong>Description:</strong> ${product.description}</p>
          <p><strong>Price:</strong> ${product.price} $</p>
          <div class="rating">
            <span class="rating-score">${product.rating.rate}</span>
            <div class="stars">${starHtml}</div>
            <span class="rating-count">(${product.rating.count})</span>
          </div>
      `;

      $("#productList").append(productCard);
    });
  }

  /**
   * Fancybox configuration for handling product modals.
   * This sets up animations, closing effects, and transitions for product details.
   */
  Fancybox.bind("[data-fancybox]", {
    animationEffect: false, // Varsayılan animasyonları kapatıyoruz
    transitionEffect: false,
    compact: false,
    dragToClose: true,
    showClass: "fancybox-fadeIn",
    hideClass: false,
    infinite: true,
    on: {
      reveal: (instance, slide) => {
        if (slide.$content) {
          $(slide.$content).hide().slideDown(500);
        }
      },
      beforeClose: (instance, slide) => {
        return new Promise((resolve) => {
          if (slide.$content && $(slide.$content).length) {
            $(slide.$content).slideUp(500, resolve);
          } else {
            resolve();
          }
        });
      },
    },
  });

  /**
   * Adds a hover effect to product cards by scaling them on mouse enter and resetting on mouse leave.
   */
  function addProductCardHoverEffect() {
    $(document)
      .on("mouseenter", ".product-card", function () {
        $(this).css("transform", "scale(1.05)");
      })
      .on("mouseleave", ".product-card", function () {
        $(this).css("transform", "scale(1)");
      });
  }

  addProductCardHoverEffect();

  /**
   * Generates star rating HTML based on the given rating value.
   * @param {number} rating - The rating value (0-5).
   * @returns {string} HTML string representing star icons.
   */
  function renderStars(rating) {
    let starHtml = "";
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        starHtml += '<i class="fas fa-star"></i>';
      } else if (i < rating) {
        starHtml += '<i class="fas fa-star-half-alt"></i>';
      } else {
        starHtml += '<i class="far fa-star"></i>';
      }
    }
    return starHtml;
  }

  /**
   * Handles adding a product to the shopping cart.
   * - If the product is already in the cart, increases its quantity.
   * - If the product is not in the cart, clones it, removes unnecessary buttons,
   *   and formats it into a cart item.
   * - Updates the local storage after any change.
   */
  $(document).on("click", ".add-to-cart", function () {
    // Find the closest product card to get the product details
    let productCard = $(this).closest(".product-card");
    let productId = productCard.data("id");

    // Check if the product is already in the cart
    let addedProduct = $("#cart").find(`.cart-item[data-id=${productId}]`);

    if (addedProduct.length > 0) {
      // If the product is already in the cart, increase its quantity
      let productQuantity = addedProduct.find(".quantity");
      let updatedQuantity = parseInt(productQuantity.text());
      productQuantity.text(updatedQuantity + 1);
    } else {
      // If the product is not in the cart, clone it and add necessary modifications
      let clonedProduct = productCard.clone(true);
      clonedProduct.addClass("cart-item").attr("data-id", productId);

      // Remove unnecessary buttons (e.g., add to cart & favorite)
      clonedProduct.find(".add-to-cart").remove();
      clonedProduct.find(".favorite-btn").remove();

      // Replace the cloned product's inner HTML with a new cart item structure
      clonedProduct.html(`
        <img src="${productCard.find("img").attr("src")}" alt="">
        <div class="cart-item-info">
          <h4>${productCard.find("h3").text()}</h4>
          <p>${productCard.find("p").text()}</p>
        </div>
        <div class="cart-actions">
          <div class="quantity-controls">
            <button class="decrease"><i class="fa-solid fa-minus"></i></button>
            <span class="quantity">1</span>
            <button class="increase"><i class="fa-solid fa-plus"></i></button>
          </div>
          <button class="removeFromCartBtn"><i class="fa-solid fa-trash"></i></button>
        </div>
  `);
      $("#cart").append(clonedProduct);
    }
    // Update local storage after modifying the cart
    updateLocalStorage();
  });

  /**
   * Adds a product to the cart and displays a notification.
   */
  $(document).on("click", ".add-to-cart", function () {
    $("#notification").remove();

    let notification = `
      <div id="notification">
        <span class="icon">✔️</span>
        <span class="message">Product added to the chart</span>
      </div>
  `;

    $("body").append(notification);

    $("#notification")
      .fadeIn(300)
      .delay(2000)
      .fadeOut(300, function () {
        $(this).remove();
      });
  });

  /**
   * Adds a subtle shake effect to the clicked button.
   */
  $(document).on("click", ".add-to-cart", function () {
    let button = $(this);

    button
      .animate(
        {
          marginLeft: "5px",
        },
        100
      )
      .animate(
        {
          marginLeft: "-5px",
        },
        100
      )
      .animate(
        {
          marginLeft: "0px",
        },
        100
      );
  });

  /**
   * Initializes hover effects for the cart icon.
   * - Changes the color of the icon and text when hovered.
   * - Restores the original color when the mouse leaves.
   */
  function initializeCartIconHoverEffect() {
    $(".cart-icon").hover(
      function () {
        // Change the color of the icon and text when hovered
        $(this).children("i, span").css("color", "#f4a51c");
      },
      function () {
        // Reset the color when the mouse leaves
        $(this).children("i, span").css("color", "");
      }
    );
  }

  initializeCartIconHoverEffect();

  /**
   * Initializes the hover effect for the cart icon and cart dropdown.
   * - Shows the cart when the cart icon is hovered and it contains items.
   * - Hides the cart with a slight delay when the mouse leaves.
   */
  function initializeCartEffect() {
    $(".cart-icon, #cart")
      .mouseenter(function () {
        // Show the cart only if it has items
        if ($("#cart").children().length > 0) {
          $("#cart").show();
        }
      })
      .mouseleave(function () {
        cartTimeout = setTimeout(function () {
          if (!$("#cart").is(":hover") && !$(".cart-icon").is(":hover")) {
            $("#cart").hide();
          }
        }, 300);
      });
  }

  initializeCartEffect();

  /**
   * Increases the quantity of a product in the cart.
   * - Finds the closest quantity element and increments its value.
   * - Updates local storage after quantity change.
   */
  $(document).on("click", ".increase", function () {
    let quantityElement = $(this).siblings(".quantity");
    quantityElement.text(parseInt(quantityElement.text()) + 1);
    updateLocalStorage();
  });

  /**
   * Decreases the quantity of a product in the cart.
   * - Decreases the quantity if it's greater than 1.
   * - If the quantity reaches 0, removes the item from the cart.
   * - Updates local storage after quantity change.
   */
  $(document).on("click", ".decrease", function () {
    let quantityElement = $(this).siblings(".quantity");
    let quantity = parseInt(quantityElement.text());

    if (quantity > 1) {
      quantityElement.text(quantity - 1);
    } else {
      $(this).closest(".cart-item").remove();
    }
    updateLocalStorage();
  });

  /**
   * Removes a product from the cart when the remove button is clicked.
   * - Removes the closest cart item.
   * - Checks if the cart is empty and hides it after a short delay.
   * - Updates local storage after removal.
   */
  $(document).on("click", ".removeFromCartBtn", function (event) {
    $(this).closest(".cart-item").remove();
    setTimeout(function () {
      if ($("#cart").children().length === 0) {
        $("#cart").hide();
      }
    }, 50);
    updateLocalStorage();
  });

  /**
   * Updates the localStorage with the current cart content.
   * If the cart has items, it saves the HTML structure.
   * If the cart is empty, it removes the saved cart data.
   */
  function updateLocalStorage() {
    if ($("#cart").children().length > 0) {
      localStorage.setItem("sepet", $("#cart").html());
    } else {
      localStorage.removeItem("sepet");
    }
  }

  $("body").append(`
    <div id="favorites-modal" class="fav-modal" style="display: none;">
      <div class="fav-modal-overlay"></div>
      <div class="fav-modal-content">
        <h2>Favourite Products</h2>
        <div class="favorites-list"></div> <!-- Dinamik olarak doldurulacak -->
        <button id="close-favorites">Close</button>
      </div>
    </div>
  `);
});

/**
 * Retrieves favorite products from localStorage.
 * If no favorites exist, returns an empty array.
 * @returns {Array} List of favorite products.
 */
function getFavorites() {
  let favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : [];
}

/**
 * Saves the given favorite products list to localStorage.
 * @param {Array} favorites - List of favorite products to be saved.
 */
function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

/**
 * Initializes favorite products on page load.
 * Checks all product cards and updates their heart icons
 * based on whether they are in the favorites list.
 */
let favorites = getFavorites();

$(".product-card").each(function () {
  let productId = $(this).data("id");
  let heartIcon = $(this).find(".favorite-btn .heart-icon");

  if (favorites.find((p) => p.id == productId)) {
    heartIcon.addClass("fas").removeClass("far");
  } else {
    heartIcon.removeClass("fas").addClass("far");
  }
});

/**
 * Handles adding/removing products from favorites when the heart button is clicked.
 * Updates the heart icon accordingly and saves changes to localStorage.
 */
$(document).on("click", ".favorite-btn", function () {
  let productCard = $(this).closest(".product-card");
  let productId = productCard.data("id");
  let productTitle = productCard.find(".product-title").text();
  let productImage = productCard.find("img").attr("src");
  let productPrice = productCard.find(".product-price").text();

  let favorites = getFavorites();
  let index = favorites.findIndex((p) => p.id == productId);

  if (index === -1) {
    favorites.push({
      id: productId,
      title: productTitle,
      image: productImage,
      price: productPrice,
    });
    $(this).find(".heart-icon").addClass("fas").removeClass("far"); // Favoriye ekle
  } else {
    favorites.splice(index, 1); // Favoriden çıkar
    $(this).find(".heart-icon").removeClass("fas").addClass("far"); // Favoriden çıkar
  }

  saveFavorites(favorites);
});

/**
 * Opens the favorites modal and displays the favorite products.
 * If no favorites exist, shows a message.
 */
$(document).on("click", ".fav-icon", function (e) {
  e.preventDefault();
  let favorites = getFavorites();
  let favoritesHtml = "";

  if (favorites.length === 0) {
    favoritesHtml = "<p>No favourite products added.</p>";
  } else {
    favorites.forEach((product) => {
      favoritesHtml += `
        <div class="favorite-item" data-id="${product.id}">
          <img src="${product.image}" alt="${product.title}" width="50">
          <span>${product.title}</span>
          <span>${product.price}</span>
          <button class="remove-favorite"><i class="fas fa-trash"></i></button>
        </div>
      `;
    });
  }

  $(".favorites-list").html(favoritesHtml);
  $("#favorites-modal").fadeIn();
});

/**
 * Closes the favorites modal when the close button or overlay is clicked.
 */
$(document).on("click", "#close-favorites, .fav-modal-overlay", function () {
  $("#favorites-modal").fadeOut();
});

/**
 * Removes a product from the favorites list when the trash icon is clicked.
 * Updates localStorage and removes the item from the DOM.
 */
$(document).on("click", ".remove-favorite", function () {
  let productId = $(this).closest(".favorite-item").data("id");
  let favorites = getFavorites();
  favorites = favorites.filter((product) => product.id != productId);
  saveFavorites(favorites);
  $(this).closest(".favorite-item").remove();
});
