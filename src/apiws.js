import fs from 'fs';
import { addKeyword, createBot, createFlow, createProvider, MemoryDB } from '@bot-whatsapp/bot';
import { BaileysProvider, handleCtx } from '@bot-whatsapp/provider-baileys';

const flowWelcome = addKeyword('hola').addAnswer('Buenas bienvenido', {
  buttons: [{body: 'Boton 1'},{body: 'Boton 2'},{body: 'Boton 3'}]
});

export const apibot = async () => {{
  const filePath = 'bot.qr.png';

  let timeout = null;

  const onFileChange = (evenType, filename) => {
    if (evenType === 'change') {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        console.log(`El archivo ${filename} ha sido modificado`);        
        // llamar a cualquier cosa que se necesite, como por ejemplo socket.io
      }, 100);
    }
  }
  
  fs.watch(filePath, onFileChange);

  console.log(`Monitoreando solicitud de vinculación a Whastapp, archivo: ${filePath}`);

  const provider = createProvider(BaileysProvider);

  provider.initHttpServer(3002);

  provider.http.server.post('/send-message', handleCtx(async (bot, req, res) => {
    // const phone = req.body.phone;
    const body = req.body;
    const message = body.message;
    const mediaUrl= body.mediaUrl;
    await bot.sendMessage('5491136919496', message, {
      media: mediaUrl
    });
    res.end('esto es del server')    
  }));

  await createBot({
    flow: createFlow([flowWelcome]),
    database: new MemoryDB(),
    provider
  })
}}
