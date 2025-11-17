import type { HttpContext } from '@adonisjs/core/http'
import { db } from '../../config/firebase.js'
/**
 * Model {
  name - String
  code - String
  description - String
  color: - HexColor 
 */
export default class CoursesController {
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
}
