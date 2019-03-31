/* @flow */

import './App.css';
import * as React from 'react';
import Body from './Body';
import type { Todo } from './Types';

type State = {
  todos: Array<Todo>,
};

const initialState = {
  todos: [],
};

function reducer(state: State, action) {
  switch (action.type) {
    case 'clear-completed-todos':
      return {
        ...state,
        todos: state.todos.filter(t => !t.done),
      };
    case 'create-todo':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            done: false,
            title: action.title,
          },
        ],
      };
    case 'destroy-todo': {
      const nextTodos = state.todos.slice();
      nextTodos.splice(nextTodos.indexOf(action.todo), 1);
      return {
        ...state,
        todos: nextTodos,
      };
    }
    case 'set-todo-title': {
      const nextTodos = state.todos.slice();
      nextTodos.splice(nextTodos.indexOf(action.todo), 1, { ...action.todo, title: action.title });
      return {
        ...state,
        todos: nextTodos,
      };
    }
    case 'toggle-todo-completed': {
      const nextTodos = state.todos.slice();
      nextTodos.splice(nextTodos.indexOf(action.todo), 1, { ...action.todo, done: action.done });
      return {
        ...state,
        todos: nextTodos,
      };
    }
    case 'toggle-all-todos-completed':
      return {
        ...state,
        todos: state.todos.map(t => ({ ...t, done: action.done })),
      };
    default:
      return state;
  }
}

export default function App() {
  // Store the app's todos in local storage
  const [state, dispatch] = React.useReducer(
    reducer,
    JSON.parse(window.localStorage.getItem('react-todos')) || initialState
  );
  React.useEffect(
    () => {
      window.localStorage.setItem('react-todos', JSON.stringify(state));
    },
    [state]
  );
  const formEl = React.useRef(null);

  // If "Enter" is pressed in the main input field, it will submit the form.
  // Create a new **Todo** and reset the title.
  const handleTitleFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const titleEl = event.currentTarget.elements['title'];
    if (!(titleEl instanceof HTMLInputElement)) return;
    const title = titleEl.value;
    if (title === '') return;
    dispatch({ title, type: 'create-todo' });
    if (formEl.current != null) formEl.current.reset();
  };

  return (
    <React.Fragment>
      <header>
        <h1>Todos</h1>
        <form onSubmit={handleTitleFormSubmit} ref={formEl}>
          <input name="title" placeholder="What needs to be done?" type="text" />
        </form>
      </header>
      {/* Don't display the "Mark all as complete" button and the footer if there
          are no **Todo** items. */}
      {state.todos.length === 0 ? null : (
        <Body
          onClearCompletedTodos={() => {
            dispatch({ type: 'clear-completed-todos' });
          }}
          onDestroyTodo={todo => {
            dispatch({ todo, type: 'destroy-todo' });
          }}
          onSetTodoTitle={(todo, title) => {
            dispatch({ title, todo, type: 'set-todo-title' });
          }}
          onToggleTodoCompleted={(todo, done) => {
            dispatch({
              done,
              todo,
              type: 'toggle-todo-completed',
            });
          }}
          onToggleAllTodosCompleted={done => {
            dispatch({ done, type: 'toggle-all-todos-completed' });
          }}
          todos={state.todos}
        />
      )}
    </React.Fragment>
  );
}
