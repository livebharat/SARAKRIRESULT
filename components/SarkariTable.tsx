
import React from 'react';

interface SarkariTableProps {
  title: string;
  data: { label: string; value: string }[];
  colSpan?: number;
}

export const SarkariTable: React.FC<SarkariTableProps> = ({ title, data, colSpan = 2 }) => {
  return (
    <div className="mb-6 overflow-hidden sarkari-table-border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-red-600">
            <th colSpan={colSpan} className="p-3 text-white text-xl font-black uppercase tracking-wider text-center border-b-2 border-black">
              {title}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="p-3 border border-black font-black text-red-700 w-1/3 align-top">
                {item.label}
              </td>
              <td className="p-3 border border-black font-bold text-blue-900 whitespace-pre-wrap">
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
