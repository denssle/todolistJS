start();
var all_lists = getSavedLists();
var globalID = 0;
var activListID = null;

function start() {
    var createNewListButton = document.getElementById('createNewListButton');
    createNewListButton.addEventListener ('click', clickNewList, true);
    updateAllListsTable();
    console.log("Start done. ")
}

function clickNewList() {
    var newListName  = document.getElementById('newListName').value;
    var typ = document.getElementById('newListTyp');
    var selectedTyp = typ.options[typ.selectedIndex].value;
    var newID = globalID + 2;
    var list = {
        name:   newListName,
        typ:   selectedTyp,
        id:  newID+selectedTyp+newListName,
        entries: {}
    };
    console.log("Create: " + list.id + " Name: " + list.name + " Typ:" + list.typ);
    all_lists.push(list);
    saveLists();
    globalID = newID + 1;
    updateAllListsTable();
}

function saveLists() {
  localStorage.setItem("todokey", JSON.stringify(all_lists));
}

function getSavedLists() {
  var data = [];
  var string = localStorage.getItem("todokey");
  if (string !== null) {
    data = JSON.parse(string);
  } else {
    console.log("No local Storage found. ")
  }
  return data;
}

function updateAllListsTable() {
  all_lists = getSavedLists();
  var allListsTable = document.getElementById('allListsTable');
  allListsTable.innerHTML = "";
  for (var i in all_lists) {
        var list = all_lists[i];
        console.log(list.name + " " + list.id);
        if (typeof list.id != "undefined"){
          var row = allListsTable.insertRow(-1);
          var name_cell = row.insertCell(0);
          name_cell.appendChild(document.createTextNode(list.name));
          name_cell.id = list.id;
          var button_cell = row.insertCell(1);
          button_cell.appendChild(createChooseListButton(list.id));
        } else {
          console.log(list);
        }
  }
}

function createChooseListButton(listID) {
  var chooseListButton = document.createElement('input');
  chooseListButton.addEventListener ('click', clickChooseListButton, true);
  chooseListButton.id = listID;
  chooseListButton.type = "button";
  chooseListButton.value = "Text";
  return chooseListButton;
}

function clickChooseListButton() {
  var list = getListForID(this.id);
  console.log("Found: "+list.name);
  updateActiveList(list);
}

function updateActiveList(list) {
  activListID = list.id;
  var activListP = document.createElement('activListP');
  activListP.innerHTML = list.name;
}

function getListForID(id) {
  for (var i in all_lists) {
    if (id === all_lists[i].id) {
      return all_lists[i];
    }
  }
  return null;
}
