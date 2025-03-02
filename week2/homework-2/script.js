// Get references to necessary HTML elements
const addTaskButton = document.getElementById("add-task-button");
const taskInput = document.getElementById("task-input");
const taskDescription = document.getElementById("task-description");
const taskList = document.getElementById("task-list");
const taskContent = document.querySelector(".task-content");
const taskDetails = document.getElementById("task-details");
const taskDetailInfo = document.getElementById("task-detail-info");
const showCompletedButton = document.getElementById("show-completed");
const dueDate = document.getElementById("task-due-date");
let taskIdCounter = 0; // Counter to generate unique task IDs

// Event listener for adding a new task
addTaskButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent form from submitting normally

  // Get input values from form
  const taskValue = taskInput.value.trim();
  const descriptionValue = taskDescription.value.trim();
  const selectedPriority = document.querySelector(
    'input[name="task-priority"]:checked'
  );
  const dueDateValue = dueDate.value.trim();

  try {
    // Ensure all required fields are filled
    if (!taskValue || !descriptionValue || !selectedPriority || !dueDateValue) {
      throw new Error("Please fill out all form elements");
    }

    const createElement = createTaskElement(
      taskValue,
      descriptionValue,
      selectedPriority,
      dueDateValue
    );
    taskList.appendChild(createElement);

    // Clear input fields after adding task
    taskInput.value = null;
    taskDescription.value = null;
    selectedPriority.checked = false;
    dueDate.value = null;
  } catch (error) {
    console.error("An error occurred:", error.message);
    alert(error.message); // Show error message to user
  }
});

// Event listener for handling task actions (complete, delete, view details)
taskList.addEventListener("click", function (event) {
  const target = event.target;

  // Mark task as completed
  if (target.classList.contains("fa-check")) {
    const taskItem = target.closest("li");
    target.classList.toggle("completed");
    taskItem.classList.toggle("complete");
  }

  // Delete task from the list
  if (target.classList.contains("fa-trash")) {
    const taskItem = target.closest("li");
    const taskId = taskItem.id;

    // Hide task details if the deleted task is currently displayed
    if (
      taskDetailInfo.querySelector("h1") &&
      taskDetailInfo.querySelector("h1").dataset.taskId === taskId
    ) {
      taskDetails.style.display = "none";
      taskContent.style.display = "block";
    }

    taskItem.remove(); // Remove task from DOM
  }

  // Show task details when clicking on a task
  if (target.tagName === "LI") {
    const selectedTask = target;
    const description = selectedTask.getAttribute("data-description");
    const priority = selectedTask.getAttribute("data-priority");
    const dueDate = selectedTask.getAttribute("data-due-date");

    // Hide task input form and show task details
    taskContent.style.display = "none";
    taskDetails.style.display = "block";

    // Populate task details section
    taskDetailInfo.innerHTML = `
      <h1 data-task-id="${selectedTask.id}">${selectedTask.textContent}</h1>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Due Date:</strong> ${dueDate}</p>
      <p><strong>Priority:</strong> ${priority}</p>
    `;
  }
});

function createTaskElement(
  taskValue,
  descriptionValue,
  selectedPriority,
  dueDateValue
) {
  // Create a new task list item
  const li = document.createElement("li");
  const taskId = `task-${taskIdCounter++}`; // Assign a unique task ID
  li.id = taskId;
  li.textContent = taskValue;

  const completeButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  // Add classes for styling icons
  completeButton.classList.add("fa-solid", "fa-check");
  deleteButton.classList.add("fa-solid", "fa-trash");

  // Store task details as attributes
  li.setAttribute("data-description", descriptionValue);
  li.setAttribute("data-priority", selectedPriority.value);
  li.setAttribute("data-due-date", dueDateValue);

  // Append buttons to the task list item
  li.appendChild(completeButton);
  li.appendChild(deleteButton);

  // Add task to the task list
  return li;
}

// Event listener for navigating back to the task list
document
  .getElementById("back-to-task-list")
  .addEventListener("click", function () {
    taskContent.style.display = "block";
    taskDetails.style.display = "none";
  });

let showCompletedOnly = false; // This controls whether to show only completed tasks or not

// Function to be executed when the button is clicked
showCompletedButton.addEventListener("click", function () {
  const tasks = document.querySelectorAll("#task-list li");
  if (showCompletedOnly) {
    // If we're currently showing only completed tasks, show all tasks again
    tasks.forEach((task) => {
      task.style.display = "block"; // Show all tasks
    });

    // Change the button text
    showCompletedButton.textContent = "Show Only Completed";
  } else {
    // If we're going to show only completed tasks, hide incomplete ones
    tasks.forEach((task) => {
      if (task.classList.contains("complete")) {
        task.style.display = "block"; // Show completed tasks
      } else {
        task.style.display = "none"; // Hide incomplete tasks
      }
    });

    // Change the button text
    showCompletedButton.textContent = "Show All Tasks";
  }

  // Toggle the value of showCompletedOnly
  showCompletedOnly = !showCompletedOnly;
});
