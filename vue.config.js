module.exports = {
  pluginOptions: {
    express: {
      shouldServeApp: true,
      serverDir: './srv'
    }
  },
  css: {
    loaderOptions: {
      sass: {
        indentedSyntax: true // SASS mode
      }
    }
  }
}
