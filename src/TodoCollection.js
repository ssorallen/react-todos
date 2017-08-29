/* @flow */
import Backbone from 'backbone';
import 'backbone.localstorage';
import TodoModel from './TodoModel';

// Todo Collection
// ---------------

// The collection of Todos is backed by *localStorage* instead of a remote
// server.
export default class TodoCollection extends Backbone.Collection<TodoModel> {

  // Reference to this collection's model.
  static model = TodoModel;

  // Save all of the todo items under the `"todos-react"` namespace.
  // $FlowFixMe
  localStorage = new Backbone.LocalStorage("todos-react");

  // Filter down the list of all todo items that are finished.
  done() {
    return this.where({done: true});
  }

  // Filter down the list to only todo items that are still not finished.
  remaining() {
    return this.where({done: false});
  }

}
