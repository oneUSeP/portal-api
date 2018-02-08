'use strict'

const { HttpException } = use('node-exceptions')
const HttpResponse = use('App/Controllers/Http/HttpResponse')
const Database = use('Database')

class GradeController {
  async showAyTerms ({request, response, params}) {
    let ayterms = await Database.connection('es').raw('EXEC sp_GradesAYTerm ?;', [params.id])

    response.send(
      {data: ayterms}
    )
  }
  async showGrades ({request, response, params}) {
    let { progClass } = request.all()
    let yearLvlId = ''
    let sectionId = ''
    let remarks = ''
    let grades = null

    if((progClass && progClass > 20) || progClass =='') {
      grades = await Database.connection('es').raw('EXEC po_reportofgrades @TermID= ? , @StudentNo= ?;', [params.termId, params.id])
    } else {
      grades = await Database.connection('es').raw('EXEC ES_rptIBED_ReportCards @TermID=?, @YearLevelID=?, @SectionID=?, @StudentNo=?,  @Remarks=?', [params.termId, yearLvlId, sectionId, params.id, remarks])
    }

    let summary = await Database.connection('es').raw('exec sp_GradeSummary ?, ?', [params.id, params.termId])

    response.send({
      data: { grades, summary }
    })
  }
}

module.exports = GradeController
