import React from 'react';

function Calendar() {
  return (
    <div className="grid grid-cols-1 pt-5 gap-4 lg:grid-cols-3 lg:gap-7">
      <div className="h-48 rounded-xl border shadow-md lg:col-span-2">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto divide-y-2 divide-gray-200 text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Subject</th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Date</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 ml-5">John Doe</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 ml-5">Web Developer</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 ml-5">24/05/1995</td>
                <td className="whitespace-nowrap px-4 py-2 ml-5">
                  <a
                    href="#"
                    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    View
                  </a>
                </td>
              </tr>

              <tr>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 ml-5">Jane Doe</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 ml-5">Web Designer</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 ml-5">04/11/1980</td>
                <td className="whitespace-nowrap px-4 py-2 ml-5">
                  <a
                    href="#"
                    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    View
                  </a>
                </td>
              </tr>

              <tr>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 ml-5">Gary Barlow</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 ml-5">Singer</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 ml-5">24/05/1995</td>
                <td className="whitespace-nowrap px-4 py-2 ml-5">
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
      <div className="h-32 rounded-xl border shadow-md"></div>
    </div>
  );
}

export default Calendar;
