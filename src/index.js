import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import TodoCollection from './TodoCollection';

// Create a new Todo collection and render the **App** into `#todoapp`.
ReactDOM.render(
  <App collection={new TodoCollection()} />,
  document.getElementById("todoapp")
);
