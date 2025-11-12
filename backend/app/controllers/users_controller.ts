import type { HttpContext } from '@adonisjs/core/http'
import { db } from '../../config/firebase.js'
/**
 * Model {
  nome - String
  email - String
  perfilId - Id 
  cursoId - Id
  trabalhos - List
  isAdmin - Bool
}

 */
export default class UsersController {
  private collection = db.collection('users')

  /**
   * GET /users
   * Lista todos os usuários
   */
  public async index({ response }: HttpContext) {
    try {
      const snapshot = await this.collection.get()
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      return response.ok(users)
    } catch (error) {
      console.error('Erro ao listar usuários:', error)
      return response.status(500).json({ error: 'Erro ao listar usuários' })
    }
  }

  /**
   * POST /users
   * Cria um novo usuário
   */
  public async store({ request, response }: HttpContext) {
    try {
      const { nome, email, perfilId, cursoId, trabalhos, isAdmin } = request.only([
        'nome',
        'email',
        'perfilId',
        'cursoId',
        'trabalhos',
        'isAdmin',
      ])

      if (!nome || !email) {
        return response.status(400).json({ error: 'Nome e e-mail são obrigatórios.' })
      }

      const newUser = {
        nome,
        email,
        perfilId: perfilId || null,
        cursoId: cursoId || null,
        trabalhos: trabalhos || [],
        isAdmin: isAdmin ?? false,
        createdAt: new Date(),
      }

      const docRef = await this.collection.add(newUser)
      return response.created({ id: docRef.id, ...newUser })
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      return response.status(500).json({ error: 'Erro ao criar usuário' })
    }
  }

  /**
   * GET /users/:id
   * Retorna um usuário específico
   */
  public async show({ params, response }: HttpContext) {
    try {
      const doc = await this.collection.doc(params.id).get()

      if (!doc.exists) {
        return response.status(404).json({ error: 'Usuário não encontrado' })
      }

      return response.ok({ id: doc.id, ...doc.data() })
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      return response.status(500).json({ error: 'Erro ao buscar usuário' })
    }
  }

  /**
   * PUT /users/:id
   * Atualiza dados de um usuário
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const updates = request.only(['nome', 'email', 'perfilId', 'cursoId', 'trabalhos', 'isAdmin'])

      const docRef = this.collection.doc(params.id)
      const doc = await docRef.get()

      if (!doc.exists) {
        return response.status(404).json({ error: 'Usuário não encontrado' })
      }

      await docRef.update({ ...updates, updatedAt: new Date() })
      return response.ok({ id: params.id, ...updates })
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      return response.status(500).json({ error: 'Erro ao atualizar usuário' })
    }
  }

  /**
   * DELETE /users/:id
   * Remove um usuário
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const docRef = this.collection.doc(params.id)
      const doc = await docRef.get()

      if (!doc.exists) {
        return response.status(404).json({ error: 'Usuário não encontrado' })
      }

      await docRef.delete()
      return response.ok({ message: 'Usuário removido com sucesso' })
    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
      return response.status(500).json({ error: 'Erro ao excluir usuário' })
    }
  }
}
