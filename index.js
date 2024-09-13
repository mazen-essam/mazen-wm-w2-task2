const taskInput = document.getElementById("taskInput");
const startDateInput = document.getElementById("startDateInput");
const endDateInput = document.getElementById("endDateInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const notification = document.getElementById("notification");

// Load tasks from localStorage 
document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

addTaskButton.addEventListener("click", addTask);

// Function to add a new task
function addTask() {
  const taskText = taskInput.value.trim();
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (taskText === "" || startDate === "" || endDate === "") {
    showNotification("Please fill all the fields.", "red");
    return;
  }

  // Create new task
  const taskItem = createTaskElement(taskText, startDate, endDate);

  // Append to list and localStorage
  taskList.appendChild(taskItem);
  saveTaskToLocalStorage(taskText, startDate, endDate);

  // Show success message
  showNotification("Task added successfully!", "green");

  // Clear input fields
  taskInput.value = "";
  startDateInput.value = "";
  endDateInput.value = "";
}

// Function to create a task element with start and end dates
function createTaskElement(taskText, startDate, endDate) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span>${taskText}</span>
    <span class="dates">Start: ${startDate} --- End: ${endDate}</span>
    <div>
      <button class="edit">Edit</button>
      <button class="remove">Remove</button>
    </div>
  `;

  // Add event listeners for edit, remove, and complete
  li.querySelector(".edit").addEventListener("click", () =>
    editTask(li, taskText, startDate, endDate)
  );
  li.querySelector(".remove").addEventListener("click", () =>
    removeTask(li, taskText)
  );
  li.addEventListener("click", () => toggleCompleteTask(li));

  return li;
}

// Toggle task completion
function toggleCompleteTask(taskItem) {
  taskItem.classList.toggle("completed");
}

// Edit an existing task
function editTask(taskItem, oldTaskText, oldStartDate, oldEndDate) {
  const newTaskText = prompt("Edit your task:", oldTaskText);
  const newStartDate = prompt("Edit start date (YYYY-MM-DD):", oldStartDate);
  const newEndDate = prompt("Edit end date (YYYY-MM-DD):", oldEndDate);

  if (newTaskText && newStartDate && newEndDate) {
    taskItem.querySelector("span").textContent = newTaskText.trim();
    taskItem.querySelector(
      ".dates"
    ).textContent = `Start: ${newStartDate} | End: ${newEndDate}`;
    updateTaskInLocalStorage(
      oldTaskText,
      newTaskText,
      newStartDate,
      newEndDate
    );
    showNotification("Task edited successfully!", "green");
  }
}

// Remove task
function removeTask(taskItem, taskText) {
  taskItem.remove();
  removeTaskFromLocalStorage(taskText);
  showNotification("Task removed successfully!", "red");
}

// Notification system
function showNotification(message, color) {
  notification.style.color = color;
  notification.textContent = message;
  notification.style.visibility = "visible";
  setTimeout(() => {
    notification.style.visibility = "hidden";
  }, 2000);
}

// Local Storage Functions
function saveTaskToLocalStorage(taskText, startDate, endDate) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ taskText, startDate, endDate });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(({ taskText, startDate, endDate }) => {
    const taskItem = createTaskElement(taskText, startDate, endDate);
    taskList.appendChild(taskItem);
  });
}

function removeTaskFromLocalStorage(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.taskText !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskInLocalStorage(
  oldTaskText,
  newTaskText,
  newStartDate,
  newEndDate
) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskIndex = tasks.findIndex((task) => task.taskText === oldTaskText);
  if (taskIndex > -1) {
    tasks[taskIndex] = {
      taskText: newTaskText,
      startDate: newStartDate,
      endDate: newEndDate,
    };
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
