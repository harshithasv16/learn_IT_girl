//<script src="https://www.gstatic.com/firebasejs/4.9.0/firebase.js"></script>
//<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyANa1FgbLi9UIEPAkMy4_zb2S5iPT25vSU",
    authDomain: "todo-listjs-431b6.firebaseapp.com",
    databaseURL: "https://todo-listjs-431b6.firebaseio.com",
    projectId: "todo-listjs-431b6",
    storageBucket: "todo-listjs.appspot.com",
    messagingSenderId: "334164896833"
  };
  firebase.initializeApp(config);
//</script>

const todosRef = firebase.database().ref('todos'); //Todos ref for firebase
const completedTodosRef = firebase.database().ref('completedTodos'); // Completed todos ref for firebase

todosRef.on('value', gotData, error);
completedTodosRef.on('value', gotTodosCompleted, error);

function gotData(data) {
    const todos = data.val();
    const classList = document.getElementById('incompleted-task-list');
    classList.innerHTML = '';
    if (todos != null) {
        let keys = Object.keys(todos);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const isTodoCompleted = todos[key].isCompleted;
            const task = todos[key].task;
            const dateToBeCompleted = todos[key].dateTobeCompleted;
            let listItem = createNewTaskElement(keys[i], isTodoCompleted, task, dateToBeCompleted);
            classList.appendChild(listItem);
        }
    }
}

function gotTodosCompleted(completedTodos) {
    const classList = document.getElementById('completed-task-list');
    classList.innerHTML = '';
    const completedTodosList = completedTodos.val();
    if (completedTodosList != null) {
        let keys = Object.keys(completedTodosList);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const isTodoCompleted = completedTodosList[key].isCompleted;
            const task = completedTodosList[key].task;
            const dateToBeCompleted = completedTodosList[key].dateToBeCompleted;
            let listItem = createNewTaskElement(keys[i], isTodoCompleted, task, dateToBeCompleted);
            const completeTasks = document.getElementById('completed-task-list');
            completeTasks.appendChild(listItem);
        }

    }
}

function error(err) {
    console.log(err);
}

const createNewTaskElement = function(key, isTodoCompleted, taskString, dateToBeCompleted) {
    const listItem = document.createElement("li");
    if (isTodoCompleted === false) {
        listItem.className = "list-item";
    } else listItem.className = "completed-list-item";
    listItem.setAttribute("id", key);
    const spanEdit = document.createElement('span');
    spanEdit.className = "editIcon";
    spanEdit.innerHTML = '<i class="fa fa-pencil-square-o" onclick="editTodo(event)" aria-hidden="true"></i>';
    const spanDelete = document.createElement('span');
    spanDelete.className = "deleteIcon";
    spanDelete.innerHTML = '<i class="fa fa-trash-o" onclick="onDeleteTodo(event)" aria-hidden="true"></i>';
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = isTodoCompleted;
    input.onchange = function isTaskCompleted() {
        isTodoCompletedFunc(listItem, input.checked);
    };
    input.className = "input-checkbox";
    const label = document.createElement("label");
    const labelDate = document.createElement("label");
    if (isTodoCompleted === false) {
        labelDate.className = "date-string";
    } else labelDate.className = "completed-date-string";
    labelDate.innerText = dateToBeCompleted;
    label.innerText = taskString;
    if (isTodoCompleted === false) {
        listItem.appendChild(spanEdit);
        listItem.appendChild(spanDelete);
        listItem.appendChild(input);
    }
    listItem.appendChild(label);
    listItem.appendChild(labelDate)
    return listItem;
}

function onAddTodo() {
    const inboxInput = document.getElementById('inputTaskTodos');
    const inboxInputDate = document.getElementById('schedule-todos');
    const errorMsg = document.getElementById('error-msg');
    errorMsg.style.color = "red";
    if (inboxInput.value === "") {
        errorMsg.innerHTML = `<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>Todo cannot be empty.`;
        return;
    }
    if (inboxInputDate.value === "") {
        errorMsg.innerHTML = `<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>Schedule a date for the Todo.It brings more effectivenss.`;
        return;
    }
    saveTodos(inboxInput.value, inboxInputDate.value);
    errorMsg.innerHTML = "";
    inboxInput.value = "";
    inboxInputDate.value = "";
}

