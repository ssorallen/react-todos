import './App.css';
import _ from 'underscore';
import Body from './Body';
import PropTypes from 'prop-types';
import React from 'react';
import { connectBackboneToReact } from 'connect-backbone-to-react';

class App extends React.Component {

  static propTypes = {
    collection: PropTypes.object.isRequired,
  };

  // Start the app with a blank `<input>`.
  constructor(props) {
    super(props);
    this.state = {
      title: "",
    };
  }

  // Fetch Todos before the App is rendered to the DOM.
  componentWillMount() {
    this.props.collection.fetch();
  }

  // Clear all done todo items, destroying their models.
  clearCompletedItems = () => {
    _.invoke(this.props.collection.done(), "destroy");
  };

  // Set the state of the title when the `<input>` is changed.
  handleTitleChange = (event) => {
    this.setState({title: event.target.value});
  };

  // If "Enter" is pressed in the main input field, it will submit the form.
  // Create a new **Todo** in *localStorage* and reset the title.
  handleTitleFormSubmit = (event) => {
    event.preventDefault();

    if ("" === this.state.title) return;

    this.props.collection.create({title: this.state.title});
    this.setState({title: ""});
  };

  toggleAllItemsCompleted = (completed) => {
    this.props.collection.each(function(todo) {
      todo.save({"done": completed});
    });
  };

  render() {
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
}

// Backbone/React Integration
// --------------------------

const mapModelsToProps = (models) => ({
  collection: models.todos,
});

export default connectBackboneToReact(mapModelsToProps)(App);
