const { performance } = require('node:perf_hooks')

/**
 * Evento emitido quando o framework carregou todos os
 * modulos e está pronto para uso.
 */
ON('ready', function() {
  /**
   * Envia uma requisição para o SERVICE REGISTRY
   * para obter os serviços online
   */
  FUNC.serviceDiscovery()
})

/**
 * Evento emitido quando é iniciado uma requisição
 */
ON('request_begin', function(req, _) {
  /**
   * Cria um novo atributo no Request, com informações
   * para o proxy.
   */
  req.ctx = {
    ...FUNC.setupRequest(req),
    requestBegin: performance.now()
  }
})

/**
 * Evento emitido quando a requisição está termiando,
 * aqui a resposta ja foi enviado ao cliente.
 */
ON('request_end', function(req, _) {
  const { ctx } = req
  const end = performance.now()

  /**
   * Gera um logo de acesso.
   */
  console.info(JSON.stringify({
    time: new Date(),
    requestId: ctx.requestId,
    service: ctx.service,
    servicePath: ctx.url.pathname,
    path: req.controller.url,
    query: ctx.url.search,
    requestTime: `${Math.trunc(end - ctx.requestBegin)}ms`,
    serviceTime: `${Math.trunc(end - ctx.serviceBegin)}ms`,
    method: ctx.method,
    host: req.headers.host,
    status: req.controller.status,
  }))
})
