import socket from "./socket";
import Scene from "./scene";

var vm = new Vue({
  el: "#scene",
  data: {
    model_id: +getParameterByName("model"),
    editable: "{}",
    print: false,
    model: {
      name: "Unnamed",
      description: "Short description",
      body: {}
    },
    scene: new Scene(),
    error: undefined
  },
  ready: function () {
    var viewPlace = $(this.$el).find("#view3d")[0];
    this.scene.init(viewPlace);

    $.getJSON(`/api/models/${this.model_id}`, (response) => {
      this.model = response.data;
      this.editable = JSON.stringify(this.model.body, true, 2);
      this.scene.loadModel(this.model.body);
    });
  },
  methods: {
    applyChanges: function() {
      try {
        this.model.body = JSON.parse(this.editable);
        this.error = undefined;
        this.scene.loadModel(this.model.body);
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
    },
    create: function() {
      this.applyChanges();
      $.ajax({
        type: "POST",
        url: `/api/models/`,
        data: JSON.stringify({model: this.model}),
        success: (response) => {
          window.location = `/?model=${response.data.id}`;
        },
        error: function(response) {this.error = response; },
        contentType: "application/json",
        dataType: "json"
      });
    },
    set3dView: function() {
      this.scene.setViewStyle("view3d");
      this.print = false;
      this.applyChanges();
    },
    setPrintView: function() {
      this.scene.setViewStyle("view2d");
      this.print = true;
      this.applyChanges();
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
