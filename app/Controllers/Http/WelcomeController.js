'use strict'

class WelcomeController {

  /**
   * GET /
   *
   * @param request
   * @param response
   */
  async index ({request, response}) {
    response.send({
      message: 'USEP-Portal API',
      environment: process.env.NODE_ENV,
    })
  }
}

module.exports = WelcomeController
