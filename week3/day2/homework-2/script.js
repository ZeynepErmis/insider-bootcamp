let start = 0; // Start index for pagination
const limit = 7; // Number of posts to load per request
let isLoading = false; // Flag to track whether a request is in progress

$(document).ready(function () {
  loadPosts();
  $(window).on("scroll", debounce(handleScroll, 200)); // Set up scroll event listener with debounce
});

// Function to handle scroll events
function handleScroll() {
  if (isLoading) return; // Prevent multiple requests if one is already in progress
  const scrollPosition = $(window).scrollTop() + $(window).height();
  const pageHeight = $(document).height();
  if (scrollPosition >= pageHeight - 100) {
    loadPosts();
  }
}

// Function to load posts from the API
function loadPosts() {
  if (isLoading) return;
  isLoading = true;
  $("#loading").show();

  $.get({
    url: `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`, // API endpoint with pagination
    method: "GET",
    dataType: "json",
  })
    .done(function (data) {
      if (data.length === 0) {
        // If no posts are returned, disable further scroll loading
        $(window).off("scroll");
        $("#loading").text("No more posts.");
        return;
      }
      renderPosts(data);
      start += limit; // Update the start index for the next batch of posts
    })
    .fail(function () {
      alert("An error occurred while loading, please try again.");
    })
    .always(function () {
      isLoading = false; // Reset loading flag
      $("#loading").hide();
    });
}

// Function to render posts into the DOM
function renderPosts(posts) {
  const container = $("#postContainer");
  posts.forEach((post) => {
    container.append(`
            <div class="post">
                <h3>${post.title}</h3>
                <p><strong>ID:</strong> ${post.id}</p>
                <p><strong>User ID:</strong> ${post.userId}</p>
                <p>${post.body}</p>
            </div>
        `);
  });
}

// Debounce function to limit the frequency of function calls
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
