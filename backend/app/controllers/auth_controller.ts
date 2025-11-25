import type { HttpContext } from '@adonisjs/core/http'
import { auth, db } from '../../config/firebase.js'

export default class AuthController {
  public async signup({ request, response }: HttpContext) {
    try {
      const { email, password, name, courseRef } = request.only([
        'email',
        'password',
        'name',
        'courseRef',
      ])

      // Verifica se é email válido da instituição
      const regex = /^[a-zA-Z0-9._%+-]+@(?:aluno\.)?ifsp\.edu\.br$/
      if (!regex.test(email)) {
        return response.status(400).json({ error: 'Email não permitido' })
      }

      // Cria usuário no Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      })

      // Gera referência de curso
       const courseId = db.collection('courses').doc(courseRef)

      // Cria usuário no Firestore
      await db.collection('users').doc(userRecord.uid).set({
        name,
        email,
        courseId,
        profileId: null,
        isAdmin: false,
        workIds: [],
      })

      return response.status(201).json({ uid: userRecord.uid, email, name })
    } catch (err: any) {
      console.error(err)
      return response.status(500).json({ error: err.message })
    }
  }

  public async login({ request, response }: HttpContext) {
    try {
      const { email } = request.only(['email', 'password'])
      const userRecord = await auth.getUserByEmail(email)

      // Gera token de login
      const token = await auth.createCustomToken(userRecord.uid)

      // Busca dados do usuário no Firestore
      const userDoc = await db.collection('users').doc(userRecord.uid).get()
      if (!userDoc.exists) {
        return response.status(404).json({ error: 'Usuário não encontrado' })
      }

      const userData = userDoc.data()
      
      // Busca o curso (caso tenha cursoId)
      let courseData = null
      if (userData?.courseId) {
        const courseDoc = await userData.courseId.get()
        if (courseDoc.exists) {
          courseData = { id: courseDoc.id, name: courseDoc.data().name }
        }
      }

      // Monta o retorno
      const user = {
        id: userDoc.id,
        name: userData?.name,
        email: userData?.email,
        isAdmin: userData?.isAdmin,
        course: courseData,
      }

      return response.json({ token, user })
    } catch (err: any) {
      console.error(err)
      return response.status(400).json({ error: err.message })
    }
  }
}
