let selectedTasks = ["Subscribe"];   // ✅ Default selected
let taskLinks = {};
let customTasks = [];

/* ================= DEFAULT TASK ================= */

function toggleTask(button, task){

  button.classList.toggle("active");

  if(selectedTasks.includes(task)){
    selectedTasks = selectedTasks.filter(t => t !== task);
    delete taskLinks[task];
  } else {
    selectedTasks.push(task);
  }

  renderTaskInputs();
}

/* ================= RENDER INPUTS ================= */

function renderTaskInputs(){

  const box = document.getElementById("taskInputs");
  if(!box) return;

  box.innerHTML = "";

  selectedTasks.forEach(task=>{
    box.innerHTML += `
      <input type="text"
        placeholder="Enter link for ${task}"
        value="${taskLinks[task] || ""}"
        oninput="setTaskLink('${task}', this.value)">
    `;
  });

}

/* ================= STORE LINK ================= */

function setTaskLink(task,value){
  taskLinks[task] = value;
}

/* ================= CUSTOM TASK ================= */

function toggleCustomTask(){
  const modal = document.getElementById("customTaskModal");
  if(!modal) return;

  modal.style.display =
    modal.style.display === "flex" ? "none" : "flex";
}

function addCustomTask(){

  const nameInput = document.getElementById("customTaskName");
  const linkInput = document.getElementById("customTaskLink");

  const name = nameInput.value.trim();
  const link = linkInput.value.trim();

  if(name === "" || link === ""){
    alert("Enter both custom task name and link");
    return;
  }

  if(selectedTasks.includes(name)){
    alert("Task already exists");
    return;
  }

  // ✅ Add to arrays
  selectedTasks.push(name);
  taskLinks[name] = link;

  // ✅ Create visible task button
  const grid = document.querySelector(".task-grid");

  const newBtn = document.createElement("button");
  newBtn.className = "task-btn active";
  newBtn.innerHTML = `<span class="icon">✨</span> ${name}`;

  newBtn.onclick = function(){
    toggleTask(newBtn, name);
  };

  // Add before custom task button (last one)
  grid.insertBefore(newBtn, grid.lastElementChild);

  // ✅ Clear inputs
  nameInput.value = "";
  linkInput.value = "";

  // ✅ Close modal
  document.getElementById("customTaskModal").style.display = "none";

  renderTaskInputs();
}

/* ================= CREATE LINK ================= */

function createLink(){

  const destination = document.getElementById("destination").value;

  if(destination.trim() === ""){
    alert("Enter destination link");
    return;
  }

  fetch("/api/create",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      destination,
      tasks:selectedTasks,
      taskLinks
    })
  })
  .then(res=>res.json())
  .then(data=>{
    document.getElementById("resultBox").style.display="block";
    document.getElementById("generatedLink").value=data.shortLink;
  });
}

/* ================= COPY LINK ================= */

function copyLink() {
    const input = document.getElementById("generatedLink");

    input.select();
    input.setSelectionRange(0, 99999);

    try {
        document.execCommand("copy");
        const toast = document.getElementById("toast");

toast.classList.add("show");

setTimeout(() => {
    toast.classList.remove("show");
}, 2000);
    } catch (err) {
        alert("Copy failed!");
    }
}
/* ================= LOAD DEFAULT INPUT ================= */

document.addEventListener("DOMContentLoaded", function(){
  renderTaskInputs();
});

// ----------------mobile three dot ---------------------------
function toggleMenu() {
  const nav = document.getElementById("navLinks");

  if (nav.classList.contains("show")) {
    nav.classList.remove("show");
  } else {
    nav.classList.add("show");
  }
};
document.addEventListener("DOMContentLoaded", () => {

  const questions = document.querySelectorAll(".faq-question");

  questions.forEach(question => {

    question.addEventListener("click", () => {

      const item = question.parentElement;

      document.querySelectorAll(".faq-item").forEach(faq => {
        if (faq !== item) {
          faq.classList.remove("active");
        }
      });

      item.classList.toggle("active");

    });

  });

});
function shareWebsite() {
    const url = window.location.origin;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => {
                alert("CreatorsLink copied! 🚀");
            })
            .catch(() => {
                prompt("Copy this link:", url);
            });
    } else {
        prompt("Copy this link:", url);
    }
}