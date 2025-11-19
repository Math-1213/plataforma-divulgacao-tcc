import router from '@adonisjs/core/services/router'
import CoursesController from '#controllers/courses_controller'
import AuthController from '#controllers/auth_controller'

// Default - Test
router.get('/', async () => {
  return { message: 'API Online' }
})

// CRUD
router.resource('courses', '#controllers/courses_controller').apiOnly()
router.resource('users', '#controllers/users_controller').apiOnly()
router.resource('profiles', '#controllers/profiles_controller').apiOnly()
router.resource('works', '#controllers/works_controller').apiOnly()
router.resource('labels', '#controllers/labels_controller').apiOnly()

// Auth
router.post('/auth/signup', [AuthController, 'signup'])
router.post('/auth/login', [AuthController, 'login'])
router.get('/courses/list',[CoursesController, 'listCourses'])
