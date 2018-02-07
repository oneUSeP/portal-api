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

  // Profile
  Route.post('/profile', 'ProfileController.save').middleware(['auth:api'])
  Route.put('/profile', 'ProfileController.update').middleware(['auth:api'])
  Route.get('/profile/:id', 'ProfileController.show').middleware(['auth:api'])
  // Route.get('/profiles', 'ProfileController.list').middleware(['auth:api'])
  // Route.delete('/profile/:id', 'ProfileController.delete').middleware(['auth:api'])

  // Account
  Route.get('/accounts', 'AccountController.list').middleware(['auth:api'])

  Route.get('/me/ayterms/:id', 'GradeController.showAyTerms').middleware(['auth:api'])
  Route.get('/me/grades/:id/:termId', 'GradeController.showGrades').middleware(['auth:api'])

}).prefix('/v1')
