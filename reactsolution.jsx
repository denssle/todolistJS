var ListClass = React.createClass({
  getInitialState: function() {
    return {
      inputValue: "",
      all_lists: this.loadLists(),
      changedEntries: {},
      selectedList: {id: this.getMilliseconds()+"helloWorld",
        name: "Probeaufgabe",
        type: "standard",
        entries: [
          {id:this.getMilliseconds()+"X",
            name:"Probeaufgabe ausgegeben",
            checked:true,
            deadline: "-",
            hidden: true,
            color: "Black "},
          {id:this.getMilliseconds()+"Y",
            name:"Probeaufgabe kontrolliert",
            checked:false,
            deadline: "-",
            hidden: true,
            color: "Black "},
          {id:this.getMilliseconds()+"Z",
            name:"Dominik eingestellt",
            checked:false,
            deadline: "-",
            hidden: true,
            color: "Black "}
        ]}
      };
  },

  saveLists: function() {
    localStorage.setItem("react_2do_key", JSON.stringify(this.state.all_lists));
  },

  loadLists: function() {
    var data = [];
    var string = localStorage.getItem("react_2do_key");
    if (string !== null) {
      data = JSON.parse(string);
    } else {
      console.log("No local Storage found. ")
    }
    return data;
  },

  render: function() {
    this.saveLists();
    return (
      <div className="innerbox">
        <br />
        {this.createNewListInput()}
        <br />
        <hr />
        <br />
        <table>
        {
          this.state.all_lists.map(function(list) {
            return <ListItem list={list} clickSelectListe={this.clickSelectListe} clickDeleteListe={this.clickDeleteListe} key={list.id}/>
          }.bind(this))
        }
        </table>
        <br />
        <hr />
        <br />
        <ListEntries
          list={this.state.selectedList}
          clickUpdateEntry={this.clickUpdateEntry}
          clickDeleteEntry={this.clickDeleteEntry}
          clickCheckBox={this.clickCheckBox}
          handleEntryChange={this.handleEntryChange}/>
        <EntriesButtons list={this.state.selectedList} clickNewEntry={this.clickNewEntry} />
        <br />
      </div>
    );
  },

  createNewListInput: function() {
    /**
    * Builds the "create new list" row
    */
    return (
      <form id="newListForm">
        <label>New List:
        <input type="text" value={this.state.value} onChange={this.handleInputChange}></input>
          <select ref="typeOption">
            <option value="standard">Standard</option>
            <option value="deadline">Deadline</option>
            <option value="colored">Colored</option>
          </select>
        <input type="submit" id="createNewListButton" value="Create new list" onClick={this.clickNewList}></input>
        </label>
      </form>
    );
    },

  handleInputChange: function(evt) {
    this.setState({inputValue: evt.target.value});
  },

  handleEntryChange: function(evt) {
    /**
    * Saves the changes of entries in a map; key is the id of the entry, witch has chaneged.
    */
    var id = evt.target.id;
    var value = evt.target.value;
    var entriesMap = this.state.changedEntries;
    entriesMap[id] = value;
    this.setState({changedEntries: entriesMap});
  },

  clickNewList: function() {
    /*
    * Handles the "Create new list" button
    */
    var listName = this.state.inputValue;
    var listType = this.refs.typeOption.value;
    var newList = {
      id: this.getMilliseconds()+listName+listType,
      name: listName,
      type: listType,
      entries: []};
    var allLists = this.state.all_lists;
    allLists.push(newList);
    this.setState({all_lists: allLists});
    this.saveLists();
  },

  getMilliseconds: function() {
    return new Date().getTime();
  },

  clickSelectListe: function(evt) {
    /*
    * Handles the "Select" Button, sets the selectedList.
    */
    var id = evt.target.id;
    var list = this.getListForID(id)
    this.setState({selectedList: list});
  },

  clickDeleteListe: function(evt) {
    /*
    * Handles the "Delete" Button for Lists.
    */
    var id = evt.target.id;
    var list = this.getListForID(id)
    var deleteIndex = null;
    var allLists = this.state.all_lists;

    for (var i in allLists) {
      if (list.id === allLists[i].id) {
        deleteIndex = i;
      }
    }
    if (deleteIndex !== null) {
      allLists.splice(deleteIndex, 1);
    }
    this.setState({all_lists: allLists});
    this.saveLists();
  },

  clickNewEntry: function(evt) {
    /*
    * Create a new entry for the selectedList.
    */
    var list = this.state.selectedList;
    var inputValue = document.getElementById(list.id+"text").value;
    console.log("New entry: "+inputValue);
    var newEnty = {
      id:this.getMilliseconds()+"id"+inputValue,
      name: inputValue,
      checked:false,
      hidden:true,
      deadline: "-",
      color: "Black "
    };
    list.entries.push(newEnty);
    this.setState({selectedList: list});
  },

  clickUpdateEntry: function(evt) {
    /*
    * Make a entry ready to update (hidden = false) or updates an entry.
    */
    var id = evt.target.id;
    var list = this.state.selectedList;
    var type = list.type;
    var index = this.getEntryForID(list.entries, id);
    var entry = list.entries[index];
    if(entry.hidden) {
      entry.hidden = false;
    } else {
      var entriesMap = this.state.changedEntries;
      var valueInput = entriesMap[id+"name"];
      var deadlineInput = entriesMap[id+"deadline"];
      var colorInput = entriesMap[id+"color"];
      entry.name = valueInput;
      entry.deadline = deadlineInput;
      entry.color = colorInput;
      entry.hidden = true;
    }
    list.entries[index] = entry;
    this.setState({selectedList: list});
  },

  clickDeleteEntry: function(evt) {
    var id = evt.target.id;
    var list = this.state.selectedList;
    var entriesList = list.entries;
    var deleteIndex = this.getEntryForID(entriesList, id);
    if (deleteIndex !== null) {
      entriesList.splice(deleteIndex, 1);
    }
    list.entries = entriesList;
    this.setState({selectedList: list});
  },

  clickCheckBox: function(evt) {
    var id = evt.target.id;
    var list = this.state.selectedList;
    var entriesList = list.entries;
    var index = this.getEntryForID(entriesList, id);
    var entry = list.entries[index];
    if(entry.checked) {
      entry.checked = false;
    } else {
      entry.checked = true;
    }
    list.entries = entriesList;
    this.setState({selectedList: list});
  },

  getListForID: function(id) {
    var lists = this.state.all_lists;
    for (var i in lists) {
      if (id === lists[i].id) {
        return lists[i];
      }
    }
    return null;
  },

  getEntryForID: function(list, id) {
    for(var i in list) {
      if(id === list[i].id) {
        return i;
      }
    }
    return null;
  }
});

