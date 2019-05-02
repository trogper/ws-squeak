const express = require('express');
const expressWs = require('express-ws');

const app = express();
expressWs(app);

app.ws('/api/ws', handle);

app.use('/', express.static('static'));


app.listen(80);


const subs = new Map();

function notifySubs() {
  for (sub of subs.values()) {
    try {
      sub.sendObj({
        subs: [...subs.keys()]
      });
    } catch (e) { }
  }
}

function handle(ws, req) {
  ws.sendObj = (m => ws.send(JSON.stringify(m)));
  
  let id = Math.random().toString(36).substring(8).toUpperCase();
  console.log('ws connect', { id });
  
  ws.sendObj({id});
  subs.set(id, ws);
  notifySubs();
  
  ws.on('close', () => {
    subs.delete(id);
    notifySubs();
  });
  
  ws.on('message', (msg) => {
    msg = JSON.parse(msg);
    
    switch (msg.method) {
      case 'squeak':
        let sub = subs.get(msg.id);
        if (sub)
          sub.sendObj({squeak: true});
        break;
    }
  });
  
}
