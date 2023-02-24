const API = "http://localhost:8000/contacts";

const list = document.querySelector("#contact-list");

// стягивание данных для ввода данных
const addForm = document.querySelector("#add-form");
const nameInp = document.querySelector("#name");
const emailInp = document.querySelector("#email");
const numberInp = document.querySelector("#number");
const imageInp = document.querySelector("#image");

// стягивание данных с первой модалки
const modal = document.querySelector(".modal");
const editNameInp = document.querySelector("#edit-name");
const editEmailInp = document.querySelector("#edit-email");
const editNumberInp = document.querySelector("#edit-number");
const editImageInp = document.querySelector("#edit-image");
const editSaveBtn = document.querySelector("#btn-save-edit");
const editCloseBtn = document.querySelector(".close-btn");
const closeModal = document.querySelector(".btn-close");

// стягивание данных со второй модалки
const secModal = document.querySelector(".second-modal");
const closeSecModal = document.querySelector(".close-secmodal");
const sendInpAddress = document.querySelector(".send-address");
const senderInp = document.querySelector(".sender");
const textInp = document.querySelector(".text");
const sendBtn = document.querySelector(".send");

getContacts();

async function getContacts() {
  const res = await fetch(API);
  const data = await res.json();
  render(data);
}

async function deleteContact(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  getContacts();
}

async function getOneContact(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();
  return data;
}

async function editContact(id, editedContact) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedContact),
    headers: {
      "Content-Type": "application/json",
    },
  });
  getContacts();
}

function render(arr) {
  list.innerHTML = "";
  arr.forEach((item) => {
    list.innerHTML += `
    <div class="contact-card">
     <img src="${item.image}" alt="Avatar" />
      <div class="contact-info">
      <h3>${item.name}</h3>
      <p class='email' id='${item.id}'>Email: ${item.email}</p>
      <p>Phone: ${item.number}</p>
        <button class="phone-icon__btn">
          <div class="circle"></div>
          <div class='phone-icon' alt=""> </div>
        </button>
        <div class='btns'>
            <button id="${item.id}" class="btn-edit">EDIT</button>
            <button id="${item.id}" class="btn-delete">DELETE</button>
        </div>
    </div>
  </div>`;
  });
}

async function addContact(contact) {
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(contact),
    headers: {
      "Content-Type": "application/json",
    },
  });
  getContacts();
}

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    !nameInp.value.trim() ||
    !numberInp.value.trim() ||
    !emailInp.value.trim() ||
    !imageInp.value.trim()
  ) {
    alert("Заполните все поля");
    return;
  }

  const contact = {
    name: nameInp.value,
    email: emailInp.value,
    number: numberInp.value,
    image: imageInp.value,
  };

  addContact(contact);

  nameInp.value = "";
  emailInp.value = "";
  numberInp.value = "";
  imageInp.value = "";
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    deleteContact(e.target.id);
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("phone-icon")) {
    alert("В компьютерной версии нельзя совершать звонок");
  } else if (e.target.classList.contains("phone-icon__btn")) {
    alert("В компьютерной версии нельзя совершать звонок");
  } else if (e.target.classList.contains("circle")) {
    alert("В компьютерной версии нельзя совершать звонок");
  }
});

let id = null;

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-edit")) {
    id = e.target.id;
    modal.style.visibility = "visible";
    const contact = await getOneContact(e.target.id);

    editNameInp.value = contact.name;
    editNumberInp.value = contact.number;
    editImageInp.value = contact.image;
    editEmailInp.value = contact.email;
  }
});

editCloseBtn.addEventListener("click", (e) => {
  modal.style.visibility = "hidden";
});

closeModal.addEventListener("click", (e) => {
  modal.style.visibility = "hidden";
});

editSaveBtn.addEventListener("click", (e) => {
  if (
    !editNameInp.value.trim() ||
    !editNumberInp.value.trim() ||
    !editImageInp.value.trim() ||
    !editEmailInp.value.trim()
  ) {
    alert("Заполните поля");
    return;
  }

  const editedContact = {
    name: editNameInp.value,
    number: editNumberInp.value,
    email: editEmailInp.value,
    image: editImageInp.value,
  };

  editContact(id, editedContact);
  modal.style.visibility = "hidden";
});

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("email")) {
    id = e.target.id;
    secModal.style.visibility = "visible";
    const message = await getOneContact(e.target.id);

    sendInpAddress.value = message.email;
  }
});

closeSecModal.addEventListener("click", (e) => {
  secModal.style.visibility = "hidden";
});

function addMessage(newMessage) {
  const data = getDataFromStorage();
  data.unshift(newMessage);
  localStorage.setItem("message", JSON.stringify(data));
}

function getDataFromStorage() {
  const data = JSON.parse(localStorage.getItem("message"));
  if (data) {
    return data;
  } else {
    return [];
  }
}

sendBtn.addEventListener("click", (e) => {
  if (
    !sendInpAddress.value.trim() ||
    !senderInp.value.trim() ||
    !textInp.value.trim()
  ) {
    alert("Заполните поля");
    return;
  }

  const message = {
    id: Date.now(),
    title: textInp.value,
    sender: senderInp.value,
    address: sendInpAddress.value,
  };
  addMessage(message);
  alert("Сообщение отправлено");
  secModal.style.visibility = "hidden";

  (sendInpAddress.value = ""), (senderInp.value = ""), (textInp.value = "");
});
