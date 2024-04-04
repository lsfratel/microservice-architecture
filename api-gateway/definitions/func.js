const { performance } = require('node:perf_hooks')

/**
 * Controi uma requisição para o SERVICE REGISTRY
 */
function serviceDiscovery() {
  RESTBuilder.make(function(b) {
    b.method('GET')
    b.url(CONF.service_registry_uri)
    b.strict()
    b.callback(function(e, resp, out) {
      if (e) {
        console.error('Unable do discover services')
        console.error(e)
        process.exit(1)
      }

      /**
       * Processa os serviços
       */
      registerDicoveredServices(out.value)
    })
  })
}

FUNC.serviceDiscovery = serviceDiscovery

/**
 * Essa função prepara os serviços.
 */
function registerDicoveredServices(services) {
  for (const serviceName of Object.keys(services)) {
    const obj = {
      instances: services[serviceName].map(i => ({ ...i, requests: 0 })),
      /**
       * Implementação de load balance.
       * Cada serviço tem seu proprio load balance.
       */
      next() {
        const $ = this
        const a = $.instances[Math.trunc(Math.random() * $.instances.length)]
        const b = $.instances[Math.trunc(Math.random() * $.instances.length)]

        const instance = a.requests < b.requests ? a : b

        if (instance.requests === Number.MAX_SAFE_INTEGER) {
          $.instances.forEach(i => { i.requests = 0 })
        }

        instance.requests += 1

        return instance
      }
    }

    Object.assign(DEF.services, { [serviceName]: obj })
  }
}

/**
 * Prepara os argumentos para contruir a requisição
 * para o serviço.
 */
function setupRequest($) {
  const service = $.split[0]
  const headers = getFowardedHeaders($)
  const { uuid, uri } = DEF.services[service].next()
  const requestUrl = new URL($.url.replace(`/${service}`, ''), uri)

  return {
    url: requestUrl,
    method: $.req.method,
    headers: headers,
    service: `${service}-${uuid}`
  }
}

function getFowardedHeaders($) {
  const headers = CONF.forward_headers.split(',')

  if (U.isEmpty(headers)) {
    return {}
  }

  return headers.reduce((left, right) => ({ ...left, [right]: $.headers[right] }), {})
}

/**
 * Faz a requisição para o serviço.
 */
function makeRequest($) {
  const { url, method, headers, service } = setupRequest($)

  /**
   * Seta atributos no contexto para auxiliar no log de acesso.
   */
  U.set($, 'req.ctx.url', url)
  U.set($, 'req.ctx.headers', headers)
  U.set($, 'req.ctx.method', method)
  U.set($, 'req.ctx.service', service)
  U.set($, 'req.ctx.fowardedHeaders', headers)

  RESTBuilder.make(function(b) {
    b.strict()
    b.method(method)
    b.url(url.href)

    if (
      ['POST', 'PUT', 'PATCH'].includes(method)
      && !U.isEmpty($.body)
    ) {
      b.json($.body)
    }

    for (const header of Object.keys(headers)) {
      if (headers[header] !== undefined) {
        b.header(header, headers[header])
      }
    }

    b.header('x-request-id', $.req.ctx.id)

    U.set($, 'req.ctx.serStart', performance.now())
    b.callback(function(e, _, out) {
      if (e) {
        $.status = out.status ?? 500
      }

      $.json(out.value)
    })
  })
}

FUNC.makeRequest = makeRequest
