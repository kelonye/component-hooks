fs = require 'fs'
path = require 'path'
Style = require 'styl'
Batch = require 'batch'
addConfProperty = require('./utils').addConfProperty

module.exports = (builder)->

  # css
  builder.hook 'before styles', (pkg, fn) ->

    styles = pkg.config.styles
    return fn() unless styles

    batch = new Batch()
    
    styles.forEach (file) ->

      batch.push (done) ->

        cssfile = pkg.path(file)

        styl = fs.readFileSync cssfile, 'utf8'

        vendors = 'o,ms,moz,webkit'.split(',').map (v)->
          '-' + v + '-'

        style = new Style(styl)
        style.vendors(vendors)
        css = style.toString()

        pkg.addFile 'styles', cssfile, css
        done()

    batch.end fn

  # styl
  builder.hook 'before styles', (pkg, fn) ->

    styles = pkg.config.styl
    return fn() unless styles

    batch = new Batch()
    
    styles.forEach (file) ->

      batch.push (done) ->

        stylfile = pkg.path(file) + '.styl'
        cssfile =  "#{file}.css"

        styl = fs.readFileSync stylfile, 'utf8'

        vendors = 'o,ms,moz,webkit'.split(',').map (v)->
          '-' + v + '-'

        opts = 
          whitespace: true
        
        style = new Style(styl, opts)
        style.vendors(vendors)
        css = style.toString()

        pkg.addFile 'styles', cssfile, css
        done()

    batch.end fn
