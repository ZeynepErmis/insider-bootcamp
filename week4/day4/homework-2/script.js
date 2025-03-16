const appendLocation = ".ins-api-users";
const API_URL = "https://jsonplaceholder.typicode.com/users";
const STORAGE_KEY = "users";
const sessionStorageKey = "reload_button_used";
const ONE_DAY = 24 * 60 * 60 * 1000;

// jQuery import
if (typeof jQuery === "undefined") {
  const script = document.createElement("script");
  script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
  script.onload = () => init();
  document.head.appendChild(script);
} else {
  init();
}

function init() {
  $(document).ready(() => {
    applyStyles();
    const container = $(appendLocation);

    container.on("click", ".delete-btn", function () {
      const id = $(this).closest("li").data("id");
      deleteUser(id);
    });

    container.on("click", ".reload-btn", function () {
      if (sessionStorage.getItem(sessionStorageKey) === "true") {
        alert("You can only refresh users once in this session.");
        return;
      }
      sessionStorage.setItem(sessionStorageKey, "true");
      localStorage.removeItem(STORAGE_KEY);
      fetchUsers().then((users) => renderUsers(users));
    });

    checkAndLoadUsers();
  });
}

function checkAndLoadUsers() {
  const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  const { data: users, time } = storedData;
  const currentTime = Date.now();

  if (
    users &&
    Array.isArray(users) &&
    users.length &&
    time &&
    currentTime - time < ONE_DAY
  ) {
    renderUsers(users);
  } else {
    fetchUsers().then((users) => renderUsers(users));
  }
}

function applyStyles() {
  $("<style>")
    .text(
      `
      ${appendLocation} {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 20px auto;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
          background: #f9f9f9;
          text-align: center;
      }
      ul {
          list-style-type: none;
          padding: 0;
      }
      li {
          padding: 10px;
          border-bottom: 1px solid #ddd;
      }
      .delete-btn, .reload-btn {
          background-color: black;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          margin-top: 5px;
      }
      .delete-btn:hover {
          background-color: darkred;
      }
      .reload-btn {
          background-color: #4CAF50;
          display: block;
          margin: 20px auto;
      }
      `
    )
    .appendTo("head");
}

function fetchUsers() {
  return new Promise((resolve, reject) => {
    $.get(API_URL)
      .done((data) => {
        if (data && data.length > 0) {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ data, time: Date.now() })
          );
          resolve(data);
        } else {
          reject(new Error("Empty response"));
        }
      })
      .fail((error) => {
        console.error("API error", error);
        reject(new Error("Could not get data from API"));
      });
  });
}

function renderUsers(users) {
  const container = $(appendLocation);
  container.empty();

  if (!users || users.length === 0) {
    showReloadButton();
    return;
  }

  let userListHtml = '<ul class="user-list">';
  users.forEach((user) => {
    userListHtml += `
      <li class="user-item" data-id="${user.id}">
        <strong>${user.name}</strong> - ${user.email}
        <button class="delete-btn">Delete</button>
      </li>
    `;
  });
  userListHtml += "</ul>";
  container.html(userListHtml);

  observeUserList();
}

function deleteUser(id) {
  let users = JSON.parse(localStorage.getItem(STORAGE_KEY))?.data || [];
  users = users.filter((user) => user.id !== id);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ data: users, time: Date.now() })
  );
  renderUsers(users);
}

function showReloadButton() {
  if ($(`${appendLocation} .reload-btn`).length === 0) {
    $(appendLocation).html('<button class="reload-btn">Reload Users</button>');
  }
}

function observeUserList() {
  const container = document.querySelector(appendLocation);
  if (!container) return;

  const observer = new MutationObserver(() => {
    if ($(appendLocation).find("li").length === 0) {
      showReloadButton();
    }
  });

  observer.observe(container, { childList: true, subtree: true });
}
