const { performance } = require('node:perf_hooks')

/**
 * Evento emitido quando o framework carregou todos os
 * modulos e está pronto para uso.
 */
ON('ready', function() {
  /**
   * Envia uma requisição para o SERVICE REGISTRY
   * para obter os serviços online.
   */
  FUNC.serviceDiscovery()
})

/**
 * Evento emitido quando é iniciado uma requisição.
 */
ON('request_begin', function(req, _) {
  /**
   * Atributo para medir o tempo da requisição.
   */
  req.ctx = {
    id: crypto.randomUUID(),
    reqStart: performance.now()
  }
})

/**
 * Evento emitido quando a requisição está terminando,
 * aqui a resposta já foi enviada ao cliente.
 */
ON('request_end', function(req, _) {
  const { ctx } = req
  const end = performance.now()

  /**
   * Gera o logo de acesso.
   */
  console.info(JSON.stringify({
    time: new Date(),
    requestId: ctx.id,
    service: ctx.service,
    servicePath: ctx.url.pathname,
    path: req.controller.url,
    query: ctx.url.search,
    requestTime: `${Math.trunc(end - ctx.reqStart)}ms`,
    serviceTime: `${Math.trunc(end - ctx.serStart)}ms`,
    method: ctx.method,
    host: req.headers.host,
    status: req.controller.status,
    ip: req.controller.ip,
    fowardedHeaders: ctx.fowardedHeaders
  }))
})
