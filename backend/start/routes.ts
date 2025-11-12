import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'
import ProfilesController from '#controllers/profiles_controller'
import WorksController from '#controllers/works_controller'
import CoursesController from '#controllers/courses_controller'
import LabelsController from '#controllers/labels_controller'
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
