import Backbone from 'backbone';
import 'backbone.localstorage';
import Todo from './Todo';

// Todo Collection
// ---------------

// The collection of Todos is backed by *localStorage* instead of a remote
// server.
const TodoList = Backbone.Collection.extend({

  // Reference to this collection's model.
  model: Todo,

  // Save all of the todo items under the `"todos-react"` namespace.
  localStorage: new Backbone.LocalStorage("todos-react"),

  // Filter down the list of all todo items that are finished.
  done: function() {
    return this.where({done: true});
  },

  // Filter down the list to only todo items that are still not finished.
  remaining: function() {
    return this.where({done: false});
  }

});

export default TodoList;
