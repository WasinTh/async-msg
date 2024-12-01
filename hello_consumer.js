const amqp = require('amqplib/callback_api');

const USERNAME = "client"
const PASSWORD = "1234"
const HOST = "localhost"
const PORT = "5672"
const VHOST = "demo01"
const QUEUE = "hello"
const EXCHANGE = "logs"

const uri = `amqp://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${VHOST}`


amqp.connect(uri, (error0, connection) => {
  if (error0) {
    console.log(error0);
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      console.log(error1);
      throw error1;
    }

    channel.assertQueue(QUEUE, {
      durable: false
    });

    channel.assertExchange(EXCHANGE, 'fanout', {
      durable: false
    });

    channel.assertQueue('', {
      exclusive: true
    }, (error2, q) => {
      if (error2) {
        console.log(error2)
        throw error2;
      }
      console.log(` [*] Waiting for messages in ${q.queue}. To exit press CTRL+C`);
      channel.bindQueue(q.queue, EXCHANGE, '');

      channel.consume(q.queue, (msg) => {
        console.log(` [x] Received ${msg.content.toString()}`)
      }, {
        noAck: true
      });
    });

    // console.log(` [*] Waiting for messages in ${QUEUE}. To exit press CTRL+C`);

    // channel.prefetch(1);

    // channel.consume(QUEUE, (msg) => {
    //   console.log(` [x] Received ${msg.content.toString()}`);
    //   setTimeout(() => {
    //     console.log(" [x] Done");
    //     channel.ack(msg);
    //   }, 3000);
    // }, {
    //   noAck: false
    // });
  });
});
