const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const token = localStorage.getItem("token");
    const selectedProgram = programs.find(p => p.name === formData.selectedOption);
    
    if (!selectedProgram) {
      setError("Selected program not found");
      setLoading(false);
      return;
    }

    const response = await api.post(
      "/student-profile/setup",
      {
        educationLevel: formData.educationLevel,
        selectedOption: selectedProgram.id,
        yearLevel: formData.yearLevel,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.profile_completed) {
      navigate("/student/dashboard");
    }
  } catch (err) {
    console.error("Profile setup error:", err);
    setError(err.response?.data?.error || "Failed to setup profile");
  } finally {
    setLoading(false);
  }
}; 