import type { HttpContext } from '@adonisjs/core/http'
import { db } from '../../config/firebase.js'
/**
 * Model {
  name - String
  description - String
  color - HexColor
}

 */
export default class LabelsController {
  private collection = db.collection('labels')

  /**
   * GET /labels
   * Lista todas as labels
   */
  public async index({ response }: HttpContext) {
    try {
      const snapshot = await this.collection.get()
      const labels = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      return response.ok(labels)
    } catch (error) {
      console.error('Erro ao listar labels:', error)
      return response.status(500).json({ error: 'Erro ao listar labels' })
    }
  }

  /**
   * POST /labels
   * Cria uma nova label
   */
  public async store({ request, response }: HttpContext) {
    try {
      const { name, description, color } = request.only(['name', 'description', 'color'])

      if (!name) {
        return response.badRequest({ error: 'O campo "name" é obrigatório' })
      }

      const newLabel = {
        name,
        description: description || '',
        color: color || '#888888',
        createdAt: new Date(),
      }

      const docRef = await this.collection.add(newLabel)
      return response.created({ id: docRef.id, ...newLabel })
    } catch (error) {
      console.error('Erro ao criar label:', error)
      return response.status(500).json({ error: 'Erro ao criar label' })
    }
  }

  /**
   * GET /labels/:id
   * Retorna uma label específica
   */
  public async show({ params, response }: HttpContext) {
    try {
      const doc = await this.collection.doc(params.id).get()

      if (!doc.exists) {
        return response.status(404).json({ error: 'Label não encontrada' })
      }

      return response.ok({ id: doc.id, ...doc.data() })
    } catch (error) {
      console.error('Erro ao buscar label:', error)
      return response.status(500).json({ error: 'Erro ao buscar label' })
    }
  }

  /**
   * PUT /labels/:id
   * Atualiza uma label
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const updates = request.only(['name', 'description', 'color'])

      const docRef = this.collection.doc(params.id)
      const doc = await docRef.get()

      if (!doc.exists) {
        return response.status(404).json({ error: 'Label não encontrada' })
      }

      await docRef.update({ ...updates, updatedAt: new Date() })
      return response.ok({ id: params.id, ...updates })
    } catch (error) {
      console.error('Erro ao atualizar label:', error)
      return response.status(500).json({ error: 'Erro ao atualizar label' })
    }
  }

  /**
   * DELETE /labels/:id
   * Remove uma label
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const docRef = this.collection.doc(params.id)
      const doc = await docRef.get()

      if (!doc.exists) {
        return response.status(404).json({ error: 'Label não encontrada' })
      }

      await docRef.delete()
      return response.ok({ message: 'Label removida com sucesso' })
    } catch (error) {
      console.error('Erro ao excluir label:', error)
      return response.status(500).json({ error: 'Erro ao excluir label' })
    }
  }
}
