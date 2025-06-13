import React, { useState, useEffect } from 'react';
import { Loader2, X, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const BulkSendModal = ({
  isOpen,
  onClose,
  onConfirm,
  programCode,
  instructors,
  isSending,
  showLoadingOverlay
}) => {
  const [progress, setProgress] = useState(0);
  const [currentInstructor, setCurrentInstructor] = useState(null);
  const [sentCount, setSentCount] = useState(0);
  const [sentInstructors, setSentInstructors] = useState(new Set());
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedInstructors, setSelectedInstructors] = useState(new Set());

  // Deduplicate instructors by ID
  const uniqueInstructors = React.useMemo(() => {
    return Array.from(
      new Map(instructors.map(instructor => [instructor.id, instructor])).values()
    );
  }, [instructors]);

  // Initialize selected instructors with all instructors by default
  useEffect(() => {
    if (uniqueInstructors.length > 0) {
      setSelectedInstructors(new Set(uniqueInstructors.map(instructor => instructor.id)));
    }
  }, [uniqueInstructors]);

  useEffect(() => {
    if (isSending) {
      let currentIndex = 0;
      const totalInstructors = uniqueInstructors.length;
      
      const interval = setInterval(() => {
        if (currentIndex < totalInstructors) {
          const currentInstructor = uniqueInstructors[currentIndex];
          setCurrentInstructor(currentInstructor);
          setSentCount(currentIndex + 1);
          setProgress(((currentIndex + 1) / totalInstructors) * 100);
          setSentInstructors(prev => new Set([...prev, currentInstructor.id]));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 500);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
      setCurrentInstructor(null);
      setSentCount(0);
      setSentInstructors(new Set());
      setIsConfirming(false);
    }
  }, [isSending, uniqueInstructors]);

  const toggleInstructorSelection = (instructorId) => {
    setSelectedInstructors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(instructorId)) {
        newSet.delete(instructorId);
      } else {
        newSet.add(instructorId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedInstructors.size === uniqueInstructors.length) {
      setSelectedInstructors(new Set());
    } else {
      setSelectedInstructors(new Set(uniqueInstructors.map(instructor => instructor.id)));
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (selectedInstructors.size === 0) {
      toast.warning("Please select at least one instructor to send results to.");
      return;
    }

    try {
      setIsConfirming(true);
      const response = await onConfirm(Array.from(selectedInstructors));
      
      // Show success toast
      if (response?.sent_count !== undefined) {
        toast.success(
          `Successfully sent results to ${response.sent_count} instructors`,
          { 
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        if (response.failed_count > 0) {
          toast.warning(
            `Failed to send to ${response.failed_count} instructors`,
            { 
              position: "top-right",
              autoClose: 7000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        }
      }
    } catch (error) {
      console.error('Error sending results:', error);
      toast.error(
        error.message || "Failed to perform bulk send operation",
        { 
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      setIsConfirming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Confirmation Modal */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all animate-scaleIn">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Mail className="h-5 w-5 text-[#1F3463]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Send Results
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={isConfirming || isSending}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You are about to send evaluation results to selected {programCode} instructors.
              </p>
            </div>

            {/* Progress Bar */}
            {isSending && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Progress: {Math.round(progress)}%</span>
                  <span>{sentCount} of {selectedInstructors.size} sent</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#1F3463] transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Select All Button */}
            <div className="flex justify-end">
              <button
                onClick={toggleSelectAll}
                className="text-sm text-[#1F3463] hover:text-[#172a4d] font-medium"
              >
                {selectedInstructors.size === uniqueInstructors.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {/* Recipients List */}
            <div className="max-h-60 overflow-y-auto">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recipients ({selectedInstructors.size} of {uniqueInstructors.length})
              </div>
              <div className="space-y-2">
                {uniqueInstructors.map((instructor) => (
                  <div
                    key={instructor.id}
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                      currentInstructor?.id === instructor.id
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedInstructors.has(instructor.id)}
                        onChange={() => toggleInstructorSelection(instructor.id)}
                        className="w-4 h-4 text-[#1F3463] border-[#1F3463] rounded focus:ring-[#1F3463] focus:ring-offset-0 accent-[#1F3463]"
                      />
                      <div className="w-8 h-8 rounded-full bg-[#1F3463] text-white flex items-center justify-center text-sm font-medium">
                        {instructor.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {instructor.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {instructor.email}
                        </div>
                      </div>
                    </div>
                    {sentInstructors.has(instructor.id) && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {currentInstructor?.id === instructor.id && !sentInstructors.has(instructor.id) && (
                      <Loader2 className="h-5 w-5 text-[#1F3463] animate-spin" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              disabled={isConfirming || isSending}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isConfirming || isSending || selectedInstructors.size === 0}
              className={`px-4 py-2.5 flex items-center justify-center gap-2 ${
                isConfirming || isSending || selectedInstructors.size === 0
                  ? "bg-[#1F3463] opacity-50 cursor-not-allowed"
                  : "bg-[#1F3463] hover:bg-[#172a4d]"
              } text-white rounded-lg transition-colors font-medium min-w-[100px]`}
            >
              {isConfirming || isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Results"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BulkSendModal; 