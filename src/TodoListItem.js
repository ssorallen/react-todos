import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

// Todo List Item Component
// ------------------------

// The DOM for a todo item...
export default class TodoListItem extends React.Component {

  static propTypes = {
    editing: PropTypes.bool.isRequired,
    model: PropTypes.object.isRequired,
    onStartEditing: PropTypes.func.isRequired,
    onStopEditing: PropTypes.func.isRequired,
  };

  // If the component updates and is in edit mode, send focus to the `<input>`.
  componentDidUpdate(prevProps) {
    if (this.props.editing && !prevProps.editing) {
      ReactDOM.findDOMNode(this.refs.editInput).focus();
    }
  }

  // Destroying the model fires a `remove` event on the model's collection,
  // which forces an update and removes this **TodoListItemComponent** from the
  // DOM. We don't have to do any other cleanup!
  destroy() {
    this.props.model.destroy();
  }

  // Stop editing if the input gets an "Enter" keypress.
  handleEditKeyPress(event) {
    if (13 === event.keyCode) {
      this.stopEditing();
    }
  }

  // Set the title of this item's model when the value of the `<input>` changes.
  setTitle(event) {
    this.props.model.set("title", event.target.value);
  }

  // Tell the parent component this list item is entering edit mode.
  startEditing() {
    this.props.onStartEditing(this.props.model.id);
  }

  // Exit edit mode.
  stopEditing() {
    this.props.onStopEditing(this.props.model.id);
  }

  toggleDone(event) {
    this.props.model.set("done", event.target.checked);
  }

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
  }

}
