exports.install = function() {
  /**
   * Essas rotas estão ligada a uma ação (ACTION)
   * no arquivo schemas/services.js
   *
   * Service/{query,registry,remove} = ACTION
   */
  ROUTE('GET    /   * --> Service/query')
  ROUTE('POST   /   * --> Service/registry')
  ROUTE('DELETE /   * --> Service/remove')
}
