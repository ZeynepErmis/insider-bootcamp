$(document).ready(() => {
  const userList = $("#user-list");
  const API_URL = "https://jsonplaceholder.typicode.com/users";
  const STORAGE_KEY = "users";
  const EXPIRATION_KEY = "users_expiration";
  const ONE_DAY = 24 * 60 * 60 * 1000;

  function applyStyles() {
    $("<style>")
      .text(
        `
            .ins-api-users {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 20px auto;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
                background: #f9f9f9;
            }
            ul {
                list-style-type: none;
                padding: 0;
            }
            li {
                padding: 10px;
                border-bottom: 1px solid #ddd;
            }
            button {
                background-color: red;
                color: white;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                margin-top: 5px;
            }
            button:hover {
                background-color: darkred;
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
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            localStorage.setItem(EXPIRATION_KEY, Date.now() + ONE_DAY);
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
    const userList = $("#user-list");
    userList.empty(); 

    if (users.length === 0) {
      userList.html("<li>No existing user.</li>");
    } else {
      users.forEach((user) => {
        userList.append(`
          <li>
            <strong>${user.name}</strong> - ${user.email}
            <button class="delete-btn" data-id="${user.id}">Delete</button>
          </li>
        `);
      });
    }
  }

  function deleteUser(id) {
    let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    users = users.filter((user) => user.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    renderUsers(users);
  }

  userList.on("click", ".delete-btn", function () {
    const id = $(this).data("id");
    deleteUser(id);
  });

  const storedUsers = localStorage.getItem(STORAGE_KEY);
  const expiration = localStorage.getItem(EXPIRATION_KEY);

  applyStyles();

  if (storedUsers && expiration && Date.now() < expiration) {
    renderUsers(JSON.parse(storedUsers));
  } else {
    fetchUsers()
      .then((users) => renderUsers(users))
      .catch((error) => {
        userList.html(`<li>Hata: ${error.message}</li>`);
      });
  }
});
