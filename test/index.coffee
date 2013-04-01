log = console.log
fs = require 'fs'
should = require 'should'
request = require 'supertest'
exec = require('child_process').exec

# require app from example dir
app = require '../example/server'
app.set 'env','testing'

describe 'hooks', ->

  beforeEach (done)->

    process.chdir 'example/'
    exec 'rm -rf build', done

  afterEach (done)->
    process.chdir '../'
    done()

  it 'should compile coffee', (done)->

    request(app)
      .get('/')
      .expect(200)
      .end (err, res)->
        return done err if err

        fs.readFile 'build/build.js', 'utf8', (err, js)->
          return done err if err

          js.should.include 'boot/index.js'
          js.should.include 'local/index.js'

          done()

  it 'should add aliases', (done)->

    request(app)
      .get('/')
      .expect(200)
      .end (err, res)->
        return done err if err

        fs.readFile 'build/build.js', 'utf8', (err, js)->
          return done err if err

          js.should.include 'require.alias("local/index.js", "boot/deps/local/index.js")'
          js.should.include 'require.alias("local/index.js", "boot/deps/local/index.js")'

          done()

  it 'should compile templates', (done)->

    request(app)
      .get('/')
      .expect(200)
      .end (err, res)->
        return done err if err

        fs.readFile 'build/build.js', 'utf8', (err, js)->
          return done err if err

          js.should.include 'local/template.js'

          done()

  it 'should compile styl', (done)->

    request(app)
      .get('/')
      .expect(200)
      .end (err, res)->
        return done err if err

        fs.readFile 'build/build.css', 'utf8', (err, css)->
          return done err if err
          
          css.should.include 'color: #000;'
          
          done()
