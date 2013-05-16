fs = require 'fs'
#nib = require 'nib'
path = require 'path'
Batch = require 'batch'
#stylus = require 'stylus'
Style = require 'styl'
addConfProperty = require('./utils').addConfProperty

module.exports = (builder)->

  builder.hook 'before styles', (pkg, fn) ->

    styles = pkg.config.styl
    return fn() unless styles

    batch = new Batch()
    
    if not pkg.config.styles
      batch.push (done) ->
        # add empty styles []
        addConfProperty pkg, 'styles'
        done()

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
