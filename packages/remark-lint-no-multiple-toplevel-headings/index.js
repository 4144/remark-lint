/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module no-multiple-toplevel-headings
 * @fileoverview
 *   Warn when multiple top-level headings are used.
 *
 *   Options: `number`, default: `1`.
 *
 * @example {"name": "valid.md", "setting": 1}
 *
 *   # Foo
 *
 *   ## Bar
 *
 * @example {"name": "invalid.md", "setting": 1, "label": "input"}
 *
 *   # Foo
 *
 *   # Bar
 *
 * @example {"name": "invalid.md", "setting": 1, "label": "output"}
 *
 *   3:1-3:6: Don’t use multiple top level headings (3:1)
 */

'use strict'

var rule = require('unified-lint-rule')
var visit = require('unist-util-visit')
var position = require('unist-util-position')
var generated = require('unist-util-generated')

module.exports = rule(
  'remark-lint:no-multiple-toplevel-headings',
  noMultipleToplevelHeadings
)

function noMultipleToplevelHeadings(tree, file, pref) {
  var style = pref ? pref : 1
  var topLevelheading = false

  visit(tree, 'heading', visitor)

  function visitor(node) {
    var pos
    var reason

    if (!generated(node) && node.depth === style) {
      if (topLevelheading) {
        pos = position.start(node)

        reason =
          'Don’t use multiple top level headings (' +
          pos.line +
          ':' +
          pos.column +
          ')'

        file.message(reason, node)
      }

      topLevelheading = true
    }
  }
}
