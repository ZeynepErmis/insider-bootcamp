// Get user information
const user = {
    name: prompt("What is your name?"),
    age: parseInt(prompt("How old are you?")),
    job: prompt("What is your profession?")
};

console.log("User Information:", user);

// Define an empty array for the cart
let cart = [];

// Function to add a product
function addProduct() {
    let name = prompt("Product name:");
    let price = parseFloat(prompt("Product price:"));
    if (!isNaN(price) && name) {
        cart.push({ name, price });
        console.log(`'${name}' added to the cart.`);
    } else {
        console.log("Invalid input. Please try again.");
    }
}

// Function to list cart items
function listCart() {
    console.log("Your Cart:");
    cart.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} - ${item.price} USD`);
    });
}

// Function to calculate total price
function calculateTotal() {
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    console.log(`Total Price: ${total.toFixed(2)} USD`);
}

// Function to remove a product
function removeProduct() {
    listCart();
    let index = parseInt(prompt("Enter the number of the product you want to remove:")) - 1;
    if (index >= 0 && index < cart.length) {
        let removed = cart.splice(index, 1);
        console.log(`'${removed[0].name}' removed from the cart.`);
    } else {
        console.log("Invalid number.");
    }
}

// Loop to allow the user to manage the cart
let adding = true;
while (adding) {
    let action = prompt("Enter 'a' to add a product, 'r' to remove a product, 't' to view total price, or 'q' to quit.");
    if (action === 'a') {
        addProduct();
    } else if (action === 'r') {
        removeProduct();
    } else if (action === 't') {
        calculateTotal();
    } else if (action === 'q') {
        console.log("Exited.");
        break;
    } else {
        console.log("Invalid input. Please try again.");
    }
}