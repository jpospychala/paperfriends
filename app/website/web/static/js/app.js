import "phoenix_html";
import socket from "./socket";
import state from "./scene";
import sync from "./sync";

state.name = "scene";
sync.start(socket, state);


var vm = new Vue({
  el: "#scene",
  data: {
    message: "Paperfriends",
    editable: "",
    model: {},
    error: undefined
  },
  ready: function () {
    $.getJSON('/api/models/1', (response) => {
      this.model = response.data;
      this.editable = JSON.stringify(this.model.body, true, 2);

      var viewPlace = $(this.$el).find("#view3d")[0];
      state.init(viewPlace);
      state.loadModel(this.model.body);
    });
  },
  methods: {
    applyChanges: function() {
      try {
        this.model.body = JSON.parse(this.editable);
        this.error = undefined;
        state.loadModel(this.model.body);
      } catch (ex) {
        this.error = ex;
      }
    },
    save: function() {
      this.applyChanges();
      $.ajax({
        type: "PUT",
        url: "/api/models/1",
        data: JSON.stringify({model: this.model}),
        success: (response) => {
          console.log(response);
        },
        contentType: "application/json",
        dataType: "json"
      });
    }
  }
});
