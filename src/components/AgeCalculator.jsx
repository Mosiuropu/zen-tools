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
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <Calendar className="w-6 h-6 text-blue-500" />
          Age Comparison
        </h2>
        <button
          onClick={addPerson}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Person
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {people.map((person) => {
          const age = calculateAge(person.dob);
          return (
            <div key={person.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 relative overflow-hidden group">
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-slate-950 rounded-2xl text-blue-400 group-hover:text-blue-300 transition-colors">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                    className="bg-transparent border-none text-xl font-bold focus:ring-0 p-0 w-full text-slate-100 placeholder-slate-600"
                    placeholder="Enter Name"
                  />
                  <input
                    type="date"
                    value={person.dob}
                    onChange={(e) => updatePerson(person.id, 'dob', e.target.value)}
                    className="bg-slate-950/50 border border-slate-800 rounded-lg px-2 py-1 text-sm text-slate-400 focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                  />
                </div>
                {people.length > 1 && (
                  <button
                    onClick={() => removePerson(person.id)}
                    className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {age ? (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-950/50 p-4 rounded-2xl text-center">
                    <div className="text-3xl font-black text-blue-500">{age.years}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Years</div>
                  </div>
                  <div className="bg-slate-950/50 p-4 rounded-2xl text-center">
                    <div className="text-3xl font-black text-slate-200">{age.months}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Months</div>
                  </div>
                  <div className="bg-slate-950/50 p-4 rounded-2xl text-center">
                    <div className="text-3xl font-black text-slate-200">{age.days}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Days</div>
                  </div>
                  <div className="col-span-3 mt-2 pt-4 border-t border-slate-800/50 flex justify-between items-center px-2">
                    <span className="text-xs text-slate-500 font-medium">Total lifespan in days</span>
                    <span className="text-sm font-mono font-bold text-slate-400">{age.totalDays.toLocaleString()} days</span>
                  </div>
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-slate-600 italic">Invalid Date</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
