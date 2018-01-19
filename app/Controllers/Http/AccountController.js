'use strict'

const { HttpException } = use('node-exceptions')
const AccountOperation = use('App/Operations/AccountOperation')
const HttpResponse = use('App/Controllers/Http/HttpResponse')
const Database = use('Database')

class AccountController {
  async list ({request, response}) {
    let op = new AccountOperation()
    let { page, count } = request.all()

    op.page = page
    op.count = count

    let accounts = await op.list()

    response.send({
      data: { accounts }
    })
  }
}

module.exports = AccountController
