import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'
import ProfilesController from '#controllers/profiles_controller'
import WorksController from '#controllers/works_controller'
import CoursesController from '#controllers/courses_controller'
import LabelsController from '#controllers/labels_controller'
import AuthController from '#controllers/auth_controller'

router.get('/', async () => {
  return { message: 'API Online' }
})

router.post('/auth/signup', [AuthController, 'signup'])
router.post('/auth/login', [AuthController, 'login'])