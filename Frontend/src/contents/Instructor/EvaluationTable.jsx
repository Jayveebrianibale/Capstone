"use client"
import { useState, useEffect } from "react"
import { Download } from "lucide-react"

const SCHOOL_YEARS = ["2022 - 2023", "2023 - 2024", "2024 - 2025", "2025 - 2026"]

const SEMESTER_OPTIONS_BY_YEAR = {
  "2022 - 2023": ["1st Semester", "2nd Semester"],
  "2023 - 2024": ["1st Semester", "2nd Semester"],
  "2024 - 2025": ["1st Semester", "2nd Semester"],
  "2025 - 2026": ["1st Semester", "2nd Semester"],
}

export function EvaluationTable() {
  const COMMENTS_PER_PAGE = 5
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("2024 - 2025")
  const [selectedSemester, setSelectedSemester] = useState("1st Semester")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setSelectedSemester("1st Semester")
    setCurrentPage(1)
  }, [selectedSchoolYear])

  const evaluationData = [
    { id: 1, question: "Q1. Learning Environments: Rate the classroom environment in terms of positivity and its impact on your learning experience.", score: 4 },
    { id: 2, question: "Q2. Student Development: How well did the teacher support your intellectual, social, emotional, and physical development?", score: 4 },
    { id: 3, question: "Q3. Content Knowledge: How would you rate the teacher's depth of knowledge in the subject matter?", score: 5 },
    { id: 4, question: "Q4. Application of Content: How effectively did the teacher help you apply the knowledge gained in practical situations?", score: 3 },
    { id: 5, question: "Q5. Planning for Instruction: Evaluate the clarity and organization of lessons and instructional materials.", score: 4 },
    { id: 6, question: "Q6. Teaching Strategies: How diverse and effective were the teaching strategies used by the teacher?", score: 5 },
    { id: 7, question: "Q7. Ethical Practice: To what extent did the teacher demonstrate ethical standards and professionalism?", score: 4 },
    { id: 8, question: "Q8. Leadership and Collaboration: Rate the teacher's ability to collaborate with others and provide leadership within the school community.", score: 4 },
    { id: 9, question: "Q9. Overall Rating: On a scale of 1 to 5, please rate your overall satisfaction with the teacher.", score: 4 },
    { id: 10, question: "Provide any specific suggestions...", score: 0, comments: [
      "One suggestion would be to incorporate more hands-on activities or case studies...",
      "Shows deep understanding of concepts",
      "Could provide more real-world examples",
      "Sometimes goes too fast through complex topics",
      "Visual aids are helpful",
      "Explains difficult concepts in simple terms",
      "Shows deep understanding of concepts",
      "Could provide more real-world examples",
      "Sometimes goes too fast through complex topics",
      "Visual aids are helpful",
      "Explains difficult concepts in simple terms"
    ] },
  ]

  const allComments = evaluationData.find(item => item.id === 10)?.comments.map((comment, idx) => ({
    id: `10-${idx}`,
    questionId: 10,
    text: comment,
  })) || []

  const totalComments = allComments.length
  const totalPages = Math.ceil(totalComments / COMMENTS_PER_PAGE)
  const paginatedComments = allComments.slice(
    (currentPage - 1) * COMMENTS_PER_PAGE,
    currentPage * COMMENTS_PER_PAGE
  )

  const handleGeneratePDF = () => {
    generateEvaluationPDF({
      evaluationData,
      selectedSchoolYear,
      selectedSemester,
      title: "Course Evaluation Report",
    })
  }

  const filteredEvaluationData = evaluationData.filter(item => item.id !== 10)

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4 mb-6 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">School Year</label>
              <select
                value={selectedSchoolYear}
                onChange={(e) => setSelectedSchoolYear(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SCHOOL_YEARS.map(year => <option key={year}>{year}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {(SEMESTER_OPTIONS_BY_YEAR[selectedSchoolYear] || []).map(sem => (
                  <option key={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGeneratePDF}
              className="bg-[#1F3463] text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Evaluation Table */}
      <div className="rounded-md border overflow-x-auto max-w-full dark:border-gray-700">
        <table className="min-w-[600px] w-full text-sm text-left text-gray-700 dark:text-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 w-[60%] font-semibold">Question</th>
              <th className="px-6 py-3 font-semibold">Total Score (out of 5)</th>
              <th className="px-6 py-3 font-semibold text-right">Performance Level</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvaluationData.map(item => (
              <tr key={item.id} className="border-t dark:border-gray-700">
                <td className="px-6 py-4">{item.question}</td>
                <td className="px-6 py-4">{item.score.toFixed(1)}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    item.score >= 5
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900"
                      : item.score >= 4
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900"
                      : item.score >= 3
                      ? "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900"
                      : "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900"
                  }`}>
                    {item.score >= 5
                      ? "Very Good"
                      : item.score >= 4
                      ? "Good"
                      : item.score >= 3
                      ? "Excellent"
                      : "Needs Improvement"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comments Section with Pagination */}
      <div className="border rounded-md shadow-sm p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start gap-2">
          <div>
            <p className="font-semibold dark:text-gray-200">
              Provide any specific suggestions for how the teacher could improve their teaching methods or the course.
              <br /> Share any additional comments or thoughts about your experience with the teacher.
            </p>
            <br />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Comments: <span className="font-bold">{totalComments}</span>
            </p>
          </div>
        </div>
        <ul className="space-y-3 mb-4">
          {paginatedComments.map(comment => (
            <li key={comment.id} className="bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-md p-3">
              <p className="text-sm text-gray-700 dark:text-gray-200">"{comment.text}"</p>
            </li>
          ))}
        </ul>
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border dark:border-gray-600 rounded disabled:opacity-50 dark:text-gray-200"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-200 self-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border dark:border-gray-600 rounded disabled:opacity-50 dark:text-gray-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
