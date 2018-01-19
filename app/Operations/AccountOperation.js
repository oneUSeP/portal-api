'use strict'

// Operations
const Operation = use('App/Operations/Operation')

// Utils
const HTTPResponse = use('App/Controllers/Http/HttpResponse')

const Database = use('Database')

/**
 * Admission operation class
 *
 * @author glevinzon.dapal <glevinzon.dapal@usep.edu.ph>
 */
class AdmissionOperation extends Operation {

  constructor() {
    super()
    this.scenario = AdmissionOperation.scenarios.DEFAULT
    this.accountNo = null

    this.page = null
    this.count = null
  }

  static get scenarios() {
    return {
      DEFAULT: 'default',
      CREATE: 'create',
      UPDATE: 'update',
    }
  }

  get rules() {
    const rules = {}

    const {
      CREATE,
      UPDATE
    } = AdmissionOperation.scenarios

    const customRules = {
      [CREATE]: {
      },
      [UPDATE]: {
        accountNo: 'required'
      }
    }

    return this.setRules(rules, customRules)
  }

  async list() {
    try {
      return await Database
        .connection('mssql')
        .table('users')
        .orderBy('updated_at', 'desc')
        .paginate(this.page, this.count)
    } catch (e) {
      this.addError(e.status, e.message)

      return false
    }
  }
}

module.exports = AdmissionOperation
