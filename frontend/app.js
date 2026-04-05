// --- UI Elements --- //
const navTabs = document.querySelectorAll('.nav-tab');
const viewSections = document.querySelectorAll('.view-section');

const projectsTableBody = document.getElementById("projects-table-body");
const dashboardProjectsBody = document.getElementById("dashboard-projects-body");
const addProjectBtn = document.getElementById("add-project-btn");
const addProjectForm = document.getElementById("add-project-form");
const submitProjectBtn = document.getElementById("submit-project-btn");
const newProjectName = document.getElementById("new-project-name");
const newProjectStatus = document.getElementById("new-project-status");

const statTotal = document.getElementById("total-projects");
const statInProgress = document.getElementById("in-progress");
const statCompleted = document.getElementById("completed-projects");
const statPending = document.getElementById("pending-tasks");

const activityList = document.getElementById("activity-list");
const teamGridPreview = document.getElementById("team-grid-preview");
const fullTeamList = document.getElementById("full-team-list");
const roleBtns = document.querySelectorAll('.role-btn');

const notifToggle = document.getElementById("notif-toggle");
const notifDropdown = document.getElementById("notif-dropdown");

// --- Modal Elements --- //
const editModal = document.getElementById("edit-modal");
const closeModalBtn = document.getElementById("close-modal");
const cancelModalBtn = document.getElementById("cancel-modal");
const saveModalBtn = document.getElementById("save-modal");
const aiPredictionBadge = document.getElementById("ai-prediction-badge");

// --- Mock Data --- //
const teamMembers = [
    { name: "Raj", role: "manager", image: "https://ui-avatars.com/api/?name=Raj&background=edf2f7&color=2d3748" },
    { name: "Ananya", role: "engineer", image: "https://ui-avatars.com/api/?name=Ananya&background=edf2f7&color=2d3748" },
    { name: "Vikas", role: "engineer", image: "https://ui-avatars.com/api/?name=Vikas&background=edf2f7&color=2d3748" },
    { name: "Priya", role: "worker", image: "https://ui-avatars.com/api/?name=Priya&background=edf2f7&color=2d3748" },
    { name: "David", role: "manager", image: "https://ui-avatars.com/api/?name=David&background=edf2f7&color=2d3748" },
    { name: "Sarah", role: "client", image: "https://ui-avatars.com/api/?name=Sarah&background=edf2f7&color=2d3748" },
    { name: "Amit", role: "worker", image: "https://ui-avatars.com/api/?name=Amit&background=edf2f7&color=2d3748" }
];

const activities = [
    { text: "<strong>Site Development</strong> marked as in progress", time: "2:12 PM", icon: "fa-solid fa-wrench" },
    { text: "<strong>Meeting scheduled</strong> for Office Renovation", time: "2:55 AM", icon: "fa-regular fa-calendar" },
    { text: "<strong>Bridge Construction</strong> completed", time: "2:49 AM", icon: "fa-solid fa-check-circle" }
];

// Fallback initial data in case backend is empty or unreachable
let globalTasks = [
    { id: 1, name: "Site Development", planned: 80, actual: 50, deadline: "May 10, 2024" },
    { id: 2, name: "Office Renovation", planned: 100, actual: 100, deadline: "Apr 20, 2024" },
    { id: 3, name: "Bridge Construction", planned: 100, actual: 100, deadline: "Mar 15, 2024" },
    { id: 4, name: "Road Expansion", planned: 40, actual: 0, deadline: "Jun 5, 2024" },
    { id: 5, name: "Mall Interiors", planned: 50, actual: 30, deadline: "Jul 12, 2024" }
];

// --- Tab Navigation --- //
navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const target = tab.getAttribute('data-target');
        
        navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        viewSections.forEach(v => {
            if (v.id === target) v.style.display = 'block';
            else v.style.display = 'none';
        });
    });
});

// --- Notifications --- //
notifToggle.addEventListener('click', () => {
    notifDropdown.classList.toggle('show');
});
document.addEventListener('click', (e) => {
    if (!notifToggle.contains(e.target)) {
        notifDropdown.classList.remove('show');
    }
});

// --- Helper Functions --- //
function getStatusBadge(status) {
    if (status === "Completed") return `<span class="badge completed">Completed</span>`;
    if (status === "Pending") return `<span class="badge pending">Pending</span>`;
    return `<span class="badge in-progress">In Progress</span>`;
}

