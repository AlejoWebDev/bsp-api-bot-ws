import { addKeyword, createBot, createFlow, createProvider, MemoryDB } from '@bot-whatsapp/bot';

import { BaileysProvider, handleCtx } from '@bot-whatsapp/provider-baileys';

const flowWelcome = addKeyword('hola').addAnswer('Buenas bienvenido');

const main = async () => {{
  const provider = createProvider(BaileysProvider);

  provider.initHttpServer(3002);

  provider.http.server.post('/send-message', handleCtx(async (bot, req, res) => {
    // const phone = req.body.phone;
    const body = req.body;
    console.log(body);
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

main();