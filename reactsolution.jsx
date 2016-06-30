var ListClass = React.createClass({
  getInitialState: function() {
    return {
      inputValue: "",
      all_lists: this.loadLists(),
      changedEntries: {},
      selectedList: {id: this.getMilliseconds()+"helloWorld",
        name: "List",
        type: "standard",
        entries: [
          {id:this.getMilliseconds()+"X",
            value:"X",
            checked:true,
            deadline: "-",
            hidden: true,
            color: null},
          {id:this.getMilliseconds()+"Y",
            value:"Y",
            checked:false,
            deadline: "-",
            hidden: true,
            color:null},
          {id:this.getMilliseconds()+"Z",
            value:"Z",
            checked:false,
            deadline: "-",
            hidden: true,
            color:null}
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
      <div className="listdiv">
        {this.createNewListInput()}
        <hr></hr>
          <table>
          {
            this.state.all_lists.map(function(list) {
              return <ListItem list={list} clickSelectListe={this.clickSelectListe} clickDeleteListe={this.clickDeleteListe} key={list.id}/>
            }.bind(this))
          }
          </table>
          <hr></hr>
          <ListEntries
            list={this.state.selectedList}
            clickUpdateEntry={this.clickUpdateEntry}
            clickDeleteEntry={this.clickDeleteEntry}
            clickCheckBox={this.clickCheckBox}
            handleEntryChange={this.handleEntryChange}/>
          <EntriesButtons list={this.state.selectedList} clickNewEntry={this.clickNewEntry} />
      </div>
    );
  },

  createNewListInput: function() {
    return <form id="newListForm">
      <label>New List:
      <input type="text" value={this.state.value} onChange={this.handleInputChange}></input>
        <select ref="typeOption">
          <option value="standard">Standard</option>
          <option value="deadline">Deadline</option>
          <option value="colored">Colored</option>
        </select>
      <input type="submit" id="createNewListButton" value="Create new list" onClick={this.clickNewList}></input>
      </label>
    </form>;
    },

  handleInputChange: function(evt) {
    this.setState({inputValue: evt.target.value});
  },

  handleEntryChange: function(evt) {
    var id = evt.target.id;
    var value = evt.target.value;
    var entriesMap = this.state.changedEntries;
    entriesMap[id] = value;
    this.setState({changedEntries: entriesMap});
  },

  clickNewList: function() {
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
    var id = evt.target.id;
    var list = this.getListForID(id)
    this.setState({selectedList: list});
  },

  clickDeleteListe: function(evt) {
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
    var list = this.state.selectedList;
    var inputValue = document.getElementById(list.id+"text").value;
    console.log(inputValue);
    var newEnty = {
      id:this.getMilliseconds()+"id"+inputValue,
      value: inputValue,
      checked:false,
      hidden:true,
      deadline: "-",
      color:null
    };
    list.entries.push(newEnty);
    this.setState({selectedList: list});
  },

  clickUpdateEntry: function(evt) {
    var id = evt.target.id;
    var list = this.state.selectedList;
    var type = list.type;
    var index = this.getEntryForID(list.entries, id);
    var entry = list.entries[index];
    if(entry.hidden) {
      entry.hidden = false;
    } else {
      var entriesMap = this.state.changedEntries;
      var value = entriesMap[id];
      entry.value = value;
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
    console.log(evt);
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
        clickDeleteEntry={this.props.clickDeleteEntry}/>);
    }
    if(type === "deadline") {
      return (<DeadlineItem entry={entry}
        key={entry.id}
        clickUpdateEntry={this.props.clickUpdateEntry}
        clickDeleteEntry={this.props.clickDeleteEntry}/>);
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
          <td>{entry.value}</td>
          <EntryUpdateButton clickUpdateEntry={this.props.clickUpdateEntry} id={entry.id}/>
          <EntryDeleteButton clickDeleteEntry={this.props.clickDeleteEntry} id={entry.id}/>
        </tr>
      );
    } else {
      return (
        <tr>
          <td><input type="checkbox" defaultChecked={entry.checked} onClick={this.props.clickCheckBox} id={entry.id}></input></td>
          <td><input type="text" onChange={this.props.handleEntryChange} id={entry.id} defaultValue={entry.value}></input></td>
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
    return (
      <tr>
        <td>{entry.value}</td>
        <td>{entry.color}</td>
        <EntryUpdateButton clickUpdateEntry={this.props.clickUpdateEntry} id={entry.id}/>
        <EntryDeleteButton clickDeleteEntry={this.props.clickDeleteEntry} id={entry.id}/>
      </tr>
    );
  }
});

var DeadlineItem = React.createClass({
  render: function() {
    var entry = this.props.entry;
    return (
      <tr>
        <td>{entry.value}</td>
        <td>{entry.deadline}</td>
        <EntryUpdateButton onClick={this.props.clickUpdateEntry} id={entry.id}/>
        <EntryDeleteButton onClick={this.props.clickDeleteEntry} id={entry.id}/>
      </tr>
    );
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
