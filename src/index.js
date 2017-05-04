import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import TodoList from './TodoList';

// Create a new Todo collection and render the **App** into `#todoapp`.
ReactDOM.render(
  <App collection={new TodoList()} />,
  document.getElementById("todoapp")
);
