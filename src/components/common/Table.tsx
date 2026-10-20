import React from 'react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'No records found.'
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-stone-50 rounded-2xl p-8 text-center text-stone-500 border border-stone-200">
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-stone-200 shadow-xs bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600 uppercase tracking-wider">
            {columns.map((col, idx) => (
              <th key={idx} className={`px-5 py-3.5 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 text-sm">
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="hover:bg-stone-50/80 transition-colors">
              {columns.map((col, idx) => (
                <td key={idx} className={`px-5 py-4 ${col.className || ''}`}>
                  {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? '') : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
