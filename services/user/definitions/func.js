/**
 * FUNC é uma variável global, pode ser acessada de
 * qualquer arquivo sem a necessidade de importar.
 */

/**
 * Função de registro do serviço no SERVICE REGISTRY.
 */
FUNC.registry = function(data) {
  const { service_name, service_uri, service_registry_uri, service_uuid } = data

  /**
   * RESTBuilder controi uma requisição HTTP.
   */
  RESTBuilder.make(function(b) {
    b.method('POST')
    b.url(service_registry_uri)
    b.strict()
    b.json({ uuid: service_uuid, name: service_name, uri: service_uri })
    b.callback(function(err, resp) {
      if (err) {
        console.error('Unable to register to Service Registry')
        console.error(err)
        process.exit(1)
      }
    })
  })
}

/**
 * Função de remover o registro do serviço no SERVICE REGISTRY.
 */
FUNC.unregistry = function(data) {
  const { service_name, service_uuid, service_registry_uri } = data
  const searchParams = new URLSearchParams({ name: service_name, uuid: service_uuid })
  const url = `${service_registry_uri}?${searchParams.toString()}`

  /**
   * RESTBuilder controi uma requisição HTTP.
   */
  RESTBuilder.make(function(b) {
    b.method('DELETE')
    b.url(url)
    b.strict()
    b.callback(function(err) {
      if (err) {
        console.error('Unable to unregister to Service Registry')
        console.error(err)
        process.exit(1)
      }
    })
  })
}

/**
 * Função utilitaria de resposta.
 */
FUNC.callback = function($, data, message = 'Success' , code = 200) {
  const success = code <= 400
  $.controller.status = code
  $.callback({ success, message, data })
}
