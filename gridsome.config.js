// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: '被你发现了~',
  siteDescription: '王梓毅的博客',
  plugins: [
    {
      use: '@gridsome/source-strapi',
      options: {
        apiURL: 'http://123.56.10.85:1337',
        queryLimit: 1000, // Defaults to 100
        contentTypes: ['new', 'blog'],
        // singleTypes: ['impressum'],
        // Possibility to login with a Strapi user,
        // when content types are not publicly available (optional).
        // loginData: {
        //   identifier: '',
        //   password: ''
        // }
      }
    }
  ],
  templates: {
    StrapiBlog: [
      {
        path: "/BlogDetails/:id",
        component: "./src/templates/BlogDetails.vue"
      }
    ],
    // StrapiTag: [
    //   {
    //     path: "/tag/:id",
    //     component: "./src/templates/Tag.vue"
    //   }
    // ]
  }
}
