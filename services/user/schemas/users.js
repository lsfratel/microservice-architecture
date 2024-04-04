/**
 * Aqui está definido as ações das rotas,
 * essas ações está ligada a uma rota no
 * arquivo controllers/api.js.
 */

/**
 * Ação de listar/buscar entidades.
 */
NEWACTION('Users/query', {
  action: async function($) {
    const users = await DB()
      .find('nosql/users')
      .fields('id,username,password')
      .promise($)

    FUNC.callback($, users)
  }
})

/**
 * Ação de 'ler' uma entidade por ID.
 */
NEWACTION('Users/read', {
  params: 'id:UID',
  action: async function($) {
    const user = await DB()
      .one('nosql/users')
      .error('@(Not found)')
      .where('id', $.params.id)
      .promise($)

    FUNC.callback($, user)
  }
})

/**
 * Ação de criar nova entidade.
 */
NEWACTION('Users/create', {
  input: '*username:String(16),*password:String',
  action: async function($, model) {
    model.id = UID()
    model.created_at = NOW

    await DB()
      .insert('nosql/users', model)
      .promise($)

    FUNC.callback($, undefined, 'Registered successfully')
  }
})

/**
 * Ação de atualizar uma entidade por ID.
 */
NEWACTION('Users/update', {
  input: 'username:String(16),password:String',
  params: 'id:UID',
  action: async function($, model) {
    const params = $.params
    model.updated_at = NOW

    await DB()
      .modify('nosql/users', model)
      .id(params.id)
      .error('@(Not found)')
      .promise($)

    FUNC.callback($, undefined, 'Updated successfull')
  }
})

/**
 * Ação de remover/deletar entidade.
 */
NEWACTION('Users/remove', {
  params: 'id:UID',
  action: async function($) {
    const params = $.params

    await DB()
      .remove('nosql/users')
      .id(params.id)
      .error('@(Not found)')
      .promise($)

    FUNC.callback($, undefined, 'Removed successfull')
  }
})

/**
 * Ação de verificar usuarios/passwords.
 */
NEWACTION('Users/verify', {
  input: '*username:String(16),*password:String',
  action: async function($, model) {
    const { username, password } = model

    const user = await DB()
      .find('nosql/users')
      .where('username', username)
      .first()
      .promise($)

    if (!user || user.password !== password) {
      return FUNC.callback($, undefined, 'Invalid credentials', 400)
    }

    FUNC.callback($, undefined)
  }
})
