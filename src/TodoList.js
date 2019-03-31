/* @flow */

import './TodoList.css';
import * as React from 'react';
import type { Todo } from './Types';
import TodoListItem from './TodoListItem';

// Todo List Component
// -------------------

type Props = {
  onDestroyTodo: (Todo: Todo) => void,
  onSetTodoTitle: (Todo: Todo, title: string) => void,
  onToggleTodoCompleted: (Todo: Todo, done: boolean) => void,
  todos: Array<Todo>,
};

export default function TodoList(props: Props) {
  const [editingTodo, setEditingTodo] = React.useState(null);

  return (
    <ul id="todo-list">
      {props.todos.map((todo, index) => (
        <TodoListItem
          editing={editingTodo === todo}
          key={index}
          onDestroy={() => {
            props.onDestroyTodo(todo);
          }}
          onSetTitle={title => {
            props.onSetTodoTitle(todo, title);
          }}
          onStartEditing={() => {
            setEditingTodo(todo);
          }}
          onStopEditing={() => {
            if (todo === editingTodo) {
              setEditingTodo(null);
            }
          }}
          onToggleCompleted={() => {
            props.onToggleTodoCompleted(todo, !todo.done);
          }}
          todo={todo}
        />
      ))}
    </ul>
  );
}
