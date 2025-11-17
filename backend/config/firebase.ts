// const serviceAccount = require('../serviceAccountKey.json')
import serviceAccount from '../serviceAccountKey.json' with { type: 'json' } // importa JSON no modo ESM
import admin, {ServiceAccount} from 'firebase-admin'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
})

export const db = admin.firestore()
export const auth = admin.auth()
export const storage = admin.storage()