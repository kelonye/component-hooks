fs = require 'fs'
nib = require 'nib'
path = require 'path'
Batch = require 'batch'
stylus = require 'stylus'
addConfProperty = require('./utils').addConfProperty

module.exports = (builder)->

  builder.hook 'before styles', (pkg, fn) ->

    styles = pkg.conf.styl
    return fn() unless styles

    batch = new Batch()
    
    if not pkg.conf.styles
      batch.push (done) ->
        # add empty styles []
        addConfProperty pkg, 'styles'
        done()

    styles.forEach (file) ->

      batch.push (done) ->

        stylfile = pkg.path(file) + '.styl'
        cssfile =  "#{file}.css"

        styl = fs.readFileSync stylfile, 'utf8'
        stylus(styl)
          .set('include css', true)
          .set('filename', stylfile)
          .use(nib())
          .render (err, css)->
            pkg.addFile 'styles', cssfile, css
            done()

    batch.end fn
