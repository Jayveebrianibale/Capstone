import { FaUsers } from 'react-icons/fa';

const NoInstructorsFound = () => (
  <div className="flex flex-col items-center justify-center h-[70vh]">
    <FaUsers className="w-16 h-16 text-gray-400 mb-4" />
    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
      No Instructors Found
    </h2>
    <p className="text-red-500 text-center">
      There are currently no instructors assigned to your program and year level.
    </p>
  </div>
);

export default NoInstructorsFound;
