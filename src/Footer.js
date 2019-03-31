/* @flow */

import './Footer.css';
import * as React from 'react';

// Footer Component
// ----------------

type Props = {
  clearCompletedItems: (event: SyntheticMouseEvent<HTMLAnchorElement>) => void,
  itemsDoneCount: number,
  itemsRemainingCount: number,
};

// The footer shows the total number of todos and how many are completed.
export default function Footer(props: Props) {
  let clearCompletedButton;

  // Show the "Clear X completed items" button only if there are completed
  // items.
  if (props.itemsDoneCount > 0) {
    clearCompletedButton = (
      <a id="clear-completed" onClick={props.clearCompletedItems}>
        Clear {props.itemsDoneCount} completed
        {1 === props.itemsDoneCount ? ' item' : ' items'}
      </a>
    );
  }

  // Clicking the "Clear X completed items" button calls the
  // "clearCompletedItems" function passed in on `props`.
  return (
    <footer>
      {clearCompletedButton}
      <div className="todo-count">
        <b>{props.itemsRemainingCount}</b>
        {1 === props.itemsRemainingCount ? ' item' : ' items'} left
      </div>
    </footer>
  );
}
