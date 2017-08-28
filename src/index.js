/* @flow */
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import TodoCollection from './TodoCollection';

// Create a new Todo collection and render the **App** into `#todoapp`.
ReactDOM.render(
  <App models={{ todos: new TodoCollection() }} />,
  document.getElementById("todoapp")
);
