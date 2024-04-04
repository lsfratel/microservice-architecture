exports.install = function() {
  /**
   * Essas rotas estão ligada a um controller.
   *
   * usersService = controller
   */
  ROUTE('GET      /users/*', usersService)
  ROUTE('PUT      /users/*', usersService)
  ROUTE('POST     /users/*', usersService)
  ROUTE('DELETE   /users/*', usersService)
}

function usersService() {
  FUNC.proxyRequest(this, this.req.ctx)
}
