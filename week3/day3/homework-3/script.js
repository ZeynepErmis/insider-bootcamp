$(document).ready(function () {
  // When the "Load Random Users" button is clicked
  $("#load-users").click(function () {
    let button = $(this);

    // Apply a bounce effect before fetching user data
    button.effect("bounce", { times: 5, distance: 20 }, 700, function () {
      fetchUsers(8);
    });
  });
});

// Apply hover effect when the mouse enters a user card
$(document).on("mouseenter", ".user-card", function () {
  $(this).fadeTo(200, 0.8).css({
    "box-shadow": "0px 15px 30px rgba(0, 123, 255, 0.1)",
    border: "2px solid #007bff",
  });
});

// Remove hover effect when the mouse leaves a user card
$(document).on("mouseleave", ".user-card", function () {
  $(this).fadeTo(200, 1).css({
    "box-shadow": "0px 5px 15px rgba(0, 0, 0, 0.1)",
    border: "none",
  });
});

// Function to fetch random users from the API
function fetchUsers(count) {
  $.get({
    url: `https://randomuser.me/api/?results=${count}`,
    method: "GET",
    dataType: "json",
  })
    .done(function (data) {
      // Render user profiles and then initialize the slider
      renderUsers(data.results, function () {
        renderSlider(data.results);
      });
    })
    .fail(function () {
      alert("An error occurred while loading, please try again.");
    });
}

// Function to render user profiles in the container
function renderUsers(users, callback) {
  $("#users-container").empty(); // Clear previous users

  let animatedCards = 0;
  const totalCards = users.length;

  users.forEach((user, index) => {
    let userCard = `
      <a href="#user-modal-${index}" data-fancybox="users" class="user-card" style="opacity: 0; position: relative;">
        <img src="${user.picture.medium}" alt="Profile Picture">
        <h3 class="user-name">${user.name.first} ${user.name.last}</h3>
        <p class="user-email">Email: ${user.email}</p>
        <p class="user-country">Country: ${user.location.country}</p>
      </a>

      <!-- Modal Content -->
      <div style="display: none;" id="user-modal-${index}" class="user-modal">
        <h2>${user.name.first} ${user.name.last}</h2>
        <img src="${user.picture.large}" alt="Profile Picture">
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Address:</strong> ${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.country}</p>
        <p><strong>Age:</strong> ${user.dob.age}</p>
      </div>
    `;

    $("#users-container").append(userCard);
    let newCard = $(".user-card").last();

    // Apply animation effect to newly added cards
    newCard
      .delay(index * 200) // Staggered animation
      .slideDown(400)
      .animate(
        { opacity: 1, top: "-10px" },
        {
          duration: 500,
          easing: "swing",
          complete: function () {
            animatedCards++;
            if (animatedCards === totalCards) {
              // Call the callback function after all animations finish
              if (callback) callback();
            }
          },
        }
      );
  });
}

// Function to initialize and update the Slick slider
function renderSlider(users) {
  // If the slider is already initialized, destroy it before reinitializing
  if ($(".slider").hasClass("slick-initialized")) {
    $(".slider").slick("unslick");
  }

  users.forEach((user) => {
    let slideItem = `
      <div class="slider-item">
        <h2>Random Users Slider</h2>
        <img src="${user.picture.large}" alt="${user.name.first}">
        <h3>${user.name.first} ${user.name.last}</h3>
        <p>${user.email}</p>
      </div>
    `;
    $(".slider").append(slideItem);
  });

  // Initialize the Slick slider with custom settings
  $(".slider").slick({
    infinite: true, // Infinite looping
    speed: 500, // Transition speed
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2000, // Change slides every 2 seconds
    arrows: false, // Hide navigation arrows
    dots: true, // Show navigation dots
  });
}
