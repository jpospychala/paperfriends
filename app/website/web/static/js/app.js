import "phoenix_html";
import socket from "./socket";
import state from "./scene";
import sync from "./sync";

state.name = "scene";
sync.start(socket, state);


var vm = new Vue({
  el: "#scene",
  data: {
    message: "Paperfriends"
  },
  ready: function () {
    var element = this.$el;
    $.getJSON('/api/models/1', function(response) {
      state.loadModel(element, response.data.body);
    });
  }
});
