var Lists = React.createClass({
  getInitialState: function() {
    return {
      inputValue: ""
      };
  },

  render: function() {
    return (
      <div className="listdiv">
        {this.createNewListInput()}
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

  clickNewList: function() {
    var listName = this.state.inputValue;
    var listType = this.refs.typeOption.value;
    console.log(listName + " : " + listType);
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
      <div className="commentBox">
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