function saveTodos(todo, dateTobeCompleted) {
    const isCompleted = false;
    const task = todo;
    const newTodoRef = todosRef.push();
    newTodoRef.set({
        isCompleted,
        task,
        dateTobeCompleted
    })
}

function isTodoCompletedFunc(listItem, value) {
    if (listItem.childNodes[2].checked) {
        const listItemKey = listItem.id;
        const putInCompletedList = completedToDos(listItem, listItem.id);
        todosRef.child(listItemKey).remove();
    }
}

function editTodo(event) {
    const todosInput = document.getElementsByClassName('todos-input');
    todosInput[0].style.display = "none";
    const spanListItem = event.target.parentNode;
    const editElement = spanListItem.parentNode;
    const inboxInput = document.getElementsByClassName('todos-update');
    inboxInput[0].style.display = 'block';
    inboxInput.id = editElement.id;
    const inputFields = inboxInput[0].getElementsByTagName('input');
    const editTask = editElement.getElementsByTagName('label');
    inputFields[0].value = editTask[0].innerHTML;
    inputFields[1].value = editTask[1].innerHTML;
}

function onDeleteTodo(event) {
    const spanListItem = event.target.parentNode;
    const deleteElement = spanListItem.parentNode;
    $(deleteElement).remove();
    todosRef.child(deleteElement.id).remove();
}

function onUpdateTodo() {

    const isCompleted = false;
    const inboxInput = document.getElementsByClassName('todos-update');
    const key = inboxInput.id;
    const inputFields = inboxInput[0].getElementsByTagName('input');
    const task = inputFields[0].value;
    const dateTobeCompleted = inputFields[1].value;
    const editedTodo = task;
    const updatedTodo = {
        isCompleted,
        task,
        dateTobeCompleted
    };
    todosRef.child(key).update(updatedTodo);
    inputFields[0].value = "";
    inputFields[1].value = "";
    inboxInput[0].style.display = 'none';
}

function completedToDos(listItem, key) {
    saveCompletedTodos(listItem, key)
}

function saveCompletedTodos(listItem, key) {
    const isCompleted = listItem.childNodes[2].checked;
    const task = listItem.childNodes[3].innerText;
    const dateToBeCompleted = listItem.childNodes[4].innerText;
    const newTodoRef = completedTodosRef.push();
    newTodoRef.set({
        isCompleted,
        task,
        dateToBeCompleted
    })
}

function onAddTaskTodos() {
    const inboxInput = document.getElementsByClassName('todos-input');
    inboxInput[0].style.display = 'block';
}

function onAddTaskTodosToday() {
    const inboxInput = document.getElementsByClassName('today-input');
    inboxInput[0].style.display = 'block';
}

function onCompletedTodos() {
    const completedTodos = document.getElementsByClassName('completed-todos');
    const navigationDivisions = document.getElementsByClassName('navigation-divisions')[0].children;
    Object.keys(navigationDivisions).forEach(key => {
        navigationDivisions[key].style.display = 'none';
    });
    completedTodos[0].style.display = 'block';
}

function navigateToDivision(divItem) {
    const navigationDivisions = document.getElementsByClassName('navigation-divisions')[0].children;
    Object.keys(navigationDivisions).forEach(key => {
        navigationDivisions[key].style.display = 'none';
    });
    divItem[0].style.display = 'block';
}

function inboxClicked() {
    const inbox = document.getElementsByClassName('inbox');
    navigateToDivision(inbox);
}

function onTodayClicked() {
    const dateToday = new Date();
    const todaysDate = dateConversion(dateToday);
    const dateElement = document.getElementById('todays-date');
    dateElement.innerHTML = todaysDate;
    const today = document.getElementsByClassName('today');
    navigateToDivision(today);
}

function dateConversion(dateToConvert) {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const day = daysOfWeek[dateToConvert.getDay()];
    const date = dateToConvert.getDate();
    const month = months[dateToConvert.getMonth()];
    return `${day} ${date} ${month}`;
}

