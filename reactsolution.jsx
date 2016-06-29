var ListClass = React.createClass({
  getInitialState: function() {
    return {
      inputValue: "",
      all_lists: this.loadLists()
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
    return (
      <div className="listdiv">
        {this.createNewListInput()}
        <hr></hr>
          <table>
          {
            this.state.all_lists.map(function(list) {
              return <ListItem list={list} />
            }.bind(this))
          }
          </table>
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
      <input type="button" id="createNewListButton" value="Create new list" onClick={this.clickNewList}></input>
      </label>
    </form>;
    },

  handleInputChange: function(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  },

  clickNewList: function() {
    var listName = this.state.inputValue;
    var listType = this.refs.typeOption.value;
    var newList = {id: this.getMilliseconds()+listName+listType, name: listName, type: listType, entries: {}};
    var allLists = this.state.all_lists;
    allLists.push(newList);
    console.log(newList.name + " : " + newList.type);
    console.log(allLists);
    this.saveLists();
  },

  getMilliseconds: function() {
    return new Date().getTime();
  }
});

var ListItem = React.createClass({
  render: function() {
    var list = this.props.list;
    return(
      <tr>
        <th>{list.name}</th>
        <td>{list.type}</td>
        <td><input type="button" value="Select" onClick={this.clickSelect}></input></td>
        <td><input type="button" value="Delete"onClick={this.clickDelete} ></input></td>
    </tr>)
  },
  clickSelect: function() {
    console.log(this.props.list.id);
  },
  clickDelete: function() {
    console.log(this.props.list.id);
  }
});

var Entries = React.createClass({
  render: function() {
    return (
      <div className="entriesdiv">
        Entries here
      </div>
    );
  }
});

var App = React.createClass({
  render: function() {
    return (
      <div className="todolist">
        <ListClass />
        <hr></hr>
        <Entries />
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('content')
);