function getRandomDeadline() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[Math.floor(Math.random() * months.length)];
    const day = Math.floor(Math.random() * 28) + 1;
    return `${month} ${day}, 2024`;
}

function mapTaskToProjectStatus(task) {
    const actual = task.actual || 0;
    if (actual >= 100) return "Completed";
    if (actual === 0) return "Pending";
    return "In Progress";
}

// --- Render Mock Static Data --- //
function renderTeam(filterRole = 'all') {
    let filteredTeam = teamMembers;
    if (filterRole !== 'all') {
        filteredTeam = teamMembers.filter(m => m.role === filterRole);
    }
    
    // Desktop Full Team format
    if(fullTeamList) {
        fullTeamList.innerHTML = filteredTeam.map(member => `
            <div class="team-member">
                <img src="${member.image}" alt="${member.name}">
                <p>${member.name}</p>
                <span style="text-transform: capitalize;">${member.role}</span>
            </div>
        `).join('');
    }

    // Dashboard Preview (just the first 4)
    if (filterRole === 'all' && teamGridPreview) {
        teamGridPreview.innerHTML = teamMembers.slice(0,4).map(member => `
            <div class="team-member">
                <img src="${member.image}" alt="${member.name}">
                <p>${member.name}</p>
            </div>
        `).join('');
    }
}

if(roleBtns) {
    roleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            roleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTeam(btn.getAttribute('data-role'));
        });
    });
}

function renderActivities() {
    if(!activityList) return;
    activityList.innerHTML = activities.map(act => `
        <div class="activity-item">
            <div class="activity-icon"><i class="${act.icon}"></i></div>
            <div class="activity-content">
                <p class="activity-text">${act.text}</p>
            </div>
            <div class="activity-time">${act.time}</div>
        </div>
    `).join('');
}

// --- Handle Chat --- //
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat-btn');
const chatMessages = document.getElementById('chat-messages');

function sendChatMessage() {
    if(!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    chatMessages.innerHTML += `
        <div class="msg sent">
            <strong>You (User)</strong>
            <p>${text}</p>
            <small>${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
        </div>
    `;
    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight; // auto-scroll
    
    // Mock incoming response
    setTimeout(() => {
        chatMessages.innerHTML += `
            <div class="msg received">
                <strong>AI Assistant (System)</strong>
                <p>Noted! Site data saved successfully.</p>
                <small>${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
            </div>
        `;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1500);
}

if(sendChatBtn) sendChatBtn.onclick = sendChatMessage;
if(chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChatMessage(); });

// --- Render dynamic Projects --- //
function renderProjects(tasks) {
    if(!projectsTableBody || !dashboardProjectsBody) return;
    projectsTableBody.innerHTML = "";
    dashboardProjectsBody.innerHTML = "";
    
    let inProgress = 0, completed = 0, pending = 0;

    tasks.forEach(task => {
        const status = task.hasOwnProperty('statusMock') ? task.statusMock : mapTaskToProjectStatus(task);
        if (!task.deadline) task.deadline = getRandomDeadline();
        if (task.planned === undefined) task.planned = 100;
        
        if (status === "Completed") completed++;
        else if (status === "Pending") pending++;
        else inProgress++;

        const avatars = teamMembers.slice(0, Math.floor(Math.random() * 2) + 2).map(m => `<img src="${m.image}" alt="${m.name}" title="${m.name}">`).join('');
        
        // Progress HTML
        const progressHTML = `
            <div style="font-size:0.75rem; color:#888;">Plan: ${task.planned}% | Act: ${task.actual}%</div>
            <div class="plan-actual-bar">
                <div class="bar-actual" style="width:${task.actual}%"></div>
            </div>
        `;

        const rowHTML = `
            <td>${task.name}</td>
            <td>${getStatusBadge(status)}</td>
            <td>${task.deadline}</td>
            <td class="extended-only">${progressHTML}</td>
            <td class="preview-only"><div class="avatar-stack">${avatars}</div></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-view" onclick="alert('Viewing Image Verification for Project:\\n${task.name}')">View</button>
                    <button class="btn btn-edit" onclick="openEditModal(${task.id})">Edit</button>
                </div>
            </td>
        `;

        // Add to main table
        const tr1 = document.createElement("tr");
        tr1.innerHTML = rowHTML;
        tr1.querySelector('.preview-only').remove(); 
        projectsTableBody.appendChild(tr1);

        // Add to preview table (simplified)
        const tr2 = document.createElement("tr");
        tr2.innerHTML = rowHTML;
        tr2.querySelector('.extended-only').remove();
        dashboardProjectsBody.appendChild(tr2);
    });

    if(statTotal) statTotal.innerText = tasks.length;
    if(statInProgress) statInProgress.innerText = inProgress;
    if(statCompleted) statCompleted.innerText = completed;
    if(statPending) statPending.innerText = pending;
}

// --- Fetching API with Offline fallback --- //
async function fetchTasks() {
    try {
        const res = await fetch("/api/tasks");
        if(res.ok) {
            const backendTasks = await res.json();
            // In case the backend has data, use it. If not, use the mock global tasks.
            if(backendTasks && backendTasks.length > 0) {
                globalTasks = backendTasks;
            }
        }
    } catch (err) {
        console.warn("Backend not running or failed. Running in Local Mock mode.");
    } finally {
        renderProjects(globalTasks);
    }
}

// Add New Project
if(addProjectBtn) {
    addProjectBtn.onclick = () => { addProjectForm.style.display = addProjectForm.style.display === "none" ? "block" : "none"; };
}

if(submitProjectBtn) {
    submitProjectBtn.onclick = async () => {
        const name = newProjectName.value.trim();
        const status = newProjectStatus.value;
        if (!name) return alert("Enter project name");
        
        let actual = 0;
        if (status === "Completed") actual = 100;
        if (status === "In Progress") actual = 50;

        const newTask = { 
            id: Date.now(), 
            name, 
            planned: 100, 
            actual, 
            deadline: getRandomDeadline(), 
            statusMock: status 
        };

        try {
            await fetch("/api/tasks", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask)
            });
        } catch(e) { /* local fallback acts automatically */ }
        
        globalTasks.push(newTask);
        
        newProjectName.value = "";
        addProjectForm.style.display = "none";
        renderProjects(globalTasks);
    };
}