function onSevenDaysClicked() {
    const sevenDays = document.getElementsByClassName('plus-seven-days');
    navigateToDivision(sevenDays);
}

function onTasks() {
    const tasksTodos = document.getElementsByClassName('todo-main');
    navigateToDivision(tasksTodos);
}

function onAddTask() {
    const inboxInput = document.getElementsByClassName('inbox-input');
    inboxInput[0].style.display = 'block';
}

function onCancelTodos() {
    const inboxInput = document.getElementsByClassName('todos-input');
    inboxInput[0].style.display = 'none';
    const errorMsg = document.getElementById('error-msg');
    errorMsg.innerHTML = "";
    const inputFields = inboxInput[0].getElementsByTagName('input');
    inputFields[0].value = "";
    inputFields[1].value = "";
}

function onCancelUpdate() {
    const inboxInput = document.getElementsByClassName('todos-update');
    const inputFields = inboxInput[0].getElementsByTagName('input');
    inputFields[0].value = "";
    inputFields[1].value = "";
    inboxInput[0].style.display = 'none';
}

$('.dateIcon').click(function(event) {
    event.preventDefault();
    $('#schedule-todos').click();
});

$(document).ready(function() {
    $("add-task-button").click(function() {
        $(".add-task-button").css("outline", "none");
    });
});
$(document).ready(function() {
    $(".cancel-button").click(function() {
        $(".today-input").hide();
        let taskInput1 = document.getElementById("inputTask");
        taskInput1.value = "";
        let dateInput1 = document.getElementById("schedule-inbox");
        dateInput1.value = "";
        $(".todos-input").hide();
        let taskInput4 = document.getElementById("inputTaskTodos");
        taskInput1.value = "";
        let dateInput4 = document.getElementById("schedule-todos");
        dateInput4.value = "";
        $(".inbox-input").hide();
        let taskInput2 = document.getElementById("inputTaskToday");
        taskInput2.value = "";
        let dateInput2 = document.getElementById("schedule-today");
        dateInput2.value = "";
        $(".sevendays-input").hide();
        let taskInput3 = document.getElementById("sevendaysInput");
        taskInput3.value = "";
        let dateInput3 = document.getElementById("schedule-sevendays");
        dateInput3.value = "";

    });
});
// function gotData(data) {
//     const todos = data.val();
//     const classList = document.getElementById('incompleted-task-list');

//     for (var i = 0; i < classList.children.length; i++) {
//         classList.children[i].remove();
//     }
//     if (todos != null) {
//         let keys = Object.keys(todos);
//         for (let i = 0; i < keys.length; i++) {
//             const key = keys[i];
//             const isTodoCompleted = todos[key].isCompleted;
//             const task = todos[key].task;
//             const dateToBeCompleted = todos[key].dateToBeCompleted;
//             let listItem = createNewTaskElement(keys[i], isTodoCompleted, task, dateToBeCompleted);
//             const incompleteTasks = document.getElementById('incompleted-task-list');
//             incompleteTasks.appendChild(listItem);
//         }
//     }
// }

// 

// function gotTodosCompleted(completedTodos) {

//     const completedTodosList = completedTodos.val();
//     if (completedTodosList != null) {
//         let keys = Object.keys(completedTodosList);
//         for (let i = 0; i < keys.length; i++) {
//             const key = keys[i];
//             const isTodoCompleted = completedTodosList[key].isCompleted;
//             const task = completedTodosList[key].task;
//             const dateToBeCompleted = completedTodosList[key].dateToBeCompleted;
//             let listItem = createNewTaskElement(keys[i], isTodoCompleted, task, dateToBeCompleted);
//             const completeTasks = document.getElementById('completed-task-list');
//             completeTasks.appendChild(listItem);
//         }

//     }
// }
// const createNewTaskElement = function(key, isTodoCompleted, taskString, dateToBeCompleted) {

