import "phoenix_html";
import socket from "./socket";
import state from "./scene";
import sync from "./sync";

state.name = "scene";
sync.start(socket, state);


var vm = new Vue({
  el: "#scene",
  data: {
    model_id: +getParameterByName("model"),
    editable: "",
    model: {},
    error: undefined
  },
  ready: function () {
    $.getJSON(`/api/models/${this.model_id}`, (response) => {
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
        url: `/api/models/${this.model_id}`,
        data: JSON.stringify({model: this.model}),
        success: (response) => {},
        error: function(response) {this.error = response; },
        contentType: "application/json",
        dataType: "json"
      });
    }
  }
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
