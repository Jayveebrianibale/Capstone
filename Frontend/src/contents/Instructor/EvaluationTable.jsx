"use client";
import { useState, useEffect } from "react";
import QuestionsService from "../../services/QuestionService";
import InstructorService from "../../services/InstructorService";

export function EvaluationTable({ instructor }) {
  const [questions, setQuestions] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 1. Fetch all questions
        const fetchedQuestions = await QuestionsService.getAll();
        setQuestions(fetchedQuestions);

        // 2. Check if instructor has instructor_id
        if (instructor?.instructor_id) {
          const results = await InstructorService.getInstructorEvaluationResults(
            instructor.instructor_id
          );

          // Convert array of question ratings to an object indexed by question ID
          const ratingMap = {};
          results.forEach((item) => {
            ratingMap[item.question_id] = parseFloat(item.avg_rating);
          });
          setRatings(ratingMap);

          // Optional: handle comments if available
          setComments(results.comments ?? ["No comments available"]);
        } else {
          setRatings({});
          setComments(["Instructor ID not found"]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setQuestions([]);
        setRatings({});
        setComments(["Error fetching evaluation data"]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [instructor?.instructor_id]);

  return (
    <div className="space-y-6">
      {/* Evaluation Table */}
      <div className="rounded-md border overflow-x-auto max-w-full dark:border-gray-700">
        <table className="min-w-[600px] w-full text-sm text-left text-gray-700 dark:text-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 w-[30%] font-semibold">Category</th>
              <th className="px-6 py-3 w-[50%] font-semibold">Question</th>
              <th className="px-6 py-3 font-semibold">Avg. Rating</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : questions.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6">
                  No questions found.
                </td>
              </tr>
            ) : (
              questions.map((q) => (
                <tr key={q.id} className="border-t dark:border-gray-700">
                  <td className="px-6 py-4">{q.category}</td>
                  <td className="px-6 py-4">{q.question}</td>
                  <td className="px-6 py-4">
                    {ratings[q.id]?.toFixed(2) ?? "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Comments Section (Optional) */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border dark:border-gray-700">
        <h3 className="text-md font-semibold mb-2">Comments:</h3>
        {Array.isArray(comments) ? (
          comments.map((c, i) => (
            <p key={i} className="text-sm text-gray-600 dark:text-gray-300">
              • {c}
            </p>
          ))
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {comments}
          </p>
        )}
      </div>
    </div>
  );
}
