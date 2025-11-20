import type { HttpContext } from '@adonisjs/core/http'
import { auth, db } from '../../config/firebase.js'
import axios from 'axios'

export default class AuthController {
  public async signup({ request, response }: HttpContext) {
    try {
      const { email, password, name, courseId } = request.only([
        'email',
        'password',
        'name',
        'courseId',
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
    const { email, password } = request.only(['email', 'password'])

    try {
      const loginReq = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )

      const { localId: uid } = loginReq.data

      const userDoc = await db.collection('users').doc(uid).get()

      if (!userDoc.exists) {
        return response.status(404).json({ error: 'Usuário não encontrado' })
      }

      const userData = userDoc.data()

      let courseData = null
      if (userData?.courseId) {
        const courseDoc = await userData.courseId.get()
        if (courseDoc.exists) {
          courseData = { id: courseDoc.id, name: courseDoc.data().name }
        }
      }

      const user = {
        name: userData?.name,
        email: userData?.email,
        isAdmin: userData?.isAdmin,
        course: courseData,
        uid,
      }

      return response.json({
        token: loginReq.data.idToken,
        user,
      })
    } catch (error: any) {
      console.error(error.response?.data || error.message)

      return response.status(401).json({
        error: 'Email ou senha inválidos',
      })
    }
  }
}
