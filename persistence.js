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
  /**
  * Create a table filled with all 2Do lists and theire buttons. 
  */
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
  /**
  * Handels the "select" Button and changes the active list.
  */
  var list = getListForID(this.id);
  console.log("Found: "+list.name);
  updateActiveList(list);
}

function clickDeleteListButton() {
  /**
  * Deletes the list
  */
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
  /**
  * Changes the "activ", this means the selected, list to the parameterd list.
  */
  var activListTable = document.getElementById('activListTable');
  activListTable.innerHTML = "";
  if(list !== null) {
    var menueRow = activListTable.insertRow();
    fillMenueRow(list, menueRow);
    createEntries(list);
  }
}

function createEntries(list) {
  /**
  * Creates rows for the entries of a selected 2DO list
  *
  */
  for (var i in list.entries) {
    var entry = list.entries[i];
    var row = activListTable.insertRow(i);
    if(entry.checked) {
      row.className = entry.checked;
    } else {
      row.className = entry.color;
    }
    var checkEntryCell = row.insertCell();
    checkEntryCell.appendChild(createCheckEntryButton(entry));
    createEntryCell(checkEntryCell, entry);

    var valueCell = row.insertCell();
    valueCell.appendChild(document.createTextNode(entry.value));
    createEntryCell(valueCell, entry);

    if(!entry.hidden) {
      var inputCell = row.insertCell();
      inputCell.appendChild(createInputEntry(inputCell, entry));
    }

    var updateCell = row.insertCell();
    updateCell.appendChild(createUpdateEntryButton(entry));

    var deleteCell = row.insertCell();
    deleteCell.appendChild(createDeleteEntryButton(entry.id));
  }
}

function createEntryCell(cell, entry) {
  cell.id = entry.id;
  cell.addEventListener ('click', clickCheckEntryButton, true);
}

function createCheckEntryButton(entry) {
  var checkEntryButton = document.createElement('input');
  checkEntryButton.type = "checkbox";
  checkEntryButton.checked = entry.checked;
  return checkEntryButton;
}

function createInputEntry(cell, entry) {
  var createInputEntry = document.createElement('input');
  createInputEntry.id = entry.id+"input";
  if(!entry.hidden) {
    createInputEntry.type = "text";
    createInputEntry.value = entry.value;
  }
  return createInputEntry;
}

function createUpdateEntryButton(entry) {
  /**
  * If the update input text field is visible the button get another text.
  */
  var createInputEntryButton = document.createElement('input');
  createInputEntryButton.addEventListener ('click', clickUpdateEntryButton, true);
  createInputEntryButton.id = entry.id;
  createInputEntryButton.type = "submit";
  if(entry.hidden) {
    createInputEntryButton.value = "Update";
  } else {
    createInputEntryButton.value = "Ok";
  }
  return createInputEntryButton;
}

function createDeleteEntryButton(entryID) {
  var deleteEntryButton = document.createElement('input');
  deleteEntryButton.addEventListener ('click', clickDeleteEntryButton, true);
  deleteEntryButton.id = entryID;
  deleteEntryButton.type = "button";
  deleteEntryButton.value = "X";
  return deleteEntryButton;
}

function clickCheckEntryButton() {
  /**
  * Toggels the "Check" Attribut of an entry between true and false
  */
  var entryID = this.id;
  var entry = getEntryForID(entryID);
  console.log("Ready to check Entry: " + entry.id);
  if(entry.checked) {
    entry.checked = false;
  } else {
    entry.checked = true;
  }
  updateAll(getListForID(entry.listID));
}

function clickUpdateEntryButton() {
  /**
  * If the entry wasen´t clickt befor this will make the input field visible
  * Else: Inputfield was visible, we change the value of a entry.
  */
  var entryID = this.id;
  var entry = getEntryForID(entryID);
  if(entry.hidden) {
    entry.hidden = false;
  } else {
    entry.hidden = true;
    var inputValue = document.getElementById(this.id+"input").value;
    entry.value = inputValue;
  }
  updateAll(getListForID(entry.listID));
}

function clickDeleteEntryButton() {
  /**
  * Eventhandling for the delete Entry Button ("X").
  * Updates all when finished
  */
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
  /**
  * Creates a Row in the table with net new Entry Button and Text Input.
  */
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
  chooseListButton.type = "submit";
  chooseListButton.value = "New entry";
  return chooseListButton;
}

function clickNewEntry() {
  /**
  * Eventhandling for the new Entry Button.
  */
  var list = getListForID(this.id);
  var textValue = document.getElementById(this.id+"textEntry").value;
  console.log("New entry for: " +  list.name+" : " + textValue);
  var newEntry = {
    value:textValue,
    id: textValue+getMilliseconds(),
    listID: list.id,
    checked: false,
    color: null,
    hidden: true
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
  return null;
}
