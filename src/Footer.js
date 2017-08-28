/* @flow */
import './Footer.css';
import React from 'react';

// Footer Component
// ----------------

interface Props {
  clearCompletedItems: (event: SyntheticMouseEvent<HTMLAnchorElement>) => void;
  itemsDoneCount: number;
  itemsRemainingCount: number;
}

// The footer shows the total number of todos and how many are completed.
export default class Footer extends React.Component<Props> {

  render() {
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

}
