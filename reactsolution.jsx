var ListItemWrapper = React.createClass({
  render: function() {
    return <li>{this.props.data.name}</li>;
  }
});

var Lists = React.createClass({
  getInitialState: function() {
    return {
      inputValue: "",
      all_lists: this.loadLists()
      };
  },

  render: function() {
    return (
      <div className="listdiv">
        {this.createNewListInput()}
        <hr></hr>
        {this.showLists()}
      </div>
    );
  },

  handleInputChange: function(evt) {
    this.setState({
      inputValue: evt.target.value
    });
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

  showLists: function() {
    return <ul>
        {this.state.all_lists.map(function(result) {
           return <ListItemWrapper key={result.id} data={result}/>;
        })}
      </ul>;
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
  getMilliseconds: function() {
    return new Date().getTime();
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
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
        <Lists />
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
