/**
 * A variável services é um Map (HashTable).
 */
const services = new Map()

/**
 * Função utilitária de resposta.
 */
const result = (message, success = true, code = 200, $ = null) => {
  const a = { success, message }
  if ($ !== null) {
    $.controller.status = code
    return $.callback(a)
  }

  return a
}

/**
 * Função de registrar um serviço.
 */
function registryService(input) {
  const { uuid, name, uri } = input

  if (services.has(name)) {
    const instances = services.get(name)
    const idx = instances.findIndex(i => i.uuid === uuid)

    if (idx < 0) {
      instances.push({ uuid, name, uri })
      return result('Service instance added successfully')
    }

    return result('Service instance already registered', false)
  }

  services.set(name, [{ uuid, name, uri }])
  return result('Service registered successfully')
}

/**
 * Função de remover um registro registrado.
 */
function removeService(input) {
  const { uuid, name } = input

  if (!services.has(name)) {
    return result('Failed to remove service, no service instance registered', false)
  }

  const instances = services.get(name)
  const idx = instances.findIndex(s => s.uuid === uuid)

  if (idx < 0) {
    if (!instances.length) {
      services.delete(name)
    }
    return result('Failed to remove service instance, instance not registered', false)
  }

  instances.splice(idx, 1)

  if (!instances.length) {
    services.delete(name)
  }

  return result('Service instance removed successfully')
}

/**
 * Armazenamos os serviços na variável global DEF.
 */
DEF.services = services

/**
 * Armazenamos a fução de registro na variável global FUNC.
 */
FUNC.registryService = registryService

/**
 * Armazenamos a fução de remover registro na variável global FUNC.
 */
FUNC.removeService = removeService

/**
 * Armazenamos a fução utilitária na variável global FUNC.
 */
FUNC.callback = result