var ListItem = React.createClass({
  /*
  * Class for a ListItem.
  */
  render: function() {
    var list = this.props.list;
    return(
      <tbody>
      <tr>
        <th>{list.name}</th>
        <td>{list.type}</td>
        <td><input type="button" value="Select" onClick={this.props.clickSelectListe} id={list.id}></input></td>
        <td><input type="button" value="Delete" onClick={this.props.clickDeleteListe} id={list.id}></input></td>
      </tr>
      </tbody>)
  }
});

var ListEntries = React.createClass({
  /*
  * Class for the entries
  */
  render: function() {
    var selectedList = this.props.list;
    return(
      <table>
        <thead>
        <tr>
          <th>{selectedList.name}</th>
          <td>{selectedList.type}</td>
        </tr>
      </thead>
      <tbody>
          {
            selectedList.entries.map(function(entry) {
              return <EntryItem
                entry={entry}
                key={entry.id}
                clickUpdateEntry={this.props.clickUpdateEntry}
                clickDeleteEntry={this.props.clickDeleteEntry}
                clickCheckBox={this.props.clickCheckBox}
                type = {selectedList.type}
                handleEntryChange={this.props.handleEntryChange}/>
            }.bind(this))
          }
      </tbody>
    </table>
    );
  }
});

var EntryItem = React.createClass({
  /*
  * Depending on the listType, this class build other entries.
  */
  render: function() {
    var entry = this.props.entry;
    var type = this.props.type;
    if(type === "standard"){
      return (<StandardEntry entry={entry}
        key={entry.id}
        clickUpdateEntry={this.props.clickUpdateEntry}
        clickDeleteEntry={this.props.clickDeleteEntry}
        clickCheckBox={this.props.clickCheckBox}
        handleEntryChange={this.props.handleEntryChange}/>);
    }
    if(type === "colored") {
      return (<ColoredItem entry={entry}
        key={entry.id}
        clickUpdateEntry={this.props.clickUpdateEntry}
        clickDeleteEntry={this.props.clickDeleteEntry}
        clickCheckBox={this.props.clickCheckBox}
        handleEntryChange={this.props.handleEntryChange}/>);
    }
    if(type === "deadline") {
      return (<DeadlineItem entry={entry}
        key={entry.id}
        clickUpdateEntry={this.props.clickUpdateEntry}
        clickDeleteEntry={this.props.clickDeleteEntry}
        clickCheckBox={this.props.clickCheckBox}
        handleEntryChange={this.props.handleEntryChange}/>);
    }
    return null;
  }
});

