start();
var all_lists = [];
var globalID = 0;

function start() {
    var createNewListButton = document.getElementById('createNewListButton');
    createNewListButton.addEventListener ('click', clickShit, true);
}

function clickShit() {
    event.preventDefault();
    var newListName  = document.getElementById('newListName').value;
    var typ = document.getElementById('newListTyp');
    var selectedTyp = typ.options[typ.selectedIndex].value;
    var newID = globalID + 2;
    var list = {
        name:   newListName,
        typ:   selectedTyp,
        id:  newID
    };
    console.log(list.id + " Name: " + list.name + " Typ:" + list.typ);
    all_lists.push(list);
    globalID = newID + 1;
    updateAllListsTable()
}

function updateAllListsTable() {
  var allListsTable = document.getElementById('allListsTable');
  allListsTable.innerHTML = "";
  for (var i in all_lists) {
        var list = all_lists[i];
        var row = allListsTable.insertRow(-1);
        var cell = row.insertCell(0);
        cell.appendChild(document.createTextNode(list.name));
        cell.id = 'cell_name';
  }
}
