/* @flow */
import Backbone from 'backbone';

// Todo Model
// ----------

// Our basic **Todo** model has `title` and `done` attributes.
export default class TodoModel extends Backbone.Model {

  // Default attributes for the Todo item.
  static defaults = {
    done: false,
    title: "",
  };

}
