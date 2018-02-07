'use strict'

const { HttpException } = use('node-exceptions')
const HttpResponse = use('App/Controllers/Http/HttpResponse')
const Database = use('Database')

class GradeController {
  async showAyTerms ({request, response, params}) {
    let ayterms = await Database.connection('es').raw('EXEC sp_GradesAYTerm ?;', [params.id])

    response.send({
      data: { ayterms }
    })
  }
  async showGrades ({request, response, params}) {
    let extraDetails = await Database.connection('es')
                                    .raw('SELECT TOP 1 \
                                        dbo.fn_StudentName(s.StudentNo) AS StudentName, \
                                        dbo.fn_ProgramCollegeName(s.ProgID) AS CollegeName, \
                                        dbo.fn_GetProgramNameWithMajor(s.ProgID,s.MajorDiscID) AS Program , \
                                        dbo.fn_CurriculumCode(s.CurriculumID) AS Curriculum, \
                                        dbo.fn_ProgramClassCode(r.ProgID) as ProgClass, \
                                        dbo.fn_YearLevel2(r.YearLevelID,dbo.fn_ProgramClassCode(r.ProgID)) as YearLevel, \
                                        dbo.fn_SectionName(r.ClassSectionID) as SectionName \
                                        FROM ES_Students s \
                                        LEFT JOIN ES_Registrations r ON s.StudentNo=r.StudentNo and r.TermID= ? \
                                        WHERE s.StudentNo = ?', [params.termId, params.id])
    let grades = await Database.connection('es').raw('EXEC po_reportofgrades @TermID= ? , @StudentNo= ?;', [params.termId, params.id])
    let summary = await Database.connection('es').raw('exec sp_GradeSummary ?, ?', [params.id, params.termId])

    response.send({
      data: { extraDetails, grades, summary }
    })
  }
}

module.exports = GradeController
