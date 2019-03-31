/* @flow */

import './TodoListItem.css';
import * as React from 'react';
import type { Todo } from './Types';

// Todo List Item Component
// ------------------------

type Props = {
  editing: boolean,
  onDestroy: () => void,
  onSetTitle: (title: string) => void,
  onStartEditing: () => void,
  onStopEditing: () => void,
  onToggleCompleted: (done: boolean) => void,
  todo: Todo,
};

export default function TodoListItem(props: Props) {
  const inputEl = React.createRef();

  function setTitleAndStopEditing() {
    if (inputEl.current != null) props.onSetTitle(inputEl.current.value);
    props.onStopEditing();
  }

  // // Stop editing if the input gets an "Enter" keypress.
  function handleEditKeyPress(event: SyntheticKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      setTitleAndStopEditing();
    }
  }

  return (
    <li className={props.todo.done ? 'done' : null}>
      {props.editing ? (
        <input
          autoFocus
          className="edit"
          defaultValue={props.todo.title}
          onBlur={setTitleAndStopEditing}
          onKeyPress={handleEditKeyPress}
          ref={inputEl}
          type="text"
        />
      ) : (
        <div className="view" onDoubleClick={props.onStartEditing}>
          <input
            checked={props.todo.done}
            className="toggle"
            onChange={props.onToggleCompleted}
            type="checkbox"
          />
          <label>{props.todo.title}</label>
          <a className="destroy" onClick={props.onDestroy} title="Destroy">
            Destroy
          </a>
        </div>
      )}
    </li>
  );
}
