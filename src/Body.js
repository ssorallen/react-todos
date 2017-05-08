import './Body.css';
import Footer from './Footer';
import PropTypes from 'prop-types';
import React from 'react';
import TodoList from './TodoList';

// Main Component
// --------------

// The main component contains the list of todos and the footer.
export default class Body extends React.Component {

  static propTypes = {
    clearCompletedItems: PropTypes.func.isRequired,
    collection: PropTypes.object.isRequired,
    toggleAllItemsCompleted: PropTypes.func.isRequired,
  };

  // Tell the **App** to toggle the *done* state of all **Todo** items.
  toggleAllItemsCompleted = (event) => {
    this.props.toggleAllItemsCompleted(event.target.checked);
  };

  render() {
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
          <TodoList collection={this.props.collection} />
          <Footer
            clearCompletedItems={this.props.clearCompletedItems}
            itemsRemainingCount={this.props.collection.remaining().length}
            itemsDoneCount={this.props.collection.done().length} />
        </section>
      );
    }
  }

}
