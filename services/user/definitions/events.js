/**
 * Evento emitido quando o framework carregou todos os
 * modulos e está pronto para uso.
 */
ON('ready', function() {
  /**
   * A variavel global CONF erdas os atributes do arquivo config
   * na raiz do projeto.
   *
   * Aqui estamos fazendo o 'destructing' dos atributos de configurações
   * e setando um valor inicial '' caso o atributo não esteja definido
   * no arquivo config.
   */
  const { service_name = '', service_uri = '', service_uuid, service_registry_uri = '' } = CONF

  if (
    service_name === '' ||
    service_uri === '' ||
    service_registry_uri === '' ||
    service_uuid === ''
  ) {
    console.error('Please, SERVICE_{NAME,URI,UUID,REGISTRY_URI} env variables should be set.')
    process.exit(1)
  }

  /**
   * Chava a função de registro, definida no arquivo definitions/func
   */
  FUNC.registry({ service_name, service_uri, service_registry_uri, service_uuid })
})

/**
 * Evento emitido quando o processo recebe um SIGNAL para terminar,
 * ou quando a aplicação é morta.
 */
ON('exit', function() {
  const { service_name = '', service_uuid, service_registry_uri = '' } = CONF

  FUNC.unregistry({ service_name, service_uuid, service_registry_uri,  })
})
