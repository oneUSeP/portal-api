'use strict'

const Operation = use('App/Operations/Operation')
const EsStudent = use('App/Models/EsStudent')
const HrEmployee = use('App/Models/HrEmployee')
const User = use('App/Models/User')
const HttpResponse = use('App/Controllers/Http/HttpResponse')
const Hash = use('Hash')

/**
 * Operations for Authenticating the user
 *
 * @author glevinzon.dapal <glevinzon.dapal@usep.edu.ph>
 */
class AuthOperation extends Operation {

  constructor() {
    super()

    this.accountID = null
    this.accountPassword = null
  }

  /**
   * Set rules for validation
   */
  get rules() {
    return {
      accountID: 'required',
      accountPassword: 'required'
    }
  }

  /**
   * Set validation messages
   *
   * @returns {{}}
   */
  get messages() {
    return {
      required: '{{field}} is required.'
    }
  }

  /**
   * Validates and authenticate user login
   *
   * @returns {boolean|Object}
   */
  async authenticate() {
    let valid = await this.validate()

    if (!valid) {
      return false
    }

    try {
      let user = await HrEmployee.find(this.accountID)

      if (!user) {
        user = await EsStudent.find(this.accountID)

        if (!user) {
          this.addError(HttpResponse.STATUS_NOT_FOUND, 'Account does not exist.')
          return false
        }
      }

      let account = await User.findBy('username', this.accountID)

      if (account) {
        //if account existed, compare password
        let isPasswordVerified = await Hash.verify(this.accountPassword, account.password)

        if (!isPasswordVerified) {
          this.addError(HttpResponse.STATUS_UNAUTHORIZED, 'Invalid username or password.')

          return false
        }
      } else {
        //if no account, create one with respect to ES_Students and HR_Employees table
        let newUser = new User()

        newUser.username = user.EmployeeID || user.StudentNo
        newUser.email = user.Email || ''
        newUser.password = this.accountPassword
        newUser.role = 'user'

        await newUser.save()

        if (newUser) {
          return newUser
        }
      }

      return account

    } catch (error) {
      this.addError(HttpResponse.STATUS_INTERNAL_SERVER_ERROR, error.message)

      return false
    }
  }
}

module.exports = AuthOperation
