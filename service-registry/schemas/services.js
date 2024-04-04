/**
 * Esse arquivo define as ações das rotas,
 * essas ações está ligada a uma rota no
 * arquivo controllers/api.js.
 */

/**
 * Ação de listar serviços.
 */
NEWACTION('Service/query', {
  action: function($) {
    $.callback(Object.fromEntries(DEF.services))
  }
})

/**
 * Ação de registrar serviços.
 */
NEWACTION('Service/registry', {
  input: '*uuid:String,*name:String,*uri:String',
  action: function($, model) {
    const { uuid, name, uri } = model

    const result = FUNC.registryService({ uuid, name, uri })

    FUNC.callback(result.message, result.success, result.success ? 200 : 400, $)
  }
})

/**
 * Ação de remover um serviço registrado.
 */
NEWACTION('Service/remove', {
  query: '*uuid:String,*name:String',
  action: function($) {
    const { uuid, name } = $.query

    const result = FUNC.removeService({ uuid, name })

    FUNC.callback(result.message, result.success, result.success ? 200 : 400, $)
  }
})
