import type { HttpContext } from '@adonisjs/core/http'
import { db, auth } from '../../config/firebase.js'
import app from '@adonisjs/core/services/app'
import fs from 'fs'
import path from 'path'

export default class WorksController {
  /**
   * Cria um novo trabalho com upload de arquivo (POST /works)
   */
  public async store({ request, response }: HttpContext) {
    // 2. Lógica do método
    try {
      // 2a. Pegar o arquivo
      console.log(request.body())
      const workFile = request.file('work_file', {
        size: '10mb', // Limite de 10MB
        // Defina os tipos de arquivo que você aceita
        extnames: ['pdf', 'doc', 'docx', 'zip', 'png', 'jpg', 'txt'],
      })
      console.log('Workfile: ', workFile)

      if (!workFile) {
        return response.status(400).json({ error: 'Nenhum arquivo enviado.' })
      }

      // 2b. Pegar os campos de texto
      const {
        title,
        description,
        authorIds: authorIdsString,
        labelsIds: labelsIdsString,
        courseId,
        uploaderId,
      } = request.only(['title', 'description', 'authorIds', 'labelsIds', 'courseId', 'uploaderId'])

      // 2c. Converter campos de array (que vêm como string)
      let authorIds = []
      let labelsIds = []
      try {
        authorIds = authorIdsString ? JSON.parse(authorIdsString) : []
        labelsIds = labelsIdsString ? JSON.parse(labelsIdsString) : []
        authorIds.push(uploaderId)
      } catch (e) {
        return response.status(400).json({ error: 'Formato inválido para authorIds ou labelsIds.' })
      }

      if (!title || !authorIds || !Array.isArray(authorIds) || authorIds.length === 0) {
        return response.status(400).json({
          error: 'Título e pelo menos um ID de autor são obrigatórios.',
        })
      }

      // 3. Salvar arquivo localmente
      const fileName = `${new Date().getTime()}-${workFile.clientName}`
      const uploadPath = app.tmpPath('uploads/works')
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true })
      }
      await workFile.move(uploadPath, {
        name: fileName,
        overwrite: true,
      })

      // URL local para acessar o arquivo
      const fileURL = `/uploads/works/${fileName}`

      // 5. Salvar metadados no Firestore
      const finalAuthorIds = [...new Set([...authorIds, uploaderId])]
      const newWorkRef = db.collection('works').doc()

      const newWorkData = {
        title,
        description: description || '',
        authorIds: finalAuthorIds,
        labelsIds: labelsIds || [],
        courseId: courseId || null,
        uploaderId: uploaderId,
        creationDate: new Date(),

        // --- Novos campos do arquivo ---
        fileName: workFile.clientName,
        fileSize: workFile.size,
        fileType: workFile.extname,
        fileURL: fileURL,
      }

      await newWorkRef.set(newWorkData)

      // 6. Atualizar 'workIds' nos documentos dos usuários
      const updatePromises = finalAuthorIds.map(async (uid) => {
        const userRef = db.collection('users').doc(uid)
        try {
          const userDoc = await userRef.get()
          if (!userDoc.exists) return
          const userData = userDoc.data()
          const workIds = userData?.workIds || []
          if (!workIds.includes(newWorkRef.id)) {
            workIds.push(newWorkRef.id)
            await userRef.update({ workIds: workIds })
          }
        } catch (err) {
          console.error(`Falha ao atualizar usuário ${uid}:`, err)
        }
      })

      await Promise.all(updatePromises)

      return response.status(201).json({ id: newWorkRef.id, ...newWorkData })
    } catch (err: any) {
      console.error('Erro ao criar trabalho:', err)
      return response.status(500).json({ error: err.message, stack: err.stack })
    }
  }

  public async index({ request, response }: HttpContext) {
    try {
      const { courseId } = request.qs()
      let query = db.collection('works')

      if (courseId) {
        query = query.where('courseId', '==', courseId) as any
      }

      const snapshot = await query.orderBy('creationDate', 'desc').get()
      if (snapshot.empty) return response.json([])

      const works = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data()

          // ---------- CONVERTE DATA ----------
          let creationDate = null
          if (data.creationDate?.seconds) {
            creationDate = new Date(data.creationDate.seconds * 1000).toISOString()
          }

          // ---------- RESOLVE AUTORES ----------
          let authors: any[] = []

          if (Array.isArray(data.authorIds)) {
            authors = await Promise.all(
              data.authorIds.map(async (a) => {
                // Caso venha como ID (string)
                if (typeof a === 'string') {
                  const ref = db.collection('users').doc(a)
                  const snap = await ref.get()
                  return { id: a, ...snap.data() }
                }

                // Caso venha como DocumentReference
                if (a.get) {
                  const snap = await a.get()
                  return { id: snap.id, ...snap.data() }
                }

                return null
              })
            )
          }

          // ---------- RESOLVE CURSO ----------
          let course = null

          if (data.courseId) {
            if (typeof data.courseId === 'string') {
              // veio como string
              const ref = db.collection('courses').doc(data.courseId)
              const snap = await ref.get()
              if (snap.exists) {
                course = { id: snap.id, ...snap.data() }
              }
            } else if (data.courseId.get) {
              // veio como DocumentReference
              const snap = await data.courseId.get()
              if (snap.exists) {
                course = { id: snap.id, ...snap.data() }
              }
            }
          }

          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            creationDate,
            authors,
            course,
            labels: data.labelsIds ?? [],
            uploaderId: data.uploaderId ?? null,
            fileName: data.fileName ?? null,
            fileSize: data.fileSize ?? null,
            fileType: data.fileType ?? null,
            fileURL: data.fileURL ?? null,
          }
        })
      )

      return response.json(works)
    } catch (err: any) {
      console.error('Erro ao listar trabalhos:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  /**
   * Lista trabalhos do usuário logado (GET /my-works)
   */
  public async myWorks({ request, response }: HttpContext) {
    let userId: string | null

    // OBTENDO O userId DO TOKEN (Lógica de Autenticação)
    try {
      const authHeader = request.header('Authorization')
      if (!authHeader) {
        // Se não houver token, retorna 401 imediatamente
        return response.status(401).json({ error: 'Token de autorização ausente.' })
      }
      const token = authHeader.replace('Bearer ', '')
      const decodedToken = await auth.verifyIdToken(token)
      userId = decodedToken.uid // <--- userId FINAL É OBTIDO AQUI!

      if (!userId) {
        return response.status(401).json({ error: 'Token inválido ou expirado.' })
      }
    } catch (err) {
      // Captura falhas de verificação de token (expirado, inválido, etc.)
      return response.status(401).json({ error: 'Token inválido ou expirado.' })
    }

    // 2. Lógica do método (Agora com userId VÁLIDO e SEGURO)
    try {
      const snapshot = await db
        .collection('works')
        .where('authorIds', 'array-contains', userId) // <-- Usa o userId obtido do token
        .orderBy('creationDate', 'desc')
        .get()
      // Mapeamento de dados
      const works = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data()
          // Simplificado para retornar apenas os dados brutos se o mapeamento for muito longo
          return { id: doc.id, ...data }
        })
      )

      return response.json(works)
    } catch (err: any) {
      console.error('Erro ao buscar "meus trabalhos":', err)
      return response.status(500).json({ error: err.message })
    }
  }

  /**
   * Busca um único trabalho pelo ID (GET /works/:id)
   * (Não precisa de autenticação)
   */
  public async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      const docRef = db.collection('works').doc(id)
      const doc = await docRef.get()

      if (!doc.exists) {
        return response.status(404).json({ error: 'Trabalho não encontrado.' })
      }

      return response.json({ id: doc.id, ...doc.data() })
    } catch (err: any) {
      console.error('Erro ao buscar trabalho:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  /**
   * Atualiza um trabalho (PUT /works/:id)
   */
  public async update({ params, request, response }: HttpContext) {
    let userId: string | null
    try {
      // 1. Verifica a autenticação manualmente
      const authHeader = request.header('Authorization')
      if (!authHeader) {
        return response.status(401).json({ error: 'Token de autorização ausente.' })
      }
      const token = authHeader.replace('Bearer ', '')
      const decodedToken = await auth.verifyIdToken(token)
      userId = decodedToken.uid

      if (!userId) {
        return response.status(401).json({ error: 'Token inválido ou expirado.' })
      }
    } catch (err) {
      return response.status(401).json({ error: 'Token inválido ou expirado.' })
    }

    // 2. Lógica do método
    try {
      const { id } = params
      const { title, description, labelsIds } = request.only(['title', 'description', 'labelsIds'])

      const docRef = db.collection('works').doc(id)
      const doc = await docRef.get()

      if (!doc.exists) {
        return response.status(404).json({ error: 'Trabalho não encontrado.' })
      }

      const workData = doc.data()
      if (!workData?.authorIds.includes(userId)) {
        return response
          .status(403)
          .json({ error: 'Você não tem permissão para editar este trabalho.' })
      }

      await docRef.update({
        title,
        description,
        labelsIds,
      })

      return response.json({ message: 'Trabalho atualizado com sucesso.' })
    } catch (err: any) {
      console.error('Erro ao atualizar trabalho:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  /**
   * Deleta um trabalho (DELETE /works/:id)
   */
  public async destroy({ params, request, response }: HttpContext) {
    let userId: string | null
    try {
      // 1. Verifica a autenticação manualmente
      const authHeader = request.header('Authorization')
      if (!authHeader) {
        return response.status(401).json({ error: 'Token de autorização ausente.' })
      }
      const token = authHeader.replace('Bearer ', '')
      const decodedToken = await auth.verifyIdToken(token)
      userId = decodedToken.uid

      if (!userId) {
        return response.status(401).json({ error: 'Token inválido ou expirado.' })
      }
    } catch (err) {
      return response.status(401).json({ error: 'Token inválido ou expirado.' })
    }

    // 2. Lógica do método
    try {
      const { id } = params // ID do trabalho

      const docRef = db.collection('works').doc(id)
      const doc = await docRef.get()

      if (!doc.exists) {
        return response.status(404).json({ error: 'Trabalho não encontrado.' })
      }

      const workData = doc.data()
      if (!workData?.authorIds.includes(userId) && workData?.uploaderId !== userId) {
        return response
          .status(403)
          .json({ error: 'Você não tem permissão para deletar este trabalho.' })
      }

      await docRef.delete()

      const authorIds = workData?.authorIds || []
      const updatePromises = authorIds.map(async (uid: string) => {
        const userRef = db.collection('users').doc(uid)
        try {
          const userDoc = await userRef.get()
          if (!userDoc.exists) return

          const userData = userDoc.data()
          let workIds = userData?.workIds || []

          if (workIds.includes(id)) {
            workIds = workIds.filter((workId: string) => workId !== id)
            await userRef.update({ workIds: workIds })
          }
        } catch (err) {
          console.error(`Falha ao atualizar usuário ${uid}:`, err)
        }
      })

      await Promise.all(updatePromises)

      return response.status(204).json('')
    } catch (err: any) {
      console.error('Erro ao deletar trabalho:', err)
      return response.status(500).json({ error: err.message })
    }
  }

  public async getWorkFile({ params, response }: HttpContext) {
    const filePath = app.tmpPath(`uploads/works/${params.filename}`)
    return response.download(filePath)
  }
}
