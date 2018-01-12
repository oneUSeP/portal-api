'use strict'

// Operations
const Operation = use('App/Operations/Operation')

// Utils
const HTTPResponse = use('App/Controllers/Http/HttpResponse')

const Database = use('Database')

const moment = require('moment')
const _ = require('lodash')

/**
 * Admission operation class
 *
 * @author glevinzon.dapal <glevinzon.dapal@usep.edu.ph>
 */
class AdmissionOperation extends Operation {

  constructor() {
    super()
    this.scenario = AdmissionOperation.scenarios.DEFAULT
    this.studentNo = null

    this.page = null
    this.count = null
    this.keyword = null
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
        studentNo: 'required',
        lastName: 'required',
        firstName: 'required',
        middleName: 'required',
        middleNameInitial: 'required',
        extName: 'required',
        dateOfBirth: 'required',
        placeOfBirth: 'required',
        gender: 'required',
        civilStatusId: 'required',
        religionId: 'required',
        nationalityId: 'required',
        resAddress: 'required',
        resStreet: 'required',
        resBarangay: 'required',
        resTownCity: 'required',
        resZipCode: 'required',
        resProvince: 'required',
        permAddress: 'required',
        permStreet: 'required',
        permBarangay: 'required',
        permTownCity: 'required',
        permZipCode: 'required',
        permProvince: 'required',
        email: 'required',
        telNo: 'required',
        mobileNo: 'required',
        bloodType: 'required',
        father: 'required',
        fatherOccupation: 'required',
        fatherIncome: 'required',
        mother: 'required',
        motherOccupation: 'required',
        motherIncome: 'required',
        emergencyContact: 'required',
        emergencyRelation: 'required',
        emergencyAddress: 'required',
        emergencyTelNo: 'required'
      }
    }

    return this.setRules(rules, customRules)
  }

  /**
   * Update Admission
   *
   * @returns Object
   */
  async update() {
    this.scenario = AdmissionOperation.scenarios.UPDATE

    let isValid = await this.validate()

    if (!isValid) {
      return false
    }

    let record = await Database.connection('es').table('ES_Students').where('StudentNo', this.studentNo).first()

    if (!record) {
      this.addError(HTTPResponse.STATUS_NOT_FOUND, 'Profile not found.')

      return false
    }

    try {
      await Database
        .connection('es')
        .table('ES_Students')
        .where('StudentNo', this.studentNo)
        .update({
          LastName: this.lastName,
          FirstName: this.firstName,
          MiddleName: this.middleName,
          MiddleInitial: this.middleNameInitial,
          ExtName: this.extName,
          DateOfBirth: this.dateOfBirth,
          PlaceOfBirth: this.placeOfBirth,
          Gender: this.gender,
          CivilStatusID: this.civilStatusId,
          ReligionID: this.religionId,
          NationalityID: this.nationalityId,
          Email: this.email,
          TelNo: this.telNo,
          MobileNo: this.mobileNo,
          BloodType: this.bloodType,
          Height: this.resAddress,
          Weight: this.resStreet,
          Res_Address: this.resAddress,
          Res_Street: this.resStreet,
          Res_Barangay: this.resBarangay,
          Res_TownCity: this.resTownCity,
          Res_ZipCode: this.resZipCode,
          Res_Province: this.resProvince,
          Perm_Address: this.permAddress,
          Perm_Street: this.permStreet,
          Perm_Barangay: this.permBarangay,
          Perm_TownCity: this.permTownCity,
          Perm_ZipCode: this.permZipCode,
          Perm_Province: this.permProvince,
          Father: this.father,
          Father_Occupation: this.fatherOccupation,
          Mother: this.fatherIncome,
          Mother_Occupation: this.motherOccupation,
          Emergency_Contact: this.emergencyContact,
          Emergency_Address: this.emergencyAddress,
          Emergency_MobileNo: this.emergencyMobileNo,
          LastModifiedDate: moment.utc().format('YYYY-MM-DD HH:mm:ss')
        })
      return await Database.table('ES_Admission').where('AppNo', this.appNo).first()
    } catch (e) {
      this.addError(e.status, e.message)

      return false
    }
  }

  async list() {
    try {
      return await Database
        .connection('es')
        .select('StudentNo',
        'LastName',
        'FirstName',
        'MiddleName',
        'MiddleInitial',
        'ExtName',
        'DateOfBirth',
        'PlaceOfBirth',
        'Gender',
        'CivilStatusID',
        'ReligionID',
        'NationalityID',
        'Email',
        'TelNo',
        'MobileNo',
        'BloodType',
        'Height',
        'Weight',
        'Res_Address',
        'Res_Street',
        'Res_Barangay',
        'Res_TownCity',
        'Res_ZipCode',
        'Res_Province',
        'Perm_Address',
        'Perm_Street',
        'Perm_Barangay',
        'Perm_TownCity',
        'Perm_ZipCode',
        'Perm_Province',
        'Father',
        'Father_Occupation',
        'Mother',
        'Mother_Occupation',
        'Emergency_Contact',
        'Emergency_Address',
        'Emergency_MobileNo',
        'StudentPicture',
        'LastModifiedDate')
        .table('ES_Students')
        .orderBy('LastModifiedDate', 'desc')
        .paginate(this.page, this.count)
    } catch (e) {
      this.addError(e.status, e.message)

      return false
    }
  }

  async search() {
    try {
      if (this.keyword && this.filter) {
        let filters = this.filter.split(',')
        let keyword = this.keyword
        return await Database
        .from('ES_Admission')
        .orderBy('AppDate', 'desc')
        .where(function () {
          if(filters.includes('is_reqcomplete')) {
            this.where('is_reqcomplete', 1)
          }
        })
        .where(function () {
          if(filters.includes('Email')) {
            this.whereRaw('Email LIKE \'%'+keyword+'%\'')
          }
        })
        .where(function () {
          if(filters.includes('FirstName')) {
            this.whereRaw('FirstName LIKE \'%'+keyword+'%\'')
          }
        })
        .where(function () {
          if(filters.includes('LastName')) {
            this.whereRaw('LastName LIKE \'%'+keyword+'%\'')
          }
        })
        .where(function () {
          if(filters.includes('TelNo')) {
            this.whereRaw('TelNo LIKE \'%'+keyword+'%\'')
          }
        })
        .where(function () {
          if(filters.includes('updated_at')) {
            this.whereRaw('updated_at >= ?', [moment('2017/01/01').format('YYYY-MM-DD')])
          }
        })
        .where(function () {
          this.whereRaw('AppDate >= ?', [moment('2017/01/01').format('YYYY-MM-DD')])
        })
        // .whereRaw('LastName LIKE \'%'+this.keyword+'%\'')
        .paginate(1, 2210)
      } else if (this.keyword) {
        return await Database
        .from('ES_Admission')
        .orderBy('AppDate', 'desc')
        .where(function () {
          this.whereRaw('AppDate >= ?', [moment('2017/01/01').format('YYYY-MM-DD')])
        })
        .whereRaw('LastName LIKE \'%'+this.keyword
                  +'%\' OR FirstName LIKE \'%'+this.keyword
                  +'%\' OR AppNo LIKE \'%'+this.keyword
                  +'%\' OR Email LIKE \'%'+this.keyword
                  +'%\' OR TelNo LIKE \'%'+this.keyword+'%\'')
        .paginate(1, 2210)
      }
    } catch (e) {
      this.addError(e.status, e.message)

      return false
    }
  }
}

module.exports = AdmissionOperation