//     var listItem = document.createElement("li");
//     listItem.className = "list-item";
//     listItem.setAttribute("id", key);
//     var input = document.createElement("input");
//     input.type = "checkbox";
//     input.checked = isTodoCompleted;
//     input.onchange = function isTaskCompleted() {
//         isTodoCompletedFunc(listItem, input.checked);
//     };
//     input.className = "input-checkbox";
//     var label = document.createElement("label");
//     var labelDate = document.createElement("label");
//     labelDate.className = "date-string";
//     labelDate.innerText = dateToBeCompleted;
//     label.innerText = taskString;
//     listItem.appendChild(input);
//     listItem.appendChild(label);
//     listItem.appendChild(labelDate)
//     return listItem;
// }

// function isTodoCompletedFunc(listItem, value) {
//     if (listItem.childNodes[0].checked) {
//         const listItemKey = listItem.id;
//         const putInCompletedList = completedToDos(listItem, listItem.id);
//         todosRef.child(listItemKey).remove();
//     }
// }

// function completedToDos(listItem, key) {
//     saveCompletedTodos(listItem, key)
// }

// function IncompletedToDos(listItem, key) {
//     saveIncompletedTodos(listItem, key);
// }

// // function saveIncompletedTodos(listItem, key) {
// //     const isCompleted = listItem.childNodes[0].checked;
// //     const task = listItem.childNodes[1].innerText;
// //     const dateToBeCompleted = listItem.childNodes[2].innerText;
// //     const newTodoRef = todosRef.push();
// //     newTodoRef.set({
// //         isCompleted,
// //         task,
// //         key,
// //         dateToBeCompleted
// //     })
// // }

// function saveCompletedTodos(listItem, key) {
//     const isCompleted = listItem.childNodes[0].checked;
//     const task = listItem.childNodes[1].innerText;
//     const dateToBeCompleted = listItem.childNodes[2].innerText;
//     const newTodoRef = completedTodosRef.push();
//     newTodoRef.set({
//         isCompleted,
//         task,
//         key,
//         dateToBeCompleted
//     })
// }


// function onAddTodo() {
//     const inboxInput = document.getElementById('inputTaskTodos');
//     const inboxInputDate = document.getElementById('schedule-todos');
//     saveTodos(inboxInput.value, inboxInputDate.value);
//     inboxInput.value = "";
//     inboxInputDate.value = "";
// }

// function onAddTaskTodos() {
//     const inboxInput = document.getElementsByClassName('todos-input');
//     inboxInput[0].style.display = 'block';
// }

// function saveTodos(todo, dateTobeCompleted) {
//     const isCompleted = false;
//     const task = todo;
//     const newDate = new Date(dateTobeCompleted);
//     const newTodoRef = todosRef.push();
//     newTodoRef.set({
//         isCompleted,
//         task,
//         newDate
//     })
// }
// $(document).ready(function() {
//     setTimeout(function() {
//         const taskCompleted = document.getElementById('completed-task-list');
//         const checkBoxes = [];

//         const taskList = document.querySelectorAll('.list-item');
//         for (let i = 0; i < taskList.length; i++) {
//             const checkBox = taskList[i].children['0'];
//             checkBoxes.push(checkBox);
//         }
//         for (let i = 0; i < taskList.length; i++) {
//             const checkBox = taskList[i].children['0'];

//             checkBoxes.push(checkBox);
//             let isTaskCompleted = function(taskList) {
//                 console.log(checkBox);
//             }
//         }


//         // checkBoxes.forEach(function(checkbox) {
//         //     checkbox.onchange = taskCompleted(checkbox.parent);
//         // });




//     }, 3000);
// });


// function taskiconClicked() {
//     const todosDiv = document.getElementsByClassName('todo-main');
//     if (todosDiv.style.display === "none") {
//         todosDiv.style.display = 'block';
//     } else todosDiv.style.display = 'none';
//     const todosMainDiv = document.getElementsByClassName('navigation-divisions');
//     todosMainDiv.innerHTML = todosDiv;

// }




// const createNewTaskElement = function(isTodoCompleted, taskString, dateToBeCompleted) {

