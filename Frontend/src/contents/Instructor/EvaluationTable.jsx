"use client";
import { useState, useEffect } from "react";
import QuestionsService from "../../services/QuestionService";
import InstructorService from "../../services/InstructorService";

export function EvaluationTable({ instructor }) {
  const [questions, setQuestions] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setLoadingComments(true);
      setError(null);
      try {
        const fetchedQuestions = await QuestionsService.getAll();
        setQuestions(fetchedQuestions);

        if (instructor?.instructor_id) {
          // Fetch evaluation results
          const results = await InstructorService.getInstructorEvaluationResults(
            instructor.instructor_id
          );
          
          const ratingMap = {};
          results.forEach((item) => {
            ratingMap[item.question_id] = parseFloat(item.avg_rating);
          });
          setRatings(ratingMap);

          // Fetch selected comments
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/instructors/${instructor.instructor_id}/selected-comments`
            );
            if (!response.ok) {
              throw new Error('Failed to fetch comments');
            }
            const data = await response.json();
            console.log('Selected comments response:', data);
            setComments(data.comments || []);
          } catch (commentError) {
            console.error('Error fetching comments:', commentError);
            setError('Failed to load comments');
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to load evaluation data');
        setQuestions([]);
        setRatings({});
        setComments([]);
      } finally {
        setLoading(false);
        setLoadingComments(false);
      }
    }

    fetchData();
  }, [instructor?.instructor_id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F3463]"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading evaluation data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ratings Table */}
      <div className="rounded-md border overflow-x-auto max-w-full dark:border-gray-700">
        <table className="min-w-[700px] w-full text-sm text-left text-gray-700 dark:text-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 font-semibold">ID</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold">Question</th>
              <th className="px-6 py-3 font-semibold">Avg. Rating</th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  No questions found.
                </td>
              </tr>
            ) : (
              questions.map((q) => (
                <tr 
                  key={q.id} 
                  id={`question-${q.id}`}
                  className="border-t dark:border-gray-700 question-row transition-colors duration-200"
                >
                  <td className="px-6 py-4">{q.id}</td>
                  <td className="px-6 py-4">{q.category}</td>
                  <td className="px-6 py-4">{q.question}</td>
                  <td className="px-6 py-4 dark:text-gray-200 font-semibold">
                    {ratings[q.id]?.toFixed(2) ?? "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Selected Comments section */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border dark:border-gray-700">
        <h3 className="text-md font-semibold dark:text-gray-200 mb-2">Comments:</h3>
        {loadingComments ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1F3463]"></div>
            <p className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading comments...</p>
          </div>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                "{comment}"
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            No comments available for this evaluation period.
          </p>
        )}
      </div>
    </div>
  );
}
