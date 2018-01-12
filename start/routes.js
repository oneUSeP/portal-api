'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/guides/routing
|
*/

const Route = use('Route')

Route.get('/', 'WelcomeController.index')

Route.group('v1', () => {
  // Authorization
  Route.post('/auth/access-token', 'AuthController.accessToken')

  //Me
  Route.get('/me', 'AuthController.me').middleware(['auth:api'])

  // Students
  Route.post('/student', 'StudentController.save').middleware(['auth:api'])
  Route.put('/student', 'StudentController.update').middleware(['auth:api'])
  Route.get('/student/:id', 'StudentController.show').middleware(['auth:api'])
  Route.get('/students', 'StudentController.list').middleware(['auth:api'])
  Route.delete('/student/:id', 'StudentController.delete').middleware(['auth:api'])
}).prefix('/v1')
