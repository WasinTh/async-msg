const amqp = require('amqplib/callback_api');

const USERNAME = "client"
const PASSWORD = "1234"
const HOST = "localhost"
const PORT = "5672"
const VHOST = "demo01"
const QUEUE = "hello"
const EXCHANGE = "logs"
const MESSAGE = `Hello World !! @${new Date().toLocaleTimeString()}`

const uri = `amqp://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${VHOST}`


amqp.connect(uri, (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(QUEUE, {
      durable: false
    });

    channel.assertExchange(EXCHANGE, 'fanout', {
      durable: false
    });

    channel.publish(EXCHANGE, '', Buffer.from(MESSAGE));

    // channel.sendToQueue(QUEUE, Buffer.from(MESSAGE), {
    //   persistent: true
    // });

    console.log(` [x] Sent ${MESSAGE}`);
  });

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
