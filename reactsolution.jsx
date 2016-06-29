var ListClass = React.createClass({
  getInitialState: function() {
    return {
      inputValue: "",
      all_lists: this.loadLists(),
      selectedList: {id: this.getMilliseconds()+"helloWorld",
        name: "List",
        type: "Standard",
        entries: [
          {id:"1", value:"X"},
          {id:"2", value:"Y"}
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
              return <ListItem list={list} clickSelect={this.clickSelect} clickDelete={this.clickDelete} key={list.id}/>
            }.bind(this))
          }
          </table>
          <hr></hr>
          <ListEntries list={this.state.selectedList}/>
          <EntriesButtons list={this.state.selectedList}/>
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

  clickNewList: function() {
    var listName = this.state.inputValue;
    var listType = this.refs.typeOption.value;
    var newList = {id: this.getMilliseconds()+listName+listType,
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

  clickSelect: function(evt) {
    var id = evt.target.id;
    var list = this.getListForID(id)
    this.setState({selectedList: list});
  },

  clickDelete: function(evt) {
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

  getListForID: function(id) {
    var lists = this.state.all_lists;
    for (var i in lists) {
      if (id === lists[i].id) {
        return lists[i];
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
        <td><input type="button" value="Select" onClick={this.props.clickSelect} id={list.id}></input></td>
        <td><input type="button" value="Delete" onClick={this.props.clickDelete} id={list.id}></input></td>
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
              return <EntryItem entry={entry} key={entry.id} />
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
    return(
      <tr>
      <td>{entry.value}</td>
      </tr>
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
          <td><input type="text"></input></td>
          <td><input type="button" value="New Entry"></input></td>
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
