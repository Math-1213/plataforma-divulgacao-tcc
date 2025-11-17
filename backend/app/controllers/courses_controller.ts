import type { HttpContext } from '@adonisjs/core/http'
import { db } from '../../config/firebase.js'
/**
 * Model {
 *  name: String
 *  code: String
 *  description: String
 *  color: String (HexColor)
 * }
 */
export default class CoursesController {
  private collection = db.collection('courses')

  public async listCourses({ response }: HttpContext) {
    try {
      const snapshot = await db.collection('courses').get()

      const courses: any[] = []

      snapshot.forEach((doc) => {
        courses.push({
          id: doc.id,
          ...doc.data(),
        })
      })

      return response.status(200).json(courses)
    } catch (err: any) {
      console.error(err)
      return response.status(500).json({ error: err.message })
    }
  }

  /**
   * GET /courses
   * Lista todos os cursos
   */
  public async index({ response }: HttpContext) {
    try {
      const snapshot = await this.collection.get()
      const courses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      return response.ok(courses)
    } catch (error) {
      console.error('Erro ao listar cursos:', error)
      return response.status(500).json({ error: 'Erro ao listar cursos' })
    }
  }

  /**
   * POST /courses
   * Cria um novo curso
   */
  public async store({ request, response }: HttpContext) {
    try {
      const { name, code, description, color } = request.only([
        'name',
        'code',
        'description',
        'color',
      ])

      if (!name || !code) {
        return response.badRequest({
          error: 'Os campos "name" e "code" são obrigatórios',
        })
      }

      const newCourse = {
        name,
        code,
        description: description || '',
        color: color || '#888888',
        createdAt: new Date(),
      }

      const docRef = await this.collection.add(newCourse)
      return response.created({ id: docRef.id, ...newCourse })
    } catch (error) {
      console.error('Erro ao criar curso:', error)
      return response.status(500).json({ error: 'Erro ao criar curso' })
    }
  }

  /**
   * GET /courses/:id
   * Retorna um curso específico
   */
  public async show({ params, response }: HttpContext) {
    try {
      const doc = await this.collection.doc(params.id).get()

      if (!doc.exists) {
        return response.status(404).json({ error: 'Curso não encontrado' })
      }

      return response.ok({ id: doc.id, ...doc.data() })
    } catch (error) {
      console.error('Erro ao buscar curso:', error)
      return response.status(500).json({ error: 'Erro ao buscar curso' })
    }
  }

  /**
   * PUT /courses/:id
   * Atualiza um curso
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const updates = request.only(['name', 'code', 'description', 'color'])
      const docRef = this.collection.doc(params.id)
      const doc = await docRef.get()

      if (!doc.exists) {
        return response.status(404).json({ error: 'Curso não encontrado' })
      }

      await docRef.update({ ...updates, updatedAt: new Date() })
      return response.ok({ id: params.id, ...updates })
    } catch (error) {
      console.error('Erro ao atualizar curso:', error)
      return response.status(500).json({ error: 'Erro ao atualizar curso' })
    }
  }

  /**
   * DELETE /courses/:id
   * Remove um curso
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const docRef = this.collection.doc(params.id)
      const doc = await docRef.get()

      if (!doc.exists) {
        return response.status(404).json({ error: 'Curso não encontrado' })
      }

      await docRef.delete()
      return response.ok({ message: 'Curso removido com sucesso' })
    } catch (error) {
      console.error('Erro ao excluir curso:', error)
      return response.status(500).json({ error: 'Erro ao excluir curso' })
    }
  }
}
