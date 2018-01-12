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
    this.appNo = null

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

    let record = await Database.table('ES_Admission').where('AppNo', this.appNo).first()

    if (!record) {
      this.addError(HTTPResponse.STATUS_NOT_FOUND, 'Admission not found.')

      return false
    }

    try {
      await Database
        .table('ES_Admission')
        .where('AppNo', this.appNo)
        .update({
          LastName: this.lastName,
          FirstName: this.firstName,
          MiddleName: this.middleName,
          DateOfBirth: this.dateOfBirth,
          Gender: this.gender,
          CivilStatusID: this.civilStatusId,
          Res_Barangay: this.resBarangay,
          Res_TownCity: this.resTownCity,
          Email: this.email,
          TelNo: this.telNo,
          TermID: this.termId,
          Choice1_CampusID: this.choice1CampusId,
          Choice1_Course: this.choice1Course,
          Choice1_CourseMajor: this.choice1CourseMajor,
          Choice2_CampusID: this.choice2CampusId,
          Choice2_Course: this.choice2Course,
          Choice2_CourseMajor: this.choice2CourseMajor,
          Choice3_CampusID: this.choice3CampusId,
          Choice3_Course: this.choice3Course,
          Choice3_CourseMajor: this.choice3CourseMajor,
          Father: this.father,
          Father_Occupation: this.fatherOccupation,
          Father_Income: this.fatherIncome,
          Mother: this.mother,
          Mother_Occupation: this.motherOccupation,
          Mother_Income: this.motherIncome,
          Emergency_Contact: this.emergencyContact,
          emergency_relation: this.emergencyRelation,
          Emergency_Address: this.emergencyAddress,
          Emergency_TelNo: this.emergencyTelNo,
          Elem_School: this.elemSchool,
          Elem_Address: this.elemAddress,
          Elem_InclDates: this.elemInclDates,
          HS_School: this.hsSchool,
          HS_Address: this.hsAddress,
          HS_InclDates: this.hsInclDates,
          College_School: this.collegeSchool,
          College_Address: this.collegeAddress,
          College_InclDates: this.collegeInclDates,
          Track_ID: this.trackId,
          Strand_ID: this.strandId,
          Other_Strand: this.otherStrand,
          Grade_9: this.grade9,
          Grade_10: this.grade10,
          Grade_11: this.grade11,
          Grade_12: this.grade12,
          ES_Test_Center: this.testingCenter,
          is_reqcomplete: this.isReqComplete,
          TestingSchedID: this.testingSched,
          updated_at: moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss'),
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
