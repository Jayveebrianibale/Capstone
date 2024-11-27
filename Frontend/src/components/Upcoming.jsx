import React from 'react';
import Calendar from '../components/Calendar'


function Upcoming() {
  return (
    <div className="grid grid-cols-1 pt-5 gap-4 lg:grid-cols-3 lg:gap-7">
      <div className="h-[100%] rounded-xl border shadow-md lg:col-span-2">
       
        <h1 className="text-xl text-center pt-4 pb-3">Upcoming Evaluations</h1>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Subjects</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Due   Date</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Evaluate</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-center">
              <tr>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">John Doe</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">Enterprise Architecture</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">October 15, 2024</td>
                <td className="whitespace-nowrap px-4 py-2">
                  <a
                    href="#"
                    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    View
                  </a>
                </td>
              </tr>

              <tr>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Jane Doe</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">Ethics</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">October 15, 2024</td>
                <td className="whitespace-nowrap px-4 py-2">
                  <a
                    href="#"
                    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    View
                  </a>
                </td>
              </tr>

              <tr>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Gary Barlow</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">CRM</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">October 15, 2024</td>
                <td className="whitespace-nowrap px-4 py-2">
                  <a
                    href="#"
                    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    View
                  </a>
                </td>
              </tr>

              <tr>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Gary Barlow</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">Christian Teaching 7</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">October 15, 2024</td>
                <td className="whitespace-nowrap px-4 py-2">
                  <a
                    href="#"
                    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    View
                  </a>
                </td>
              </tr>

              <tr>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Gary Barlow</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">Capstone 1</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">October 15, 2024</td>
                <td className="whitespace-nowrap px-4 py-2">
                  <a
                    href="#"
                    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    View
                  </a>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      <div className="h-[100%] rounded-xl border shadow-md">
        <div>
          <Calendar/>
        </div>
      </div>
      
    </div>
  );
}

export default Upcoming;
