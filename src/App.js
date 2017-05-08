import './App.css';
import _ from 'underscore';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import React from 'react';
import TodoListItem from './TodoListItem';

// Backbone/React Integration
// --------------------------

// Updates React components when their Backbone resources change. Expects the
// component to implement a method called `getResource` that returns an object
// that extends `Backbone.Events`.
const BackboneMixin = {

  // Listen to all events on this component's collection or model and force an
  // update when they fire. Let React decide whether the DOM should change.
  componentDidMount: function() {
    this._boundForceUpdate = this.forceUpdate.bind(this, null);
    this.getResource().on("all", this._boundForceUpdate, this);
  },

  // Clean up the listener when the component will be removed.
  componentWillUnmount: function() {
    this.getResource().off("all", this._boundForceUpdate);
  }

};

// Todo List Component
// -------------------

// Renders a list of todos.
const TodoListComponent = createReactClass({

  propTypes: {
    collection: PropTypes.object.isRequired,
  },

  // Start with no list item in edit mode.
  getInitialState: function() {
    return {
      editingModelId: null
    };
  },

  // When a `TodoListItemComponent` starts editing, it passes its model's ID to
  // this callback. Setting the state triggers this component to re-render and
  // render that `TodoListItemComponent` in edit mode.
  setEditingModelId: function(modelId) {
    this.setState({editingModelId: modelId});
  },

  unsetEditingModelId: function(modelId) {
    if (modelId === this.state.editingModelId) {
      this.setState({editingModelId: null});
    }
  },

  render: function() {
    return (
      <ul id="todo-list">
        {this.props.collection.map(function(model) {
          // Pass the `key` attribute[1] a unique ID so React can track the
          // elements properly.
          //
          // [1] http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
          return (
            <TodoListItem
              editing={this.state.editingModelId === model.id}
              key={model.id}
              model={model}
              onStartEditing={this.setEditingModelId}
              onStopEditing={this.unsetEditingModelId} />
          );
        }, this)}
      </ul>
    );
  }

});

// Footer Component
// ----------------

// The footer shows the total number of todos and how many are completed.
const FooterComponent = createReactClass({

  propTypes: {
    itemsDoneCount: PropTypes.number.isRequired,
    itemsRemainingCount: PropTypes.number.isRequired,
  },

  render: function() {
    var clearCompletedButton;

    // Show the "Clear X completed items" button only if there are completed
    // items.
    if (this.props.itemsDoneCount > 0) {
      clearCompletedButton = (
        <a id="clear-completed" onClick={this.props.clearCompletedItems}>
          Clear {this.props.itemsDoneCount} completed
          {1 === this.props.itemsDoneCount ? " item" : " items"}
        </a>
      );
    }

    // Clicking the "Clear X completed items" button calls the
    // "clearCompletedItems" function passed in on `props`.
    return (
      <footer>
        {clearCompletedButton}
        <div className="todo-count">
          <b>{this.props.itemsRemainingCount}</b>
          {1 === this.props.itemsRemainingCount ? " item" : " items"} left
        </div>
      </footer>
    );
  }

});

// Main Component
// --------------

// The main component contains the list of todos and the footer.
const MainComponent = createReactClass({

  propTypes: {
    clearCompletedItems: PropTypes.func.isRequired,
    collection: PropTypes.object.isRequired,
    toggleAllItemsCompleted: PropTypes.func.isRequired,
  },

  // Tell the **App** to toggle the *done* state of all **Todo** items.
  toggleAllItemsCompleted: function(event) {
    this.props.toggleAllItemsCompleted(event.target.checked);
  },

  render: function() {
    if (0 === this.props.collection.length) {
      // Don't display the "Mark all as complete" button and the footer if there
      // are no **Todo** items.
      return null;
    } else {
      return (
        <section id="main">
          <input id="toggle-all" type="checkbox"
            checked={0 === this.props.collection.remaining().length}
            onChange={this.toggleAllItemsCompleted} />
          <label htmlFor="toggle-all">
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
  }

});

const App = createReactClass({

  propTypes: {
    collection: PropTypes.object.isRequired,
  },

  // Clear all done todo items, destroying their models.
  clearCompletedItems: function() {
    _.invoke(this.props.collection.done(), "destroy");
  },

  // Fetch Todos before the App is rendered to the DOM.
  componentWillMount: function() {
    this.props.collection.fetch();
  },

  // Start the app with a blank `<input>`.
  getInitialState: function() {
    return {
      title: ""
    };
  },

  // Used by the **BackboneMixin** to watch for changes on this component's
  // resource.
  getResource: function() {
    return this.props.collection;
  },

  // Set the state of the title when the `<input>` is changed.
  handleTitleChange: function(event) {
    this.setState({title: event.target.value});
  },

  // If "Enter" is pressed in the main input field, it will submit the form.
  // Create a new **Todo** in *localStorage* and reset the title.
  handleTitleFormSubmit: function(event) {
    event.preventDefault();

    if ("" === this.state.title) return;

    this.props.collection.create({title: this.state.title});
    this.setState({title: ""});
  },

  toggleAllItemsCompleted: function(completed) {
    this.props.collection.each(function(todo) {
      todo.save({"done": completed});
    });
  },

  // Force updates whenever this **App**'s collection receives events.
  mixins: [BackboneMixin],

  render: function() {
    return (
      <div>
        <header>
          <h1>Todos</h1>
          <form onSubmit={this.handleTitleFormSubmit}>
            <input placeholder="What needs to be done?" type="text" name="title"
              onChange={this.handleTitleChange}
              value={this.state.title} />
          </form>
        </header>
        <MainComponent
          clearCompletedItems={this.clearCompletedItems}
          collection={this.props.collection}
          toggleAllItemsCompleted={this.toggleAllItemsCompleted} />
      </div>
    );
  }
})

export default App;
