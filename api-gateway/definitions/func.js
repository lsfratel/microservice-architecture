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

/**
 * Essa função prepara os serviços, adicionando um
 * loadbalance usando a estrateria POWER OF 2
 */
function registerDicoveredServices(services) {
  for (const serviceName of Object.keys(services)) {
    const obj = {
      instances: services[serviceName].map(i => ({ ...i, requests: 0 })),
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
 * para o SERVICE REGISTRY e o log de acesso.
 */
function setupRequest($) {
  const { services } = DEF
  const fowardHeaders = CONF.forward_headers.split(',')
  const [ serviceName ] = $.split

  const { uuid, uri } = services[serviceName].next()
  const { query, body, method } = $
  const headers = fowardHeaders.reduce((l, r) => ({ ...l, [r]: $.headers[r] }), {})
  const requestId = crypto.randomUUID()
  const requestUrl = new URL($.url.toServiceUrl($), uri)

  return {
    requestId: requestId,
    method: method,
    service: `${serviceName}-${uuid}`,
    query: query,
    url: requestUrl,
    body: body,
    headers: headers
  }
}

/**
 * Passa a requisição para o serviço
 */
function proxyRequest($, args) {
  const { url, method, headers, requestId } = args

  RESTBuilder.make(function(b) {
    b.strict()
    b.method(method)
    b.url(url.href)

    Object.keys($.body).length && b.json($.body)

    for (const header of Object.keys(headers)) {
      b.header(header, headers[header])
    }

    b.header('x-request-id', requestId)

    args.serviceBegin = performance.now()
    b.callback(function(e, resp, out) {
      if (e) {
        $.status = out.status ?? 500
        $.json(out.value)
      } else {
        $.json(out.value)
      }
    })
  })
}

FUNC.serviceDiscovery = serviceDiscovery
FUNC.proxyRequest = proxyRequest
FUNC.setupRequest = setupRequest
