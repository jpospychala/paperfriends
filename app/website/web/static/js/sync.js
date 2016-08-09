var sync = {
  start: function(socket, state) {

    let channel = socket.channel("room:" + state.name, {});

    channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp); })
      .receive("error", resp => { console.log("Unable to join", resp); });

    setInterval(function() {
      if (state.isChanging) {
        channel.push("new_msg", {body: {state: state.capture() }});
      }
    }, 1000/25);

    channel.on("new_msg", payload => {
      if (!state.isChanging) {
        state.refresh(payload.body.state);
      }
    });
  }
};

export default sync;
