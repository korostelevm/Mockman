// Globally register all base components for convenience, because they
// will be used very frequently. Components are registered using the
// PascalCased version of their file name.

import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
var _ = require('lodash')
// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
  // Look for files in the current directory
  './',
  // Do not look in subdirectories
  true,
  // Only include  .vue files
  /.+\.vue$/
)
requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName)
  fileName = fileName.split('/').slice(-1)[0]
  const componentName = upperFirst(
    camelCase(
      fileName
        .replace(/^\.\/_/, '')
        .replace(/\.\w+$/, '')
    )
  )
  Vue.component(componentName, componentConfig.default || componentConfig)
})