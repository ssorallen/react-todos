import Backbone from 'backbone';

// Todo Model
// ----------

// Our basic **Todo** model has `title` and `done` attributes.
const Todo = Backbone.Model.extend({

  // Default attributes for the Todo item.
  defaults: function() {
    return {
      title: "",
      done: false
    };
  }

});

export default Todo;
