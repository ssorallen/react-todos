/** @jsx React.DOM */

var Todo = Backbone.Model.extend({
  defaults: function() {
    return {
      title: "empty todo...",
      order: Todos.nextOrder(),
      done: false
    };
  },
  toggle: function() {
    this.save({done: !this.get("done")});
  }
});

var TodoList = Backbone.Collection.extend({
  localStorage: new Backbone.LocalStorage("todos-backbone"),
  model: Todo,
  done: function() {
    return this.where({done: true});
  },
  remaining: function() {
    return this.where({done: false});
  },
  nextOrder: function() {
    if (!this.length) return 1;
    return this.last().get('order') + 1;
  },
  comparator: 'order'
});

var Todos = new TodoList();

var BackboneMixin = {
  componentDidMount: function() {
    this._boundForceUpdate = this.forceUpdate.bind(this, null);
    this.getBackboneObject().on("all", this._boundForceUpdate, this);
  },
  componentWillUnmount: function() {
    this.getBackboneObject().off("all", this._boundForceUpdate);
  },
  getBackboneObject: function() {
    return this.props.collection || this.props.model;
  }
};

var TodoListItemComponent = React.createClass({
  componentDidUpdate: function() {
    if (this.state.editing) {
      this.refs.editInput.getDOMNode().focus();
    }
  },
  destroy: function() {
    this.props.model.destroy();
  },
  getInitialState: function() {
    return {
      editing: false
    };
  },
  handleEditKeyPress: function(event) {
    if (13 === event.keyCode) {
      this.stopEditing();
    }
  },
  render: function() {
    var inputStyles = {};
    var viewStyles = {};

    if (this.state.editing) {
      viewStyles.display = "none";
    } else {
      inputStyles.display = "none";
    }

    return (
      <li className={this.props.model.get("done") ? "done" : ""}>
        <div className="view" onDoubleClick={this.startEditing} style={viewStyles}>
          <input className="toggle" type="checkbox"
            checked={this.props.model.get("done")}
            onChange={this.toggleDone} />
          <label>{this.props.model.get("title")}</label>
          <a className="destroy" onClick={this.destroy}></a>
        </div>
        <input className="edit" ref="editInput" type="text"
          onBlur={this.stopEditing}
          onChange={this.setTitle}
          onKeyPress={this.handleEditKeyPress}
          style={inputStyles}
          value={this.props.model.get("title")} />
      </li>
    );
  },
  setTitle: function(event) {
    this.props.model.set("title", event.target.value);
  },
  startEditing: function() {
    this.setState({editing: true});
  },
  stopEditing: function() {
    this.setState({editing: false});
  },
  toggleDone: function(event) {
    this.props.model.set("done", $(event.target).is(":checked"));
  }
});

var TodoListComponent = React.createClass({
  render: function() {
    var todoListItems = this.props.collection.map(function(model) {
      return <TodoListItemComponent key={model.id} model={model} />
    });

    return (
      <ul id="todo-list">
        {todoListItems}
      </ul>
    );
  }
});

var FooterComponent = React.createClass({
  render: function() {
    var footerStyles = {};
    if (0 === this.props.itemsDoneCount && 0 === this.props.itemsRemainingCount) {
      footerStyles.display = "none";
    }

    var clearCompletedStyles = {};
    if (0 === this.props.itemsDoneCount) {
      clearCompletedStyles.display = "none";
    }

    return (
      <footer style={footerStyles}>
        <a id="clear-completed" style={clearCompletedStyles}
            onClick={this.props.clearCompletedItems}>
          Clear {this.props.itemsDoneCount} completed
          {1 === this.props.itemsDoneCount ? " item" : " items"}
        </a>
        <div className="todo-count">
          <b>{this.props.itemsRemainingCount}</b>
          {1 === this.props.itemsRemainingCount ? " item" : " items"} left
        </div>
      </footer>
    );
  }
});

var MainComponent = React.createClass({
  toggleAllItemsCompleted: function(event) {
    this.props.toggleAllItemsCompleted(event.target.checked);
  },
  render: function() {
    var toggleAllStyles = {};
    if (this.props.itemsEmpty) {
      toggleAllStyles.display = "none";
    }

    return (
      <section id="main">
        <input id="toggle-all" type="checkbox" style={toggleAllStyles}
          checked={this.props.allItemsCompleted}
          onChange={this.toggleAllItemsCompleted} />
        <label htmlFor="toggle-all" style={toggleAllStyles}>
          Mark all as complete
        </label>
        <TodoListComponent collection={this.props.collection} />
        <FooterComponent
          clearCompletedItems={this.props.clearCompletedItems}
          itemsRemainingCount={this.props.collection.remaining().length}
          itemsDoneCount={this.props.collection.done().length} />
      </section>
    );
  }
});

var AppComponent = React.createClass({
  clearCompletedItems: function() {
    _.each(this.props.collection.done(), function(item) {
      item.destroy();
    });
  },
  componentWillMount: function() {
    this.props.collection.fetch();
  },
  handleKeyPress: function(event) {
    if (13 !== event.keyCode) return;

    var $input = $(event.target);
    if (!$input.val()) return;

    this.props.collection.create({title: $input.val()});
    $input.val("");
  },
  toggleAllItemsCompleted: function(completed) {
    Todos.each(function(todo) {
      todo.save({"done": completed});
    });
  },
  mixins: [BackboneMixin],
  render: function() {
    return (
      <div>
        <header>
          <h1>Todos</h1>
          <input placeholder="What needs to be done?" type="text"
            onKeyPress={this.handleKeyPress} />
        </header>
        <MainComponent
          allItemsCompleted={this.props.collection.remaining().length === 0}
          clearCompletedItems={this.clearCompletedItems}
          collection={this.props.collection}
          itemsEmpty={this.props.collection.length === 0}
          toggleAllItemsCompleted={this.toggleAllItemsCompleted} />
      </div>
    );
  }
})

React.renderComponent(
  <AppComponent collection={Todos} />,
  document.getElementById("todoapp")
);
