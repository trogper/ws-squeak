let ws = new WebSocket("ws://"+window.location.hostname+"/api/ws");
ws.sendObj = (m => ws.send(JSON.stringify(m)));

ws.onopen = function (event) {
  $('#myName').text('-connecting-');
}

ws.onclose = function(event) {
  $('#myName').text('-not connected-');
  location.href = location.href;
}

ws.onmessage = function (event) {
  let msg = JSON.parse(event.data);
  
  if (msg.id) {
    $('#myName').text(msg.id);
  }
  
  if (msg.reload) {
    location.href = location.href;
  }
  
  if (msg.subs) {
    $('#buttons').empty();
    
    msg.subs.forEach(sub => {
      let btn = $('<button/>', {
        text: sub,
        click: function () { ws.sendObj({method: 'squeak', id: sub}); }
      });
      
      $('#buttons').append(btn);
    });
  }
  
  if (msg.squeak) {
    let id = Math.floor(Math.random() * 2);
    let audio = new Audio('squeak'+id+'.mp3');
    audio.play();
  }
}
