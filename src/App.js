import './App.css';
import _ from 'underscore';
import Body from './Body';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import React from 'react';

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
        <Body
          clearCompletedItems={this.clearCompletedItems}
          collection={this.props.collection}
          toggleAllItemsCompleted={this.toggleAllItemsCompleted} />
      </div>
    );
  }
})

export default App;
