log = console.log
fs = require 'fs'
should = require 'should'
request = require 'supertest'
exec = require('child_process').exec

app = require '../example/server'

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

        fs.readFile 'public/public.js', 'utf8', (err, js)->
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

        fs.readFile 'public/public.js', 'utf8', (err, js)->
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

        fs.readFile 'public/public.js', 'utf8', (err, js)->
          return done err if err

          js.should.include 'local/template.js'

          done()

  it 'should work on css', (done)->

    request(app)
      .get('/')
      .expect(200)
      .end (err, res)->
        return done err if err

        fs.readFile 'public/public.css', 'utf8', (err, css)->
          return done err if err
          
          css.should.include '-o-linear-gradient(top, #000000, #000100)'
          
          done()


  it 'should compile styl', (done)->

    request(app)
      .get('/')
      .expect(200)
      .end (err, res)->
        return done err if err

        fs.readFile 'public/public.css', 'utf8', (err, css)->
          return done err if err
          
          css.should.include '-o-linear-gradient(top, #000000, #000200)'
          
          done()


  it 'should compile less', (done)->

    request(app)
      .get('/')
      .expect(200)
      .end (err, res)->
        return done err if err

        fs.readFile 'public/public.css', 'utf8', (err, css)->
          return done err if err
          
          #css.should.include '-o-linear-gradient(top, #000000, #000300)'
          css.should.include 'linear-gradient(top, #000000, #000300)'
          
          done()
