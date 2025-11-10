import type { HttpContext } from '@adonisjs/core/http'
import { auth, db } from '../../config/firebase.js'

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
            const userDoc = await db.collection('users').doc(userRecord.uid).set({
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
            const { email, password } = request.only(['email', 'password'])
            console.log(email, password)
            const user = await auth.getUserByEmail(email)
            const token = await auth.createCustomToken(user.uid)

            return response.json({ uid: user.uid, token })
        } catch (err: any) {
            console.error(err)
            return response.status(400).json({ error: err.message })
        }
    }

}
