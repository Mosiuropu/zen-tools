import React, { useState } from 'react';
import { Plus, Trash2, Calendar, User } from 'lucide-react';
import { intervalToDuration, format, differenceInDays } from 'date-fns';

export default function AgeCalculator() {
  const [people, setPeople] = useState([
    { id: '1', name: 'Me', dob: new Date().toISOString().split('T')[0] }
  ]);

  const addPerson = () => {
    setPeople([...people, { id: Math.random().toString(), name: `Person ${people.length + 1}`, dob: new Date().toISOString().split('T')[0] }]);
  };

  const removePerson = (id) => {
    if (people.length > 1) {
      setPeople(people.filter(p => p.id !== id));
    }
  };

  const updatePerson = (id, field, value) => {
    setPeople(people.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const calculateAge = (dob) => {
    try {
      const birth = new Date(dob);
      const now = new Date();
      if (isNaN(birth.getTime())) return null;
      
      const duration = intervalToDuration({ start: birth, end: now });
      const totalDays = differenceInDays(now, birth);
      
      return { ...duration, totalDays };
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-3">
          <Calendar className="w-6 h-6 text-orange-500" />
          Age Comparison
        </h2>
        <button
          onClick={addPerson}
          className="flex items-center gap-2 zen-btn-primary px-6 py-3 rounded-md font-semibold transition-all shadow-sm shadow-orange-900/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Person
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {people.map((person) => {
          const age = calculateAge(person.dob);
          return (
            <div key={person.id} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md p-6 shadow-sm space-y-6 relative overflow-hidden group">
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-md text-stone-900 dark:text-stone-100 group-hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                    className="bg-transparent border-none text-base font-semibold focus:ring-0 p-0 w-full text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600"
                    placeholder="Enter Name"
                  />
                  <input
                    type="date"
                    value={person.dob}
                    onChange={(e) => updatePerson(person.id, 'dob', e.target.value)}
                    className="bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-lg px-2 py-1 text-sm text-stone-600 dark:text-stone-400 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100/50 transition-all cursor-pointer"
                  />
                </div>
                {people.length > 1 && (
                  <button
                    onClick={() => removePerson(person.id)}
                    className="p-2 text-stone-300 dark:text-stone-600 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {age ? (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-stone-50 dark:bg-stone-950/50 p-4 rounded-md text-center">
                    <div className="text-base font-semibold text-stone-900 dark:text-orange-500">{age.years}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">Years</div>
                  </div>
                  <div className="bg-stone-50 dark:bg-stone-950/50 p-4 rounded-md text-center">
                    <div className="text-base font-semibold text-stone-800 dark:text-stone-200">{age.months}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">Months</div>
                  </div>
                  <div className="bg-stone-50 dark:bg-stone-950/50 p-4 rounded-md text-center">
                    <div className="text-base font-semibold text-stone-800 dark:text-stone-200">{age.days}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">Days</div>
                  </div>
                  <div className="col-span-3 mt-2 pt-4 border-t border-stone-100 dark:border-stone-800/50 flex justify-between items-center px-2">
                    <span className="text-xs text-stone-400 dark:text-stone-500 font-medium">Total lifespan in days</span>
                    <span className="text-sm font-mono font-semibold text-stone-600 dark:text-stone-400">{age.totalDays.toLocaleString()} days</span>
                  </div>
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-stone-400 dark:text-stone-600 italic">Invalid Date</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