var StandardEntry = React.createClass({
  render: function() {
    var entry = this.props.entry;
    if(entry.hidden) {
      return(
        <tr>
          <td><input type="checkbox" defaultChecked={entry.checked} onClick={this.props.clickCheckBox} id={entry.id}></input></td>
          <td>{entry.name}</td>
          <EntryUpdateButton clickUpdateEntry={this.props.clickUpdateEntry} id={entry.id}/>
          <EntryDeleteButton clickDeleteEntry={this.props.clickDeleteEntry} id={entry.id}/>
        </tr>
      );
    } else {
      return (
        <tr>
          <td><input type="checkbox" defaultChecked={entry.checked} onClick={this.props.clickCheckBox} id={entry.id}></input></td>
          <td><input type="text" onChange={this.props.handleEntryChange} id={entry.id+"name"} defaultValue={entry.name}></input></td>
          <td><input type="button" value="Ok" onClick={this.props.clickUpdateEntry} id={entry.id}></input></td>
          <EntryDeleteButton clickDeleteEntry={this.props.clickDeleteEntry} id={entry.id}/>
        </tr>
      );
    }
  }
});

var ColoredItem = React.createClass({
  render: function() {
    var entry = this.props.entry;
    var style = {color: entry.color};
    if(entry.hidden) {
      return(
        <tr style={style}>
          <td><input type="checkbox" defaultChecked={entry.checked} onClick={this.props.clickCheckBox} id={entry.id}></input></td>
          <td>{entry.name}</td>
          <EntryUpdateButton clickUpdateEntry={this.props.clickUpdateEntry} id={entry.id}/>
          <EntryDeleteButton clickDeleteEntry={this.props.clickDeleteEntry} id={entry.id}/>
        </tr>);
      } else {
        return(
          <tr style={style}>
            <td><input type="checkbox" defaultChecked={entry.checked} onClick={this.props.clickCheckBox} id={entry.id}></input></td>
            <td><input type="text" onChange={this.props.handleEntryChange} id={entry.id+"name"} defaultValue={entry.name}></input></td>
             <td>
              <select onChange={this.props.handleEntryChange} id={entry.id+"color"}>
                <option value="Black">Black</option>
                <option value="Green">Green</option>
                <option value="Blue">Blue</option>
                <option value="Yellow">Yellow</option>
                <option value="Red">Red</option>
              </select>
            </td>
            <td><input type="button" value="Ok" onClick={this.props.clickUpdateEntry} id={entry.id}></input></td>
            <EntryDeleteButton clickDeleteEntry={this.props.clickDeleteEntry} id={entry.id}/>
          </tr>);
      }
  }
});

var DeadlineItem = React.createClass({
  //name={entry.deadline}
  render: function() {
    var entry = this.props.entry;
    if(entry.hidden) {
      return(
        <tr>
          <td><input type="checkbox" defaultChecked={entry.checked} onClick={this.props.clickCheckBox} id={entry.id}></input></td>
          <td>{entry.name}</td>
          <td>{entry.deadline}</td>
          <EntryUpdateButton clickUpdateEntry={this.props.clickUpdateEntry} id={entry.id}/>
          <EntryDeleteButton clickDeleteEntry={this.props.clickDeleteEntry} id={entry.id}/>
        </tr>
      );
    } else {
      return (
        <tr>
          <td><input type="checkbox" defaultChecked={entry.checked} onClick={this.props.clickCheckBox} id={entry.id}></input></td>
          <td><input type="text" onChange={this.props.handleEntryChange} id={entry.id+"name"} defaultValue={entry.name}></input></td>
          <td><input type="date" onChange={this.props.handleEntryChange} id={entry.id+"deadline"} ng-model="string"></input></td>
          <td><input type="button" value="Ok" onClick={this.props.clickUpdateEntry} id={entry.id}></input></td>
          <EntryDeleteButton onClick={this.props.clickDeleteEntry} id={entry.id}/>
          </tr>
      );
    }
  }
});

var EntryUpdateButton = React.createClass({
  render: function() {
    return(
      <td><input type="button" value="Update" onClick={this.props.clickUpdateEntry} id={this.props.id}></input></td>
    );
  }
});

var EntryDeleteButton = React.createClass({
  render: function() {
    return(
      <td><input type="button" value="X" onClick={this.props.clickDeleteEntry} id={this.props.id}></input></td>
    );
  }
});

var EntriesButtons = React.createClass({
  /*
  * The last line, here are the input fields to create new entries.
  */
  render: function() {
    var list = this.props.list;
    return(
      <table>
        <tbody>
        <tr>
          <td><input type="text" id={list.id+"text"}></input></td>
          <td><input type="submit" value="New Entry" onClick={this.props.clickNewEntry}></input></td>
        </tr>
      </tbody>
      </table>
    );
  }
});

ReactDOM.render(
  <ListClass />,
  document.getElementById('content')
);
