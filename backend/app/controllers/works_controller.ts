import type { HttpContext } from '@adonisjs/core/http'
import { db } from '../../config/firebase.js'
/**
 * Model {
 * title - String
 * description - Stirng
 * authorIds - List[Ids]
 * labelsIds - ID
 * creationDate - Date
 * courseId - ID
 */
export default class WorksController {
  private collection = db.collection('works')

  /**
   * GET /works
   * Retorna todos os trabalhos
   */
  public async index({ response }: HttpContext) {
    try {
      const snapshot = await this.collection.get()

      const works = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data()

          const creationDate = data.creationDate?._seconds
            ? new Date(data.creationDate._seconds * 1000).toISOString()
            : null

          const authors = await Promise.all(
            (data.authorIds || []).map(async (ref: FirebaseFirestore.DocumentReference) => {
              const userId = ref.path.split('/')[1]
              if (!userId) return null

              const userDoc = await db.collection('users').doc(userId).get()
              if (!userDoc.exists) return null

              const userData = userDoc.data()
              return {
                name: userData?.name || null,
              }
            })
          )

          let course = null
          const courseId = data.courseId?._path?.segments?.[1]
          if (courseId) {
            const courseDoc = await db.collection('courses').doc(courseId).get()
            if (courseDoc.exists) {
              const courseData = courseDoc.data()
              course = {
                id: courseDoc.id,
                name: courseData?.name || null,
              }
            }
          }

          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            creationDate,
            authors: authors.filter(Boolean), // remove nulos
            course,
            labelsIds: data.labelsIds || [],
          }
        })
      )

      return response.ok(works)
    } catch (error) {
      console.error('Erro ao listar trabalhos:', error)
      return response.status(500).json({ error: 'Erro ao listar trabalhos' })
    }
  }

  /**
   * POST /works
   * Cria um novo trabalho
   */
  public async store({ request, response }: HttpContext) {
    try {
      const { title, description, authorIds, labelsIds, creationDate, courseId } = request.body()

      const authorRefs = authorIds.map((path: string) => {
        const cleanPath = path.replace(/^\/+/, '')
        return db.doc(cleanPath)
      })

      const labelRefs = labelsIds.map((path: string) => {
        const cleanPath = path.replace(/^\/+/, '')
        return db.doc(cleanPath)
      })

      const courseRef = db.collection('courses').doc(courseId)

      const newWork = {
        title,
        description,
        authorIds: authorRefs,
        labelsIds: labelRefs,
        creationDate: new Date(creationDate),
        courseId: courseRef,
      }

      const workRef = await db.collection('works').add(newWork)

      return response.status(201).json({ id: workRef.id, ...newWork })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * GET /works/:id
   * Retorna um trabalho específico
   */
  public async show({ params, response }: HttpContext) {
    try {
      const doc = await this.collection.doc(params.id).get()
      if (!doc.exists) {
        return response.status(404).json({ error: 'Trabalho não encontrado' })
      }
      return response.ok({ id: doc.id, ...doc.data() })
    } catch (error) {
      console.error('Erro ao buscar trabalho:', error)
      return response.status(500).json({ error: 'Erro ao buscar trabalho' })
    }
  }

  /**
   * PUT /works/:id
   * Atualiza um trabalho existente
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const updates = request.only([
        'title',
        'description',
        'authorIds',
        'labelsIds',
        'creationDate',
        'courseId',
      ])

      const docRef = this.collection.doc(params.id)
      const doc = await docRef.get()

      if (!doc.exists) {
        return response.status(404).json({ error: 'Trabalho não encontrado' })
      }

      await docRef.update(updates)
      return response.ok({ id: params.id, ...updates })
    } catch (error) {
      console.error('Erro ao atualizar trabalho:', error)
      return response.status(500).json({ error: 'Erro ao atualizar trabalho' })
    }
  }

  /**
   * DELETE /works/:id
   * Remove um trabalho
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const docRef = this.collection.doc(params.id)
      const doc = await docRef.get()

      if (!doc.exists) {
        return response.status(404).json({ error: 'Trabalho não encontrado' })
      }

      await docRef.delete()
      return response.ok({ message: 'Trabalho removido com sucesso' })
    } catch (error) {
      console.error('Erro ao excluir trabalho:', error)
      return response.status(500).json({ error: 'Erro ao excluir trabalho' })
    }
  }
}
