'use strict'
const { HttpException } = use('node-exceptions')
const AuthOperation = use('App/Operations/AuthOperation')

const User = use('App/Models/User')

class AuthController {
  /**
   * POST /auth/access-token
   * @param request
   * @param response
   */
  async accessToken ({auth, request, response}) {
    let op = new AuthOperation()
    op.accountID = request.input('accountId')
    op.accountPassword = request.input('accountPass')

    let user = await op.authenticate()

    if (!user) {
      let error = op.getFirstError()

      throw new HttpException(error.message, error.code)
    }

    let { token } = await auth.generate(user)

    response.send({ data: { user, accessToken: token} })
  }

  async me({auth, request, response}) {
    let userId = auth.user.id
    let user = await User.find(userId)

    if (!user) {
      throw new HttpException('User not found.', HttpResponse.STATUS_NOT_FOUND)
    }

    let data = user.toJSON()

    response.send({
      data
    })
  }
}

module.exports = AuthController
