import React, { useState, useEffect } from 'react';
import { Ruler, Weight, Thermometer, Database, Repeat } from 'lucide-react';

const units = {
  length: {
    name: 'Length',
    icon: <Ruler className="w-5 h-5" />,
    base: 'meter',
    conversions: {
      meter: 1,
      kilometer: 0.001,
      centimeter: 100,
      millimeter: 1000,
      mile: 0.000621371,
      yard: 1.09361,
      foot: 3.28084,
      inch: 39.3701
    }
  },
  weight: {
    name: 'Weight',
    icon: <Weight className="w-5 h-5" />,
    base: 'kilogram',
    conversions: {
      kilogram: 1,
      gram: 1000,
      milligram: 1000000,
      pound: 2.20462,
      ounce: 35.274,
      ton: 0.001
    }
  },
  temperature: {
    name: 'Temperature',
    icon: <Thermometer className="w-5 h-5" />,
    custom: true,
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    convert: (val, from, to) => {
      let c;
      if (from === 'Celsius') c = val;
      else if (from === 'Fahrenheit') c = (val - 32) * 5 / 9;
      else if (from === 'Kelvin') c = val - 273.15;

      if (to === 'Celsius') return c;
      if (to === 'Fahrenheit') return (c * 9 / 5) + 32;
      if (to === 'Kelvin') return c + 273.15;
      return val;
    }
  },
  data: {
    name: 'Data',
    icon: <Database className="w-5 h-5" />,
    base: 'byte',
    conversions: {
      byte: 1,
      kilobyte: 1 / 1024,
      megabyte: 1 / (1024 ** 2),
      gigabyte: 1 / (1024 ** 3),
      terabyte: 1 / (1024 ** 4),
      petabyte: 1 / (1024 ** 5)
    }
  }
};

export default function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    const cat = units[category];
    if (cat.custom) {
      setFromUnit(cat.units[0]);
      setToUnit(cat.units[1]);
    } else {
      const unitList = Object.keys(cat.conversions);
      setFromUnit(unitList[0]);
      setToUnit(unitList[1]);
    }
  }, [category]);

  useEffect(() => {
    const val = parseFloat(value);
    if (isNaN(val)) {
      setResult('');
      return;
    }

    const cat = units[category];
    if (cat.custom) {
      setResult(cat.convert(val, fromUnit, toUnit).toFixed(4));
    } else {
      const fromRate = cat.conversions[fromUnit];
      const toRate = cat.conversions[toUnit];
      const res = (val / fromRate) * toRate;
      setResult(res.toLocaleString(undefined, { maximumFractionDigits: 6 }));
    }
  }, [value, fromUnit, toUnit, category]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(units).map(([key, data]) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
              category === key 
                ? 'bg-[#D97757]/10 border-blue-500 text-[#D97757] dark:text-[#E28F73]' 
                : 'bg-white dark:bg-[#2A2A29] border-[#E6E4E0] dark:border-[#3A3A39] text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {data.icon}
            <span className="mt-2 font-medium text-sm">{data.name}</span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#2A2A29] border border-[#E6E4E0] dark:border-[#3A3A39] rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#73716D] ml-1">From</label>
            <div className="relative">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-[#F9F8F6] dark:bg-[#1E1D1B] border border-[#E6E4E0] dark:border-[#3A3A39] rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#D97757] dark:focus:ring-[#E28F73]/50 transition-all dark:text-[#E8E6E3]"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-[#2A2A29] border-none rounded-lg py-1 px-2 text-sm font-medium focus:ring-0 cursor-pointer dark:text-[#B5B3AD]"
              >
                {units[category].custom 
                  ? units[category].units.map(u => <option key={u} value={u}>{u}</option>)
                  : Object.keys(units[category].conversions).map(u => <option key={u} value={u}>{u}</option>)
                }
              </select>
            </div>
          </div>

          <button 
            onClick={swapUnits}
            className="p-3 rounded-full bg-[#F0EFEA] dark:bg-[#3A3A39] hover:bg-[#E6E4E0] dark:hover:bg-slate-700 text-[#73716D] dark:text-[#8C8A86] transition-colors mb-1 shadow-lg"
          >
            <Repeat className="w-5 h-5" />
          </button>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#73716D] ml-1">To</label>
            <div className="relative">
              <div className="w-full bg-[#F9F8F6] dark:bg-[#1E1D1B] border border-[#E6E4E0] dark:border-[#3A3A39] rounded-xl px-4 py-3 text-lg min-h-[54px] flex items-center dark:text-[#E8E6E3] font-bold">
                {result || '0'}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-[#2A2A29] border-none rounded-lg py-1 px-2 text-sm font-medium focus:ring-0 cursor-pointer dark:text-[#B5B3AD]"
              >
                {units[category].custom 
                  ? units[category].units.map(u => <option key={u} value={u}>{u}</option>)
                  : Object.keys(units[category].conversions).map(u => <option key={u} value={u}>{u}</option>)
                }
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
