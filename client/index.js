document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:5000/getAll') //api call
  .then(response => response.json())
  .then(data => loadHTMLTable(data['data']));
});

//Handle addbuton
const addBtn = document.getElementById("addbtn");
addBtn.onclick = function () {
  const nameInput = document.getElementById("name-input")
  const name = nameInput.value;


  fetch("http:localhost:5000/insert", {
    headers: {
      'Content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({name: name})
  })
  .then(response => response.json())
  .then(data => insertRowIntoTable(data['data']))
  ;

  nameInput.value = "";

}

function insertRowIntoTable(data) {
  const table = document.querySelector('table tbody');
  const isTableEmpty = table.querySelector('.no-data');

  let tableHtml = "<tr>";
  console.log(data);
  // tableHtml += `<td>${data['id']}</td>`;
  tableHtml += `<td>${data['name']}</td>`;
  tableHtml += `<td>${new Date(data['date']).toLocaleString()}</td>`;
  tableHtml += `<td><button class="delete-row-btn" data-id=${data['id']}>Delete</button></td>`;
  tableHtml += `<td><button class="edit-row-btn" data-id=${data['id']}>Edit</button></td>`;
  tableHtml += "</tr>";

  if (isTableEmpty) {
    table.innerHTML = tableHtml;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = tableHtml;
  }

}

//handle delete button
document.querySelector('table tbody').addEventListener('click', function(event){
  if(event.target.className === "delete-row-btn"){
    deleteRowByID(event.target.dataset.id);
  }
  if(event.target.className == "edit-row-btn") {
    handleEditRow(event.target.dataset.id);
  }
});

function deleteRowByID(id) {
    fetch('http:localhost:5000/delete/' + id, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      if(data.success) {
        location.reload();
      }
    })
    ;
}

function handleEditRow(id) {
  const updateView = document.querySelector("#update-section");
  updateView.hidden = false;
  document.querySelector('#update-row-btn').dataset.id = id;
}

const updateBtn = document.getElementById("update-row-btn");
updateBtn.onclick = function() {
  const updatedNameInput = document.querySelector('#update-name-input');
  console.log(updatedNameInput.value);
  fetch('http://localhost:5000/update', {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      id: updateBtn.dataset.id,
      name: updatedNameInput.value,
    })
  })
  .then(response => response.json())
  .then(data => {
    if(data.success) {
    location.reload();
    }
  })
}

const searchBtn = document.getElementById("searchbtn");
searchBtn.onclick = function() {
  const searchName = document.querySelector('#search-input');
  const name = searchName.value;

  fetch("http:localhost:5000/search/" + name)
  .then(response => response.json())
  .then(data => loadHTMLTable(data['data']))
  ;

}





function loadHTMLTable(data) {
  const table = document.querySelector('table tbody');
  console.log(data.length);
  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
  }
  else {
    let tableHtml = "";
    data.forEach(function( {id, name, date}) {
      tableHtml += "<tr>";
      // tableHtml += `<td>${id}</td>`;
      tableHtml += `<td>${name}</td>`;
      tableHtml += `<td>${new Date(date).toLocaleString()}</td>`;
      tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`;
      tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`;;

    });
    table.innerHTML = tableHtml;
  }
}
