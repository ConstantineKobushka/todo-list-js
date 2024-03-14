const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');
const fullList = document.querySelector('#fullList');
const removeDoneTasks = document.querySelector('#removeDoneTasks');
const removeEveryTasks = document.querySelector('#removeEveryTasks');

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach(function (task) {
    renderTask(task);
  });
}
checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);
removeDoneTasks.addEventListener('click', deleteEveryDoneTask);
removeEveryTasks.addEventListener('click', deleteEveryTasks);

function addTask(event) {
  event.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText.length === 0) {
    taskInput.value = '';
    taskInput.focus();
    return;
  }
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };
  tasks.push(newTask);
  saveToLocalStorage();
  renderTask(newTask);
  taskInput.value = '';
  taskInput.focus();
  checkEmptyList();
}

function deleteTask(event) {
  if (event.target.dataset.action !== 'delete') return;
  const parenNode = event.target.closest('.list-group__item');
  const id = Number(parenNode.id);
  tasks = tasks.filter((task) => task.id !== id);
  saveToLocalStorage();
  parenNode.remove();
  checkEmptyList();
}

function doneTask(event) {
  if (event.target.dataset.action !== 'done') return;
  const parenNode = event.target.closest('.list-group__item');
  const id = Number(parenNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;
  saveToLocalStorage();

  const taskTile = parenNode.querySelector('.task-item__title');
  taskTile.classList.toggle('task-item__title--done');
}

function checkEmptyList() {
  if (tasks.length === 0) {
    fullList.classList.add('list-state__hidden');
    emptyList.classList.remove('list-state__hidden');
  } else if (tasks.length > 0) {
    fullList.classList.remove('list-state__hidden');
    emptyList.classList.add('list-state__hidden');
  }
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done
    ? 'task-item__title task-item__title--done'
    : 'task-item__title';
  const taskHTML = `
        <li id="${task.id}" class="list-group__item task-item">
          <span class="${cssClass}">${task.text}</span>
          <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
              <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
              <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
          </div>
        </li>`;
  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

function deleteEveryDoneTask() {
  if (tasks.length === 0) return;
  tasks.forEach(function (task) {
    if (task.done === true) {
      const elementsById = document.querySelectorAll(`[id="${task.id}"]`);
      elementsById.forEach(function (element) {
        element.remove();
        tasks = tasks.filter(function (task) {
          return task.done !== true;
        });
      });
    }
  });
  saveToLocalStorage();
  checkEmptyList();
}

function deleteEveryTasks() {
  if (tasks.length === 0) return;
  tasks.forEach(function (task) {
    const elementsById = document.querySelectorAll(`[id="${task.id}"]`);
    elementsById.forEach(function (element) {
      element.remove();
    });
    tasks = tasks.filter(function (task) {
      return task === true;
    });
  });
  saveToLocalStorage();
  checkEmptyList();
}
