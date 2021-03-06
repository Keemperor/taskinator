var formEl = document.querySelector("#task-form");
var taskToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];


var taskFormHandler = function(event){
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  if (!taskNameInput || !taskTypeInput){
    alert("You need to fill out the task form!");
    return false;
  }

  formEl.reset();
  
  var isEdit = formEl.hasAttribute("data-task-id");
  // has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  // no data attribute, so create object as normal and pass to createTaskEl function 
  else {
      //package up data as an object
  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput,
    status: "to do"
  };

  // send it as an argument to createTaskEl
  createTaskEl(taskDataObj);
};

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
   taskDataObj.id = taskIdCounter;
   tasks.push(taskDataObj);
   taskIdCounter++;

   saveTasks();
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

   // create a new array to hold updated list of tasks
   var updatedTaskArr = [];

   // loop through current taks
   for (var i = 0; i <tasks.length; i++) {
     // if tasks[i].id doesn't match the value of taskID, let's keep that task and push it into the new array
    if (tasks [i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }

    saveTasks();
  };

  // // reassign tasks array to be the same as updatedTaskArr
  tasks = updatedTaskArr;
 };

 var completeEditTask = function(taskName, taskType, taskId) {
  // find the matching task line item
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  //set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  for (var i = 0; i <tasks.length; i++) {
    if (tasks [i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  };



  alert("Task Updated!");

  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";

  saveTasks();
 };

var taskStatusChangeHandler = function(event) {
 // get the task item's id
 var taskId = event.target.getAttribute("data-task-id");

 //// get the currently selected options value and convert to lowercase
 var statusValue = event.target.value.toLowerCase();

 // find the parent task item element bbased on id
 var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

 if (statusValue === "to do") {
   taskToDoEl.appendChild(taskSelected);
 }
 else if (statusValue === "in progress") {
   tasksInProgressEl.appendChild(taskSelected);
 }
 else if (statusValue === "completed") {
   tasksCompletedEl.appendChild(taskSelected);
 }

 // update tasks's in tasks array
 for (var i = 0; i <tasks.length; i++) {
  if (tasks [i].id === parseInt(taskId)) {
    tasks[i].status = statusValue;
  }
}; 

saveTasks();
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function() {
  // 1.Gets task items from localStorage.
  var getTasks = localStorage.getItem("tasks");
  
 if (getTasks=== null) {
   alert("no data available");
 } 
 console.log ("Saved tasks found")
  // 2. Converts tasks from the string format back into an array of objects.
 getTasks = JSON.parse(getTasks);
console.log(tasks);
  // 3. Iterates through a tasks array and creates task elements on the page from it.
  for (var i = 0; i <getTasks.length; i++) {
    createTaskEl(getTasks[i]);
  }


};
 

console.log(loadTasks());

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();