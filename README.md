# Diabot [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage percentage][coverage-image]][coverage-url] [![Codacy Grade][codacy-image]][codacy-url] [![Donate][paypal-image]][paypal-url]

> Diabetes Discord Bot

## Easy Installation

Click [here](https://duco.rocks/diabot-add) to authorize this bot for your Discord server.  
If you like, you can also add the development version by authorizing it [here](https://duco.rocks/diabot-test-add).

Type `-diabot --help` for a list of commands.
type `-diabot <command> --help` for help on a specific command.

## Less Easy Installation

Clone this repository, and run:
```sh
$ npm install
```

Run the `queries/create.sql` queries on your database.

### Usage

First, make sure to have a user bot for Discord, if you don't you can make one [here](https://discordapp.com/developers/applications/me).

Save the app bot user token in either an environment variable named `TOKEN`, or in the `config.js` file.

The bot also requires a MySQL database and Rabbit MQ instance. It uses the following environment variables to login:

* `DIABOT_DB_HOST`: Database host
* `DIABOT_DB_USER` : Database username
* `DIABOT_DB_PASS`: Database password
* `DIABOT_DB_NAME`: Database name
* `DIABOT_DB_LIMIT`: Database connection limit
* `DIABOT_QUEUE_USER`: rabbitMQ username
* `DIABOT_QUEUE_PASS`: rabbitMQ password
* `DIABOT_QUEUE_HOST`: rabbitMQ host
* `DIABOT_QUEUE_NAME`: rabbitMQ queue name
* `DIABOT_QUEUE_VHOST`: rabbitMQ vhost
* `DIABOT_QUEUE_PORT`: rabbitMQ port
* `DIABOT_QUEUE_TIMEOUT`: rabbitMQ connection timeout
* `DIABOT_QUEUE_HEARTBEAT`: rabbitMQ heartbeat
* `DIABOT_QUEUE_EXCHANGE`: rabbitMQ exchange name


The bot requires one listener (for queueing messages) and as many workers as you believe are necessary. Workers will take messages from the queue and process them.

.Starting your listener
```javascript
$ npm run listener
```

.Starting your worker(s)
```javascript
$ npm run worker
```
## License

GPL-3.0+ © [Cas Eliens](https://github.com/cascer1)

The avatar image for diabot was created by [faythe](https://www.instagram.com/taintedwheat/)


[travis-image]: https://img.shields.io/travis/cascer1/diabot.svg
[travis-url]: https://travis-ci.org/cascer1/diabot
[daviddm-image]: https://david-dm.org/cascer1/diabot.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/cascer1/diabot
[coverage-image]: https://api.codacy.com/project/badge/Coverage/7eb5dded36de46638d4b306f96ddc5d4
[coverage-url]: https://www.codacy.com/app/cascer1/diabot?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=cascer1/diabot&amp;utm_campaign=Badge_Coverage
[codacy-image]: https://api.codacy.com/project/badge/Grade/7eb5dded36de46638d4b306f96ddc5d4
[codacy-url]: https://www.codacy.com/app/cascer1/diabot?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=cascer1/diabot&amp;utm_campaign=Badge_Grade
[npm-image]: https://img.shields.io/npm/v/diabot.svg
[npm-url]: https://www.npmjs.com/package/diabot
[paypal-image]: https://img.shields.io/badge/Donate-PayPal-green.svg
[paypal-url]: https://duco.rocks/diabot-donate