start();
var all_lists = getSavedLists();

function start() {
    var createNewListButton = document.getElementById('createNewListButton');
    createNewListButton.addEventListener ('click', clickNewList, true);
    updateAllListsTable();
    console.log("Start done. ")
}

function updateAll(list) {
  saveLists();
  updateAllListsTable();
  updateActiveList(list);
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
    var list = {
        name:   newListName,
        typ:   selectedTyp,
        id:  selectedTyp+newListName+getMilliseconds(),
        entries: new Array
    };
    console.log("Create: " + list.id + " Name: " + list.name + " Typ:" + list.typ);
    all_lists.push(list);
    updateAll(null);
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
          var chooseListCell = row.insertCell(1);
          chooseListCell.appendChild(createChooseListButton(list.id));
          var deleteListCell = row.insertCell(2);
          deleteListCell.appendChild(createDeleteListButton(list.id));
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

function createDeleteListButton(listID) {
  var delteteListeButton = document.createElement('input');
  delteteListeButton.addEventListener ('click', clickDeleteListButton, true);
  delteteListeButton.id = listID;
  delteteListeButton.type = "button";
  delteteListeButton.value = "Delete";
  return delteteListeButton;
}

function clickChooseListButton() {
  var list = getListForID(this.id);
  console.log("Found: "+list.name);
  updateActiveList(list);
}

function clickDeleteListButton() {
  var list = getListForID(this.id);
  console.log("Ready to delete: "+list.name);
  var deleteIndex = null;
  for (var i in all_lists) {
    if (list.id === all_lists[i].id) {
      deleteIndex = i;
    }
  }
  if (deleteIndex !== null) {
    all_lists.splice(deleteIndex, 1);
    updateAll(null);
  }
}

function updateActiveList(list) {
  var activListTable = document.getElementById('activListTable');
  activListTable.innerHTML = "";
  if(list !== null) {
    var menueRow = activListTable.insertRow();
    fillMenueRow(list, menueRow);

    //create entries
    for (var i in list.entries) {
      var entry = list.entries[i];
      console.log("debug " + entry.id)
      var row = activListTable.insertRow(i);
      var deleteCell = row.insertCell();
      deleteCell.appendChild(createDeleteEntryButton(entry.id));
      var valueCell = row.insertCell();
      valueCell.appendChild(document.createTextNode(entry.value));
    }
  }
}

function createDeleteEntryButton(entryID) {
  var delteteEntryButton = document.createElement('input');
  delteteEntryButton.addEventListener ('click', clickDeleteEntryButton, true);
  delteteEntryButton.id = entryID;
  delteteEntryButton.type = "button";
  delteteEntryButton.value = "X";
  return delteteEntryButton;
}

function clickDeleteEntryButton() {
  var entryID = this.id;
  var entry = getEntryForID(entryID);
  var list = getListForID(entry.listID)
  console.log("Ready to delete Entry: " + entry.id + " from " + list.name);
  for(var i in list.entries) {
    if(entry.id === list.entries[i].id) {
      list.entries.splice(i, 1);
    }
  }
  updateAll(list);
}

function fillMenueRow(list, menueRow) {
  var listNameCell = menueRow.insertCell();
  listNameCell.appendChild(document.createTextNode(list.name));
  var newEntryTextInputCell = menueRow.insertCell();
  newEntryTextInputCell.appendChild(createEntryTextInput(list.id));
  var newEntryButtonCell = menueRow.insertCell();
  newEntryButtonCell.appendChild(createEntryButton(list.id));
  //TODO: Rename list and delete list
}

function createEntryTextInput(listID) {
  var chooseListButton = document.createElement('input');
  chooseListButton.id = listID+"textEntry";
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
  var textValue = document.getElementById(this.id+"textEntry").value;
  console.log("New entry for: " +  list.name+" : " + textValue);
  var newEntry = {
    value:textValue,
    id: textValue+getMilliseconds(),
    listID: list.id
    };
  list.entries.push(newEntry);
  updateAll(list);
}

function getListForID(id) {
  for (var i in all_lists) {
    if (id === all_lists[i].id) {
      return all_lists[i];
    }
  }
  return null;
}

function getEntryForID(id) {
  for (var i in all_lists) {
    var entries = all_lists[i].entries;
    for (var j in entries) {
      if (id === entries[j].id) {
        return entries[j];
      }
    }
  }
}
