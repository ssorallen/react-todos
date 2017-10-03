/* @flow */
import './TodoListItem.css';
import React from 'react';
import TodoModel from './TodoModel';

// Todo List Item Component
// ------------------------

interface Props {
  editing: boolean;
  model: TodoModel;
  onStartEditing: (modelId: number | string) => void;
  onStopEditing: (modelId: number | string) => void;
}

// The DOM for a todo item...
export default class TodoListItem extends React.Component<Props> {

  _editInput: ?HTMLInputElement;

  // If the component updates and is in edit mode, send focus to the `<input>`.
  componentDidUpdate(prevProps: Props) {
    if (this._editInput != null && this.props.editing && !prevProps.editing) {
      this._editInput.focus();
    }
  }

  // Destroying the model fires a `remove` event on the model's collection,
  // which forces an update and removes this **TodoListItemComponent** from the
  // DOM. We don't have to do any other cleanup!
  destroy = () => {
    this.props.model.destroy();
  };

  // Stop editing if the input gets an "Enter" keypress.
  handleEditKeyPress = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (13 === event.keyCode) {
      this.stopEditing();
    }
  };

  // Set the title of this item's model when the value of the `<input>` changes.
  setTitle = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.props.model.set("title", event.target.value);
  };

  // Tell the parent component this list item is entering edit mode.
  startEditing = () => {
    this.props.onStartEditing(this.props.model.id);
  };

  // Exit edit mode.
  stopEditing = () => {
    this.props.onStopEditing(this.props.model.id);
  };

  toggleDone = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.props.model.set("done", event.target.checked);
  };

  render() {
    var inputStyles = {};
    var viewStyles = {};

    // Hide the `.view` when editing
    if (this.props.editing) {
      viewStyles.display = "none";

    // ... and hide the `<input>` when not editing
    } else {
      inputStyles.display = "none";
    }

    return (
      <li className={this.props.model.get("done") ? "done" : ""}>
        <div className="view" onDoubleClick={this.startEditing} style={viewStyles}>
          <input
            checked={this.props.model.get("done")}
            className="toggle"
            onChange={this.toggleDone}
            type="checkbox"
          />
          <label>{this.props.model.get("title")}</label>
          <a className="destroy" onClick={this.destroy} title="Destroy">
            Destroy
          </a>
        </div>
        <input
          className="edit"
          onBlur={this.stopEditing}
          onChange={this.setTitle}
          onKeyPress={this.handleEditKeyPress}
          ref={ref => { this._editInput = ref; }}
          style={inputStyles}
          type="text"
          value={this.props.model.get("title")}
        />
      </li>
    );
  }

}
