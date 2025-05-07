import Evaluation from "../../assets/Evaluation.png";

const OnboardingMessage = ({ showInstructors }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
    <div className="mb-6">
      <img 
        src={Evaluation}
        alt="Onboarding" 
        className="mx-auto mb-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto" 
      />
    </div>
    <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
      Let's get started with your evaluation!
    </p>
    <p className="text-lg text-gray-600 dark:text-gray-400">
      Please select a school year and semester to begin your evaluation process.
    </p>
    {showInstructors && (
      <p className="text-lg text-green-600 dark:text-green-400 mt-4">
        Instructors are available. You can proceed with the evaluation.
      </p>
    )}
  </div>
);

export default OnboardingMessage;
