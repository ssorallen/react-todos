import './App.css';
import _ from 'underscore';
import Body from './Body';
import PropTypes from 'prop-types';
import React from 'react';
import { connectBackboneToReact } from 'connect-backbone-to-react';
import createReactClass from 'create-react-class';

// Backbone/React Integration
// --------------------------

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
        <Body
          clearCompletedItems={this.clearCompletedItems}
          collection={this.props.collection}
          toggleAllItemsCompleted={this.toggleAllItemsCompleted} />
      </div>
    );
  }
})

const mapModelsToProps = (models) => ({
  collection: models.todos,
});

export default connectBackboneToReact(mapModelsToProps)(App);
