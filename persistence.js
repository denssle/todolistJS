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

function getMilliseconds() {
  /**
  * Return the number of milliseconds since 1970/01/01;
  * makes IDs more unique.
  */
  var d = new Date();
  return n = d.getTime();
}

function clickNewList() {
  /**
  * Eventhandling for the "create new list" button;
  * creates a new list object and saves it in the localStorage.
  */
    var newListName  = document.getElementById('newListName').value;
    var typ = document.getElementById('newListTyp');
    var selectedTyp = typ.options[typ.selectedIndex].value;
    var newID = globalID + 2;
    var list = {
        name:   newListName,
        typ:   selectedTyp,
        id:  newID+selectedTyp+newListName+getMilliseconds(),
        entries: {}
    };
    console.log("Create: " + list.id + " Name: " + list.name + " Typ:" + list.typ);
    all_lists.push(list);
    saveLists();
    globalID = newID + 1;
    updateAllListsTable();
}

function saveLists() {
  /**
  * Saves all lists in the localStorage.
  */
  localStorage.setItem("todokey", JSON.stringify(all_lists));
}

function getSavedLists() {
  /**
  * Returns either a empty array or the datas from the localStorage.
  */
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
  chooseListButton.value = "Select";
  return chooseListButton;
}

function clickChooseListButton() {
  var list = getListForID(this.id);
  console.log("Found: "+list.name);
  updateActiveList(list);
}

function updateActiveList(list) {
  activListID = list.id;
  var activListTable = document.getElementById('activListTable');
  activListTable.innerHTML = "";
  var firstRow = activListTable.insertRow(-1);
  var listNameCell = firstRow.insertCell();
  var newEntryTextInputCell = firstRow.insertCell();
  newEntryTextInputCell.appendChild(createEntryTextInput(list.id));
  var newEntryButtonCell = firstRow.insertCell();
  newEntryButtonCell.appendChild(createEntryButton(list.id));

  //Show entries
  for (var i in list.entries) {
    var entry = list.entries[i];
    var row = allListsTable.insertRow(-1);
    var cell = row.insertCell(0);
  }
}

function createEntryTextInput(listID) {
  var chooseListButton = document.createElement('input');
  chooseListButton.id = listID;
  chooseListButton.type = "text";
  return chooseListButton;
}

function createEntryButton(listID) {
  var chooseListButton = document.createElement('input');
  chooseListButton.addEventListener ('click', clickNewEntry, true);
  chooseListButton.id = listID;
  chooseListButton.type = "button";
  chooseListButton.value = "Erstellen";
  return chooseListButton;
}

function clickNewEntry() {
  var list = getListForID(this.id);
  console.log("New entry for: " +  list.name);
}

function getListForID(id) {
  for (var i in all_lists) {
    if (id === all_lists[i].id) {
      return all_lists[i];
    }
  }
  return null;
}
