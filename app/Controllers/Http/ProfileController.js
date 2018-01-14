'use strict'

const { HttpException } = use('node-exceptions')
const ProfileOperation = use('App/Operations/ProfileOperation')
const HttpResponse = use('App/Controllers/Http/HttpResponse')
const Database = use('Database')

var ab2str = require('arraybuffer-to-string')

class ProfileController {
  async list ({request, response}) {
    let op = new ProfileOperation()
    let { page, count } = request.all()

    op.page = page
    op.count = count

    let profiles = await op.list()

    response.send({
      data: { profiles }
    })
  }

  async update({request, response}) {
    let op = new ProfileOperation()
    op.studentNo = '' + request.input('studentNo')
    op.lastName = '' + request.input('lastName')
    op.firstName = '' + request.input('firstName')
    op.middleName = '' + request.input('middleName')
    op.middleNameInitial = '' + request.input('middleNameInitial')
    op.extName = '' + request.input('extName')
    op.dateOfBirth = '' + request.input('dateOfBirth')
    op.placeOfBirth = '' + request.input('placeOfBirth')
    op.gender = '' + request.input('gender')
    op.civilStatusId = '' + request.input('civilStatusId')
    op.religionId = '' + request.input('religionId')
    op.nationalityId = '' + request.input('nationalityId')
    op.email = '' + request.input('email')
    op.telNo = '' + request.input('telNo')
    op.mobileNo = '' + request.input('mobileNo')
    op.bloodType = '' + request.input('bloodType')
    op.resAddress = '' + request.input('resAddress')
    op.resStreet = '' + request.input('resStreet')
    op.resBarangay = '' + request.input('resBarangay')
    op.resTownCity = '' + request.input('resTownCity')
    op.resZipCode = '' + request.input('resZipCode')
    op.resProvince = '' + request.input('resProvince')
    op.permAddress = '' + request.input('permAddress')
    op.permStreet = '' + request.input('permStreet')
    op.permBarangay = '' + request.input('permBarangay')
    op.permTownCity = '' + request.input('permTownCity')
    op.permZipCode = '' + request.input('permZipCode')
    op.permProvince = '' + request.input('permProvince')
    op.father = '' + request.input('father')
    op.fatherOccupation = '' + request.input('fatherOccupation')
    op.fatherIncome = '' + request.input('fatherIncome')
    op.mother = '' + request.input('mother')
    op.motherOccupation = '' + request.input('motherOccupation')
    op.motherIncome = '' + request.input('motherIncome')
    op.emergencyContact = '' + request.input('emergencyContact')
    op.emergencyRelation = '' + request.input('emergencyRelation')
    op.emergencyAddress = '' + request.input('emergencyAddress')
    op.emergencyMobileNo = '' + request.input('emergencyMobileNo')

    let profile = await op.update()

    if (profile === false) {
      let error = op.getFirstError()

      throw new HttpException(error.message, error.code)
    }

    response.send({ data: { profile } })
  }

  async search ({request, response}) {
    let op = new ProfileOperation()
    let { keyword, filter } = request.all()
    op.keyword = keyword
    op.filter = filter
    let profiles = await op.search()

    response.send({
      data: { profiles }
    })
  }

  async show ({request, response, params}) {
    let profile = await Database.connection('es')
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
                        .from('ES_Students')
                        .where('StudentNo', params.id)
                        .first()
    let studentPicture = await Database.connection('es')
                        .select('StudentPicture')
                        .from('ES_Students')
                        .where('StudentNo', params.id)
                        .first()

    profile.StudentPicture = ab2str(studentPicture.StudentPicture, 'base64')

    response.send({
      data: { profile }
    })
  }
}

module.exports = ProfileController
