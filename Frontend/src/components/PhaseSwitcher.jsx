import { useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2, Shuffle } from "lucide-react";
import EvaluationPhaseService from "../services/EvaluationPhaseService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PhaseSwitcher = () => {
  const [currentPhase, setCurrentPhase] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [dropdownStyles, setDropdownStyles] = useState({});
  const buttonRef = useRef(null);

  const phases = ["Phase 1", "Phase 2"];

  const fetchPhase = async () => {
    try {
      const phase = await EvaluationPhaseService.getCurrentPhase();
      setCurrentPhase(phase);
    } catch (error) {
      toast.error("Failed to fetch current phase.");
      console.error("Failed to fetch current phase", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhase();
  }, []);

  const handleSelect = async (phase) => {
    if (phase === currentPhase) return;

    setSwitching(true);
    try {
      const result = await EvaluationPhaseService.switchPhase(phase);
      setCurrentPhase(phase);
      setOpen(false);
      toast.success(result.message || `Switched to ${phase}`);
      
      // Refresh the phase after a short delay to ensure consistency
      setTimeout(() => {
        fetchPhase();
      }, 1000);
    } catch (error) {
      console.error("Failed to switch phase:", error);
      toast.error("Failed to switch phase. Please try again.");
      
      // Refresh the phase to ensure UI is in sync with backend
      fetchPhase();
    } finally {
      setSwitching(false);
    }
  };

  const toggleDropdown = () => {
    setOpen(!open);
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyles({
        position: "absolute",
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        zIndex: 9999,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center px-4 py-2 text-sm text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        Loading phase...
      </div>
    );
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="bg-[#1F3463] hover:bg-[#19294f] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
        disabled={switching}
      >
        <Shuffle className="w-4 h-4" />
        <span className="text-sm font-semibold">{currentPhase}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div
          style={dropdownStyles}
          className="w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg"
        >
          {phases
            .filter((phase) => phase !== currentPhase)
            .map((phase) => (
              <button
                key={phase}
                onClick={() => handleSelect(phase)}
                className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                disabled={switching}
              >
                {switching ? "Switching..." : phase}
              </button>
            ))}
        </div>
      )}
    </>
  );
};

export default PhaseSwitcher;