// --- Modal Interactions --- //
window.openEditModal = (id) => {
    const task = globalTasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById("edit-project-id").value = task.id;
    document.getElementById("edit-project-name").value = task.name;
    document.getElementById("edit-project-deadline").value = task.deadline || "";
    document.getElementById("edit-planned").value = task.planned || 100;
    document.getElementById("edit-actual").value = task.actual || 0;
    
    const status = task.hasOwnProperty('statusMock') ? task.statusMock : mapTaskToProjectStatus(task);
    document.getElementById("edit-project-status").value = status;

    // AI Prediction Default
    if (aiPredictionBadge) aiPredictionBadge.style.display = 'none';
    if (task.planned - task.actual > 20) {
        aiPredictionBadge.style.display = 'flex';
    }

    // Attach dynamic event listener for AI slider in real time
    document.getElementById("edit-actual").oninput = function() {
        const p = parseInt(document.getElementById("edit-planned").value) || 0;
        const a = parseInt(this.value) || 0;
        if (p - a > 20) aiPredictionBadge.style.display = 'flex';
        else aiPredictionBadge.style.display = 'none';
    };

    if(editModal) editModal.classList.add('active');
}

function closeEditModal() { if(editModal) editModal.classList.remove('active'); }
if(closeModalBtn) closeModalBtn.onclick = closeEditModal;
if(cancelModalBtn) cancelModalBtn.onclick = closeEditModal;

if(saveModalBtn) {
    saveModalBtn.onclick = async () => {
        const id = parseInt(document.getElementById("edit-project-id").value);
        const name = document.getElementById("edit-project-name").value;
        const deadline = document.getElementById("edit-project-deadline").value;
        const planned = parseInt(document.getElementById("edit-planned").value) || 0;
        const actual = parseInt(document.getElementById("edit-actual").value) || 0;
        const statusMock = document.getElementById("edit-project-status").value;

        // Update local memory state perfectly
        const taskIdx = globalTasks.findIndex(t => t.id === id);
        if(taskIdx !== -1) {
            globalTasks[taskIdx] = { ...globalTasks[taskIdx], name, deadline, planned, actual, statusMock };
        }

        try {
            await fetch(`/api/tasks/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(globalTasks[taskIdx])
            });
        } catch(e) { /* ignore backend failure, allow local demo */ }

        activities.unshift({ text: `<strong>${name}</strong> details updated via Dashboard`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), icon: "fa-solid fa-pen" });
        if (activities.length > 5) activities.pop();
        renderActivities();
        renderProjects(globalTasks);
        closeEditModal();
    }
}

// Initial renders
renderTeam();
renderActivities();
fetchTasks();