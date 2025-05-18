"use client"
import { useState, useEffect } from "react"
import { fetchQuestions } from '../../services/QuestionService';
import ProgramService from '../../services/ProgramService'; 

export function EvaluationTable({ instructorId, programCode }) {
  const [questions, setQuestions] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const fetchedQuestions = await fetchQuestions();
        setQuestions(fetchedQuestions);
        if (programCode && instructorId) {
          const allResults = await ProgramService.getInstructorResultsByProgram(programCode);
          // Debug: log instructorId and all result names
          console.log('InstructorId:', instructorId);
          console.log('Result names:', allResults.map(r => r.name));
          // Try to find the result for this instructor (by id, instructor_id, email, or name)
          let result = allResults.find(r =>
            r.id === instructorId ||
            r.instructor_id === instructorId ||
            (r.email && r.email.toLowerCase() === String(instructorId).toLowerCase()) ||
            (r.name && r.name.toLowerCase() === String(instructorId).toLowerCase())
          );
          // Fallback: if only one result, use it
          if (!result && allResults.length === 1) {
            result = allResults[0];
          }
          setRatings(result?.ratings || {});
          setComments(result?.comments ? [result.comments] : ["No comments"]);
        }
      } catch (err) {
        setQuestions([]);
        setRatings({});
        setComments(["No comments"]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [programCode, instructorId]);

  return (
    <div className="space-y-6">
      {/* Evaluation Table */}
      <div className="rounded-md border overflow-x-auto max-w-full dark:border-gray-700">
        <table className="min-w-[600px] w-full text-sm text-left text-gray-700 dark:text-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 w-[30%] font-semibold">Category</th>
              <th className="px-6 py-3 w-[50%] font-semibold">Question</th>
              <th className="px-6 py-3 font-semibold">Rating</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center py-6">Loading...</td></tr>
            ) : (
              questions.map((q, idx) => (
                <tr key={q.id || idx} className="border-t dark:border-gray-700">
                  <td className="px-6 py-4">{q.category}</td>
                  <td className="px-6 py-4">{q.question}</td>
                  <td className="px-6 py-4">{ratings[`q${idx + 1}`]?.toFixed(2) || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