//     var listItem = document.createElement("li");
//     listItem.className = "list-item";
//     var checkBox = document.createElement("input");
//     checkBox.type = "checkbox";
//     checkBox.value = isTodoCompleted;
//     checkBox.className = "input-checkbox";
//     var label = document.createElement("label");
//     var labelDate = document.createElement("label");
//     labelDate.className = "date-string";
//     labelDate.innerText = dateToBeCompleted;
//     label.innerText = taskString;
//     listItem.appendChild(checkBox);
//     listItem.appendChild(label);
//     listItem.appendChild(labelDate)
//     return listItem;
// }
// document.addEventListener('DOMContentLoaded', function() {
//     // your code here
//     const taskInput = document.getElementById("inputTask");
//     const incompleteTasks = document.getElementById('incompleted-task-list');
//     const completeTasks = document.getElementById('completed-task-list');




//     const addTask = function() {
//         let taskInput = document.getElementById("inputTask");
//         let dateInput = document.getElementById("schedule-inbox");
//         let isCompleted = false;
//         let listItem = createNewTaskElement(isCompleted, taskInput.value, dateInput.value);
//         incompleteTasks.appendChild(listItem);
//         saveTask(isCompleted, taskInput.value, dateInput.value);
//         bindTaskEvents(listItem, taskcompleted);
//     }

//     const taskcompleted = function() {
//         const listItem = this.parentNode;
//         completeTasks.appendChild(listItem);
//         bindTaskEvents(listItem, taskIncomplete);
//     }

//     const taskIncomplete = function() {
//         const listItem = this.parentNode;
//         incompleteTasks.appendChild(lisstItem);
//         bindTaskEvents(listItem, taskcompleted);
//     }

//     var bindTaskEvents = function(listItem, checkBoxEventHandler) {
//         var checkBox = listItem.querySelector("input[type=checkbox]");
//         checkBox.onchange = checkBoxEventHandler;
//     }

//     for (var i = 0; i < incompleteTasks.children.length; i++) {
//         bindTaskEvents(incompleteTasks.children[i], taskCompleted);
//     }
//     for (var i = 0; i < completeTasks.children.length; i++) {
//         bindTaskEvents(completeTasks.children[i], taskIncomplete);
//     }

//     const addTaskTodos = function() {
//         let taskInput = document.getElementById("inputTaskTodos");
//         let dateInput = document.getElementById("schedule-todos");
//         let isCompleted = false;
//         let listItem = createNewTaskElement(isCompleted, taskInput.value, dateInput.value);
//         let incompleteTasks = document.getElementById('incomplete-task-list');
//         incompleteTasks.appendChild(listItem);
//         saveTask(isCompleted, taskInput.value, dateInput.value);
//     }
//     const addTaskToday = function() {
//         let taskInput = document.getElementById("inputTaskToday");
//         let dateInput = document.getElementById("schedule-today");
//         let listItem = createNewTaskElement(taskInput.value, dateInput.value);
//         let incompleteTasks = document.getElementById('today-task-list');
//         incompleteTasks.appendChild(listItem);
//         taskInput.value = "";
//         dateInput.value = "";
//     }
//     const addTaskSevenDays = function() {
//         let taskInput = document.getElementById("sevendaysInput");
//         let dateInput = document.getElementById("schedule-sevendays");
//         let listItem = createNewTaskElement(taskInput.value, dateInput.value);
//         let incompleteTasks = document.getElementById('sevendays-task-list');
//         incompleteTasks.appendChild(listItem);
//         taskInput.value = "";
//         dateInput.value = "";
//     }


//     function saveTask(isCompleted, task, dateToBeCompleted) {
//         const newTodoRef = todosRef.push();
//         newTodoRef.set({
//             isCompleted,
//             task,
//             dateToBeCompleted
//         })
//     }
// }, false);






// function onCancel() {
//     let taskInput = document.getElementById("inputTask");
//     taskInput.value = "";
//     let dateInput = document.getElementById("schedule-inbox");
//     dateInput.value = " ";
// }


// function addTask() {
//     const addedTask = document.getElementById('inputTask').value;
//     const checkIcon = '<i class="fa fa-check fa-2x" aria-hidden="true"></i>';
//     var para = document.createElement("P");
//     const div = document.createElement("DIV");
//     div.className = "task"
//     var text = document.createTextNode(addedTask); // Create a text node
//     para.appendChild(text); // Append the text to <p>
//     div.appendChild(checkIcon);
//     document.appendChild(para);
//     document.getElementsByClassName('task-list').innerHTML = div;
//}