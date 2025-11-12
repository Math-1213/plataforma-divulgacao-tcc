import type { HttpContext } from '@adonisjs/core/http'
import { db } from '../../config/firebase.js'
/**
 * Model {
  "bio": String
  "foto": Path
  "redes": List
 */
export default class ProfilesController {
  private collection = db.collection('profiles')

  /**
   * GET /profiles
   * Lista todos os perfis
   */
  public async index({ response }: HttpContext) {
    try {
      const snapshot = await this.collection.get()
      const profiles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      return response.ok(profiles)
    } catch (error) {
      console.error('Erro ao listar perfis:', error)
      return response.status(500).json({ error: 'Erro ao listar perfis' })
    }
  }

  /**
   * POST /profiles
   * Cria um novo perfil
   */
  public async store({ request, response }: HttpContext) {
    try {
      const { bio, foto, redes } = request.only(['bio', 'foto', 'redes'])

      const newProfile = {
        bio: bio || '',
        foto: foto || '',
        redes: redes || [],
        createdAt: new Date(),
      }

      const docRef = await this.collection.add(newProfile)
      return response.created({ id: docRef.id, ...newProfile })
    } catch (error) {
      console.error('Erro ao criar perfil:', error)
      return response.status(500).json({ error: 'Erro ao criar perfil' })
    }
  }

  /**
   * GET /profiles/:id
   * Retorna um perfil específico
   */
  public async show({ params, response }: HttpContext) {
    try {
      const doc = await this.collection.doc(params.id).get()

      if (!doc.exists) {
        return response.status(404).json({ error: 'Perfil não encontrado' })
      }

      return response.ok({ id: doc.id, ...doc.data() })
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      return response.status(500).json({ error: 'Erro ao buscar perfil' })
    }
  }

  /**
   * PUT /profiles/:id
   * Atualiza dados de um perfil
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const updates = request.only(['bio', 'foto', 'redes'])

      const docRef = this.collection.doc(params.id)
      const doc = await docRef.get()

      if (!doc.exists) {
        return response.status(404).json({ error: 'Perfil não encontrado' })
      }

      await docRef.update({ ...updates, updatedAt: new Date() })
      return response.ok({ id: params.id, ...updates })
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      return response.status(500).json({ error: 'Erro ao atualizar perfil' })
    }
  }

  /**
   * DELETE /profiles/:id
   * Remove um perfil
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const docRef = this.collection.doc(params.id)
      const doc = await docRef.get()

      if (!doc.exists) {
        return response.status(404).json({ error: 'Perfil não encontrado' })
      }

      await docRef.delete()
      return response.ok({ message: 'Perfil removido com sucesso' })
    } catch (error) {
      console.error('Erro ao excluir perfil:', error)
      return response.status(500).json({ error: 'Erro ao excluir perfil' })
    }
  }
}
