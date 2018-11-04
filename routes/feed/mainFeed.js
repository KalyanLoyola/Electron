const Feed = require('feed').Feed
const description = require('description')

const types = {
  blog: 'blog',
  releases: 'releases'
}

module.exports.setupFeed = (type, items) => {
  let feed = new Feed({
    title: 'Electron',
    description:
      'Build cross platform desktop apps with JavaScript, HTML, and CSS.',
    id: 'https://electronjs.org/',
    link: 'https://electronjs.org/',
    generator: 'Electron website',
    feedLinks: {
      json: 'https://electronjs.org/releases.json',
      atom: 'https://electronjs.org/releases.xml',
      json1: 'https://electronjs.org/blog.json',
      atom1: 'https://electronjs.org/blog.xml'
    }
  })

  if (type === types.releases) {
    items.forEach(release => {
      feed.addItem({
        id: `https://electronjs.org/releases#${release.version}`,
        date: new Date(release.created_at),
        link: release.html_url,
        content: release.body_html
      })
    })
  } else if (types === types.blog) {
    items.forEach(post => {
      feed.addItem({
        id: `https://electronjs.org${post.href}`,
        title: post.title,
        content: post.content,
        description: description({ content: post.content, endWith: '[...]', limit: 200 }),
        link: `https://electronjs.org${post.href}`,
        date: new Date(post.date),
        published: new Date(post.date),
        author: post.author,
        image: post.image || 'https://electronjs.org/images/opengraph.png'
      })
    })
  }

  return feed
}
