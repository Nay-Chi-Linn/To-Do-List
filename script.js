const list = document.querySelector(".list");
const create_el = document.querySelector(".add_btn");
const countList = document.getElementById("countList");

const allCheck = document.getElementById("allCheck");
const allCancel = document.getElementById("allCancel");
const clearAll = document.getElementById("clearAll");
const completedList = document.getElementById("completedList");
const activeList = document.getElementById("activeList");
const showAll = document.getElementById("showAll");
const clearCompleted = document.getElementById("clearCompleted");
let todo = [];
let count = 0;

const CreateNewTodo = () => {
  let item = {
    id: new Date().getTime(),
    text: "",
    complete: false,
  };
  todo.unshift(item);
  const { item_el, input_el } = CreateTodoElement(item);
  list.prepend(item_el);
  input_el.removeAttribute("disabled");
  input_el.focus();

  Save();
};

create_el.addEventListener("click", CreateNewTodo);

const CreateTodoElement = (item) => {
  const item_el = document.createElement("div");
  item_el.classList.add("item");

  const checkbox_el = document.createElement("input");
  checkbox_el.type = "checkbox";
  checkbox_el.checked = item.complete;
  if (item.complete) {
    item_el.classList.add("complete");
  }

  const input_el = document.createElement("input");
  input_el.type = "text";
  input_el.value = item.text;
  input_el.setAttribute("disabled", "");

  const action_el = document.createElement("div");

  const editBtn = document.createElement("button");
  editBtn.append("Edit");
  editBtn.classList.add("editBtn");
  const trashBtn = document.createElement("button");
  trashBtn.append("Delete");
  trashBtn.classList.add("trashBtn");

  action_el.append(editBtn, trashBtn);

  item_el.append(checkbox_el, input_el, action_el);

  checkbox_el.addEventListener("change", () => {
    item.complete = checkbox_el.checked;
    if (item.complete) {
      item_el.classList.add("complete");
      count -= 1;
      ShowCount(count);
    } else {
      item_el.classList.remove("complete");

      count += 1;
      ShowCount(count);
    }
    AllCheckAndCancel();

    Save();
  });

  input_el.addEventListener("input", () => {
    item.text = input_el.value;
  });

  let isClicked = false;
  const ShowList = () => {
    if (isClicked) {
      input_el.setAttribute("disabled", "");
      todo = todo.map(function updat(td) {
        if (td.id == item.id) {
          td.text = input_el.value;
          return td;
        }
        return td;
      });
      Save();
    } else {
      input_el.setAttribute("disabled", "");
      count += 1;
      ShowCount(count);
      Save();
    }
  };

  // Add event listener for 'keyup' event
  input_el.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      isEnter = true;
      console.log(isEnter);
      ShowList();
    } else if (e.key == "Escape") {
      LoadData();
      let td = todo.filter((td) => td.id == item.id);
      console.log(td);
      input_el.value = td[0].text;
      ShowList();
    }
  });

  editBtn.addEventListener("click", () => {
    input_el.removeAttribute("disabled");
    input_el.focus();
    isClicked = true;
  });

  trashBtn.addEventListener("click", () => {
    todo = todo.filter((rem) => rem.id != item.id);
    item_el.remove();
    count -= 1;
    ShowCount(count);
    Save();
  });
  return { input_el, item_el, editBtn, trashBtn, checkbox_el };
};
function Save() {
  const save = JSON.stringify(todo);
  localStorage.setItem("my_todos", save);
}

const LoadData = () => {
  const data = localStorage.getItem("my_todos");
  if (data) {
    todo = JSON.parse(data);
  }
};
const DisplayTodo = () => {
  LoadData();
  for (let i = 0; i < todo.length; i++) {
    const newItem = todo[i];
    const { item_el } = CreateTodoElement(newItem);
    list.append(item_el);

    let comList2 = todo.filter((val) => {
      if (val.complete == false) {
        return val;
      }
    });

    count = comList2.length;
    ShowCount(count);
  }
};
DisplayTodo();

allCheck.addEventListener("click", () => {
  list.innerHTML = "";
  for (let i = 0; i < todo.length; i++) {
    let newItm = todo[i];
    newItm.complete = true;
    CancleCaheck(newItm);
  }
  count = 0;
  ShowCount(count);
  AllCheckAndCancel();
  Save();
});
allCancel.addEventListener("click", () => {
  list.innerHTML = "";
  for (let i = 0; i < todo.length; i++) {
    let newItm = todo[i];
    newItm.complete = false;
    CancleCaheck(newItm);
  }
  count = todo.length;
  ShowCount(count);
  AllCheckAndCancel();
  Save();
});

clearAll.addEventListener("click", () => {
  todo.splice(0, todo.length);
  list.innerHTML = "";
  for (let i = 0; i < todo.length; i++) {
    const newItem = todo[i];
    const { item_el } = CreateTodoElement(newItem);
    list.append(item_el);
  }
  count = 0;
  ShowCount(count);
  Save();
});

completedList.addEventListener("click", () => {
  let comList = todo.filter((val) => {
    if (val.complete == true) {
      return val;
    }
  });
  ActionToShow(comList);
});
activeList.addEventListener("click", () => {
  let comList2 = todo.filter((val) => {
    if (val.complete == false) {
      return val;
    }
  });
  ActionToShow(comList2);
});
showAll.addEventListener("click", () => {
  list.innerHTML = "";
  DisplayTodo();
});
clearCompleted.addEventListener("click", () => {
  todo = todo.filter((val) => {
    if (val.complete == false) {
      return val;
    }
  });
  ActionToShow(todo);
  Save();
});
function CancleCaheck(newItm) {
  const { item_el, checkbox_el } = CreateTodoElement(newItm);
  checkbox_el.checked = newItm.complete;
  item_el.prepend(checkbox_el);
  if (checkbox_el.checked == true) {
    item_el.classList.add("complete");
  } else {
    item_el.classList.remove("complete");
  }
  list.append(item_el);
}
function ShowCount(count) {
  if (count < 0) {
    return;
  } else {
    countList.textContent = `${count} items left`;
  }
}
function AllCheckAndCancel() {
  let td = todo.filter((td) => td.complete == true);
  if (td.length == todo.length) {
    allCheck.style.display = "none";
    allCancel.style.display = "inline-block";
  } else {
    allCheck.style.display = "inline-block";
    allCancel.style.display = "none";
  }
}
function ActionToShow(arr) {
  list.innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    const newItem = arr[i];
    const { item_el } = CreateTodoElement(newItem);
    list.append(item_el);
  }
}
