exports.install = function() {
  /**
   * Essas rotas estão ligada a uma ação (ACTION)
   * no arquivo schemas/users.js
   *
   * Users/{query,read,create,update,remove,verify} = ACTION
   */
  ROUTE('GET      /          * --> Users/query')
  ROUTE('POST     /          * --> Users/create')
  ROUTE('GET      /{id}      * --> Users/read')
  ROUTE('PUT      /{id}      * --> Users/update')
  ROUTE('DELETE   /{id}      * --> Users/remove')

  ROUTE('POST     /verify    * --> Users/verify')
}
