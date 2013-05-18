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

  it 'should compile styl', (done)->

    request(app)
      .get('/')
      .expect(200)
      .end (err, res)->
        return done err if err

        fs.readFile 'public/public.css', 'utf8', (err, css)->
          return done err if err
          
          css.should.include '-o-linear-gradient(top, black, white)'
          
          done()


  it 'should work on css', (done)->

    request(app)
      .get('/')
      .expect(200)
      .end (err, res)->
        return done err if err

        fs.readFile 'public/public.css', 'utf8', (err, css)->
          return done err if err
          
          css.should.include '-o-transition: 200ms cubic-bezier(0.680, -0.550, 0.265, 1.550)'
          
          done()
