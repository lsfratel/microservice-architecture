String.prototype.toServiceUrl = function($) {
  return this
    .replace(new RegExp(`/${$.split[0]}`), '')
    .replace(new RegExp("/*$"), '')
}

/**
 * Definimos uma variável para guarda os serviços
 * obtidos do SERVICE REGISTRY
 */
DEF.services = {}
