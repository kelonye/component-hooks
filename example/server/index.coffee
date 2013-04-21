hooks = require '../../src'

express = require 'express'
app = module.exports = express()

app.use express.favicon()
app.use express.static "#{__dirname}/../build"
app.engine 'jade', require('../../node_modules/jade').__express
app.set 'views', __dirname + '/views'
app.set 'view engine', 'jade'

app.get '/', hooks, (req, res) ->
  res.render 'index'

if not module.parent
  port = process.env.PORT || 3000
  app.listen port, ->
    if app.get('env') isnt 'testing'
      console.log "http://dev:#{port}"
