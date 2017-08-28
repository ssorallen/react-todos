/* @flow */
import './TodoList.css';
import React from 'react';
import TodoListItem from './TodoListItem';

// Todo List Component
// -------------------

interface Props {
  collection: Object;
}

interface State {
  editingModelId: ?number;
}

// Renders a list of todos.
export default class TodoList extends React.Component<Props, State> {

  state: State;

  constructor(props: Props) {
    super(props);
    // Start with no list item in edit mode.
    this.state = {
      editingModelId: undefined,
    };
  }

  // When a `TodoListItemComponent` starts editing, it passes its model's ID to
  // this callback. Setting the state triggers this component to re-render and
  // render that `TodoListItemComponent` in edit mode.
  setEditingModelId = (modelId: number) => {
    this.setState({editingModelId: modelId});
  };

  unsetEditingModelId = (modelId: number) => {
    if (modelId === this.state.editingModelId) {
      this.setState({editingModelId: undefined});
    }
  };

  render() {
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

}
