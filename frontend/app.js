const taskContainer = document.getElementById("tasks");
const addBtn = document.getElementById("add-btn");
const taskInput = document.getElementById("task-name");
const plannedInput = document.getElementById("planned");
const notifications = document.getElementById("notifications");

// Fetch tasks from backend
async function fetchTasks() {
    const res = await fetch("/api/tasks");
    const tasks = await res.json();
    renderTasks(tasks);
    updateGraph(tasks);
}

function renderTasks(tasks) {
    taskContainer.innerHTML = "";
    tasks.forEach(task => {
        const div = document.createElement("div");
        div.innerHTML = `
            <strong>${task.name}</strong> - Planned: ${task.planned}% | Actual: ${task.actual || 0}%
            <div class="progress-bar" style="width:${task.actual || 0}%;background:${task.actual < task.planned ? 'red' : 'green'}"></div>
            <button onclick="updateTask(${task.id}, 10)">+10%</button>
        `;
        taskContainer.appendChild(div);
        if(task.actual < task.planned){
            notifications.innerText = `⚠️ Task '${task.name}' is behind schedule!`;
        }
    });
}

// Add task
addBtn.onclick = async () => {
    const name = taskInput.value;
    const planned = parseInt(plannedInput.value);
    if(!name || isNaN(planned)) return alert("Enter name & planned %");
    await fetch("/api/tasks", {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({name, planned, actual:0})
    });
    taskInput.value=""; plannedInput.value="";
    fetchTasks();
}

// Update task
async function updateTask(id, val){
    const res = await fetch(`/api/tasks/${id}`);
    const task = await res.json();
    const newActual = Math.min((task.actual || 0)+val,100);
    await fetch(`/api/tasks/${id}`, {
        method:"PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({actual:newActual})
    });
    fetchTasks();
}

// Initial fetch
fetchTasks();