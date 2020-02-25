module.exports = {
  title: 'Jimzjy Blog',
  theme: '@vuepress/theme-blog',
  base: '/blog/',
  themeConfig: {
    nav: [
      {
        text: 'Blog',
        link: '/',
      },
      {
        text: 'Memo',
        link: '/tag/memo/',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/Jimzjy/blog'
      }
    ]
  },
}