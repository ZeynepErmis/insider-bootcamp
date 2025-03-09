$(document).ready(function () {
  let debounceTimeout;

  Fancybox.bind("[data-fancybox]", {
    compact: false,
    dragToClose: true,
    showClass: "fancybox-fadeIn",
    hideClass: "fancybox-fadeOut",
    infinite: true,
  });

  $("#search-input").on("input", function () {
    let query = $(this).val().trim();

    clearTimeout(debounceTimeout); 

    debounceTimeout = setTimeout(function () {
      searchProducts(query);
    }, 300);
  });
  $("#search-input").on("focus", function () {
    let query = $(this).val().trim();
    if (query.length > 0) {
      searchProducts(query);
    }
  });

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

  function displayResults(products) {
    let resultList = $("#search-results");
    resultList.empty();

    if (products.length === 0) {
      resultList.hide();
      return;
    }

    products.forEach((product) => {
      resultList.append(
        `<li data-fancybox data-src="#modal-${product.id}" data-id="${product.id}">${product.title}</li>`
      );
    });

    resultList.show();
  }

  $(document).on("click", function (e) {
    if (!$(e.target).closest(".search-bar").length) {
      $("#search-results").hide();
    }
  });

  function fetchProducts() {
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
        console.log(
          "An error occurred while loading, please try again:",
          error
        );
      });
  }

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

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

  function renderProducts(products) {
    $("#productList").empty();

    products.forEach((product) => {
      let starHtml = renderStars(product.rating.rate);

      let productCard = `
      <div class="product-card" data-id="${product.id}">
        <a data-fancybox data-src="#modal-${product.id}" href="javascript:;">
          <img src="${product.image}" alt="${product.title}">
        </a>
        <h3>${product.title}</h3>
        <div class="rating">
          <span class="rating-score">${product.rating.rate}</span>
          <div class="stars">${starHtml}</div>
          <span class="rating-count">(${product.rating.count})</span>
        </div>
        <p>${product.price} $</p>
        <div class="product-actions">
          <button class="add-to-cart">Add to cart</button>
          <button class="favorite-btn">
            <i class="fa-regular fa-heart heart-icon"></i>
          </button>
        </div>
      </div>
  
      <!-- Modal İçeriği -->
      <div id="modal-${product.id}" class="modal-content" style="display: none;">
        <h2>${product.title}</h2>
        <img src="${product.image}" alt="${product.title}" style="width: 20%; height: auto;">
        <p><strong>Description:</strong> ${product.description}</p>
        <p><strong>Price:</strong> ${product.price} $</p>
        <div class="rating">
          <span class="rating-score">${product.rating.rate}</span>
          <div class="stars">${starHtml}</div>
          <span class="rating-count">(${product.rating.count})</span>
        </div>
      </div>
      `;

      $("#productList").append(productCard);
    });
  }

  function updateLocalStorage() {
    if ($("#cart").children().length > 0) {
      localStorage.setItem("sepet", $("#cart").html());
    } else {
      localStorage.removeItem("sepet");
    }
  }

  $(document).on("click", ".add-to-cart", function () {
    let productCard = $(this).closest(".product-card"); 
    let productId = productCard.data("id"); 

    let addedProduct = $("#cart").find(`.cart-item[data-id=${productId}]`);

    if (addedProduct.length > 0) {
      let productQuantity = addedProduct.find(".quantity");
      let updatedQuantity = parseInt(productQuantity.text());
      productQuantity.text(updatedQuantity + 1);
    } else {
      let clonedProduct = productCard.clone(true);
      clonedProduct.addClass("cart-item").attr("data-id", productId);
      clonedProduct.find(".add-to-cart").remove();
      clonedProduct.find(".favorite-btn").remove(); 

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

    updateLocalStorage();
  });

  $(document).on("click", ".increase", function () {
    let quantityElement = $(this).siblings(".quantity");
    quantityElement.text(parseInt(quantityElement.text()) + 1);
    updateLocalStorage();
  });

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

  $(".cart-icon, #cart")
    .mouseenter(function () {
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

  $(document).on("click", ".removeFromCartBtn", function (event) {
    $(this).closest(".cart-item").remove();
    setTimeout(function () {
      if ($("#cart").children().length === 0) {
        $("#cart").hide(); 
      }
    }, 50);
    updateLocalStorage();
  });

  $(".cart-icon").hover(
    function () {
      $(this).children("i, span").css("color", "#f4a51c"); 
    },
    function () {
      $(this).children("i, span").css("color", ""); 
    }
  );
  if (localStorage.getItem("sepet")) {
    $("#cart").html(localStorage.getItem("sepet"));
  }

  fetchProducts();
});

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

  sliderContainer.slick({
    arrows: true,
    infinite: true, 
    speed: 500, 
    slidesToShow: 4, 
    slidesToScroll: 1, 
    autoplay: true, 
    autoplaySpeed: 3000, 
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });
}
