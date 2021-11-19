var formEl = document.querySelector("#task-form");
var taskToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content")

var taskFormHandler = function(event){
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  if (!taskNameInput || !taskTypeInput){
    alert("You need to fill out the task form!");
    return false;
  }

  formEl.reset();

  //package up data as an object
  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput
  };

  // send it as an argument to createTaskEl
  createTaskEl(taskDataObj);
};

var createTaskEl = function(taskDataObj) {
  
  // create lis items ("li")
   var listItemEl = document.createElement("li");
   listItemEl.className = "task-item";
   listItemEl.setAttribute("data-task-id", taskIdCounter);
   
   // create div to hold task info and add to list item
   var taskInfoEl = document.createElement("div");
  
   // give it a class name
   taskInfoEl.className = "task-info";
  
   // add HTML content to div
   taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
   listItemEl.appendChild(taskInfoEl);
   var taskActionsEl = createTaskActions(taskIdCounter);
   listItemEl.appendChild(taskActionsEl);
   taskToDoEl.appendChild(listItemEl);
   taskIdCounter++;
};

var createTaskActions = function(taskId) {
  var actionCointainerEl = document.createElement("div");
  actionCointainerEl.className = "task-action";

  // create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);
  actionCointainerEl.appendChild(editButtonEl);

  // create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);
  actionCointainerEl.appendChild(deleteButtonEl);

  // create drop down menu
  var statusSelectEl = document.createElement("select");
  statusSelectEl.textContent = "select";
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("data-task-id", taskId);
  actionCointainerEl.appendChild(statusSelectEl);

  // create select options
  var statusChoices = ["To Do", "In Progress", "Completed"];
  for (var i = 0; i < statusChoices.length; i++) {
    
    // create option elements
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);

    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }
  return actionCointainerEl;
};

var taskButtonHandler = function(event) {
  // get target element from event
  var targetEl = event.target;

  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    // get elemt's task id
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }

  else if (targetEl.matches(".delete-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
  
};

var editTask = function(taskId) {
  console.log("editing task#" + taskId);

  // get task list element
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  document.querySelector("input[name='task-name']").value = taskName;

  var taskType = taskSelected.querySelector("span.task-type").textContent;
  document.querySelector("select[name='task-type']").value = taskType;

  document.querySelector("#save-task").textContent = "Save Task";

  formEl.setAttribute("data-task-id", taskId);
};

var deleteTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
   taskSelected.remove();
 };

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);