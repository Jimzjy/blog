module.exports = {
  title: 'Jimzjy',
  // theme: '@vuepress/theme-blog',
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
    ],
    footer: {
      contact: [
        {
          type: 'github',
          link: 'https://github.com/Jimzjy',
        },
      ],      
      copyright: [
        {
          text: 'Touching fish in progress...',
          link: '',
        },
      ],
    },
  },
}