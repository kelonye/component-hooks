hooks = require '../../src'

express = require 'express'
module.exports = app = express()

app.configure ->
  app.use express.favicon()
  app.set 'views', __dirname + '/views'
  app.engine 'jade', require('../../node_modules/jade').__express
  app.set 'view engine', 'jade'
  app.use express.static "#{__dirname}/../build"

app.get '/', hooks, (req, res) ->
  res.render 'index'

port = process.env.PORT || 3000
app.listen port, ->
  if app.get('env') isnt 'testing'
    console.log "http://localhost:#{port}"
