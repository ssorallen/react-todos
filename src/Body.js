/* @flow */

import './Body.css';
import * as React from 'react';
import Footer from './Footer';
import type { Todo } from './Types';
import TodoList from './TodoList';

// Main Component
// --------------

interface Props {
  onClearCompletedTodos: () => void;
  onDestroyTodo: (Todo: Todo) => void;
  onSetTodoTitle: (Todo: Todo, title: string) => void;
  onToggleTodoCompleted: (Todo: Todo, done: boolean) => void;
  onToggleAllTodosCompleted: (toggle: boolean) => void;
  todos: Array<Todo>;
}

// The main component contains the list of todos and the footer.
export default function Body(props: Props) {
  // Tell the **App** to toggle the *done* state of all **Todo** items.
  const toggleAllTodosCompleted = (event: SyntheticInputEvent<HTMLInputElement>) => {
    props.onToggleAllTodosCompleted(event.target.checked);
  };

  return (
    <section id="main">
      <input
        id="toggle-all"
        type="checkbox"
        checked={props.todos.every(t => t.done)}
        onChange={toggleAllTodosCompleted}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <TodoList
        onDestroyTodo={props.onDestroyTodo}
        onSetTodoTitle={props.onSetTodoTitle}
        onToggleTodoCompleted={props.onToggleTodoCompleted}
        todos={props.todos}
      />
      <Footer
        clearCompletedItems={props.onClearCompletedTodos}
        itemsRemainingCount={props.todos.reduce((count, t) => {
          if (!t.done) count += 1;
          return count;
        }, 0)}
        itemsDoneCount={props.todos.reduce((count, t) => {
          if (t.done) count += 1;
          return count;
        }, 0)}
      />
    </section>
  );
}
