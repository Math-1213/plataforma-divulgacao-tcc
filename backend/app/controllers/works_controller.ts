import type { HttpContext } from '@adonisjs/core/http'
import { db, auth, storage } from '../../config/firebase.js'
import { v4 as uuidv4 } from 'uuid' // Para nomes de arquivo únicos

export default class WorksController {
  /**
   * Cria um novo trabalho com upload de arquivo (POST /works)
   */
  public async store({ request, response }: HttpContext) {

    // 2. Lógica do método
    try {
      // 2a. Pegar o arquivo
      const workFile = request.file('work_file', {
        size: '10mb', // Limite de 10MB
        // Defina os tipos de arquivo que você aceita
        extnames: ['pdf', 'doc', 'docx', 'zip', 'png', 'jpg', 'txt'],
      })

      if (!workFile) {
        return response.status(400).json({ error: 'Nenhum arquivo enviado.' })
      }

      // 2b. Pegar os campos de texto
      const { title, description, authorIds: authorIdsString, labelsIds: labelsIdsString, courseId, uploaderId } =
        request.only(['title', 'description', 'authorIds', 'labelsIds', 'courseId', 'uploaderId'])

      // 2c. Converter campos de array (que vêm como string)
      let authorIds = []
      let labelsIds = []
      try {
        authorIds = authorIdsString ? JSON.parse(authorIdsString) : []
        labelsIds = labelsIdsString ? JSON.parse(labelsIdsString) : []
      } catch (e) {
        return response.status(400).json({ error: 'Formato inválido para authorIds ou labelsIds.' })
      }

      if (!title || !authorIds || !Array.isArray(authorIds) || authorIds.length === 0) {
        return response.status(400).json({
          error: 'Título e pelo menos um ID de autor são obrigatórios.',
        })
      }

      // 3. Fazer o upload para o Firebase Storage
      const bucket = storage.bucket() // Pega o bucket padrão
      const fileName = `works/${uploaderId}/${uuidv4()}-${workFile.clientName}`
      
      // Faz o upload a partir do caminho temporário que o Adonis criou
      await bucket.upload(workFile.tmpPath!, {
        destination: fileName,
        public: true, // Torna o arquivo publicamente legível
      })

      // 4. Obter a URL pública de download
      const fileURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`

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
        fileURL: fileURL,
        fileName: workFile.clientName,
        fileSize: workFile.size,
        fileType: workFile.extname,
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

      if (snapshot.empty) {
        return response.json([])
      }

      const works = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

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
      const snapshot = await db
        .collection('works')
        .where('authorIds', 'array-contains', userId)
        .orderBy('creationDate', 'desc')
        .get()

      if (snapshot.empty) {
        return response.json([])
      }

      const works = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

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
      const { title, description, labelsIds } = request.only([
        'title',
        'description',
        'labelsIds',
      ])

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
}
