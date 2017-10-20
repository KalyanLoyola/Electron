document.addEventListener('DOMContentLoaded', () => {
  require('./create-filter-list')()
  require('./fix-platform-labels')()
  require('./update-demo-app-download-link')()
  require('./update-app-download-links')()
  require('./apply-active-class-to-active-links')()
  require('./remove-scheme-from-link-text')()
  require('browser-date-formatter')()
})
