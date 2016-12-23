# Diabot [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage percentage][coveralls-image]][coveralls-url] [![Codacy Grade][codacy-image]][codacy-url]

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

The bot also needs a MySQL database to connect to. It uses environment variables to get login details:

* `DIABOT_DB_HOST`: Database host
* `DIABOT_DB_USER` : Database username
* `DIABOT_DB_PASS`: Database password
* `DIABOT_DB_NAME`: Database name
* `DIABOT_DB_LIMIT`: Database connection limit

```javascript
$ npm start
```
## License

GPL-3.0+ © [Cas Eliens](https://github.com/cascer1)

The avatar image for diabot was created by [faythe](https://www.instagram.com/taintedwheat/)


[travis-image]: https://img.shields.io/travis/cascer1/diabot.svg
[travis-url]: https://travis-ci.org/cascer1/diabot
[daviddm-image]: https://david-dm.org/cascer1/diabot.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/cascer1/diabot
[coveralls-image]: https://img.shields.io/coveralls/cascer1/diabot.svg
[coveralls-url]: https://coveralls.io/github/cascer1/diabot
[codacy-image]: https://api.codacy.com/project/badge/Grade/7eb5dded36de46638d4b306f96ddc5d4
[codacy-url]: https://www.codacy.com/app/cascer1/diabot?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=cascer1/diabot&amp;utm_campaign=Badge_Grade
[npm-image]: https://img.shields.io/npm/v/diabot.svg
[npm-url]: https://www.npmjs.com/package/diabot
