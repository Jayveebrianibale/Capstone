import React from 'react';
import Welcome from '../assets/welcome.png';

function Content() {
  return (
    <div className="grid grid-cols lg:grid-cols gap-5">
      <article className="flex items-center justify-center rounded-xl p-4 sm:p-6 lg:p-8">
        <div className="">
          <h1 className="text-4xl pb-2">Welcome, Rachelle Fualo!</h1>
          <h1 className="text-slate-500 font-normal text-sm text-center">
            Let's evaluate your favorite instructors today!
          </h1>
        </div>
        <div className="flex-shrink-0">
          <img className="w-[100px] h-auto object-contain" src={Welcome} alt="Welcome" />
        </div>
      </article>
    </div>
  );
}

export default Content;
