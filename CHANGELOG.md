## 0.6.7

* Improve listener and worker shutdown
* add `app.json` for heroku deploy button

## 0.6.6

* Only cascer1 may use the `setStatus` command

## 0.6.0

* Who knows?

## 0.5.4

* Improve code style consistency

## 0.5.3

* Enforce number parameters for convert command
* Deprecate `convertToMmol` and `convertToMgdl` commands
* Add `removePrompt` and `removeReply` settings to commands to automatically remove messages and avoid clutter
* Conversion commands now remove the message that prompted them
* Add `getServerSetting <setting>` command

## 0.5.2

* Cleanly shut down on Heroku termination (SIGTERM)

## 0.5.1

* Christmas! (Added emoji to messages) :santa:

## 0.5.0

* Server registration now automatically registers owner if they are not yet registered
* Server no longer has single owner ID
* User table contains server role
* Users can set their diabetes Type using `setType` command
