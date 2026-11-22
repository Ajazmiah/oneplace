"use client";

import { useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Field, TextInput } from "./FormFields";

// The only client part of the profile form: adding/removing entries and the
// "Currently studying" toggle. Inputs are uncontrolled and named education[i][field].
export default function EducationEntries() {
  const nextId = useRef(1);
  const [entries, setEntries] = useState([{ id: 0, current: false }]);

  const addEntry = () => {
    const id = nextId.current++;
    setEntries((prev) => [...prev, { id, current: false }]);
  };

  const removeEntry = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));

  const toggleCurrent = (id) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, current: !e.current } : e)));

  return (
    <div className="flex flex-col gap-4">
      {entries.map((entry, index) => {
        const prefix = `education[${index}]`;
        const fieldId = (name) => `edu-${entry.id}-${name}`;

        return (
          <div
            key={entry.id}
            className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 sm:p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Education {index + 1}
              </span>
              {entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  aria-label={`Remove education ${index + 1}`}
                  className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="School name" htmlFor={fieldId("school")} className="sm:col-span-2">
                <TextInput
                  id={fieldId("school")}
                  name={`${prefix}[school]`}
                  placeholder="e.g. University of Toronto"
                />
              </Field>
              <Field label="City" htmlFor={fieldId("city")}>
                <TextInput id={fieldId("city")} name={`${prefix}[city]`} placeholder="Toronto" />
              </Field>
              <Field label="Country" htmlFor={fieldId("country")}>
                <TextInput id={fieldId("country")} name={`${prefix}[country]`} placeholder="Canada" />
              </Field>
              <Field label="Degree" htmlFor={fieldId("degree")}>
                <TextInput
                  id={fieldId("degree")}
                  name={`${prefix}[degree]`}
                  placeholder="e.g. Bachelor of Science"
                />
              </Field>
              <Field label="Field of study" htmlFor={fieldId("field")}>
                <TextInput
                  id={fieldId("field")}
                  name={`${prefix}[fieldOfStudy]`}
                  placeholder="e.g. Computer Science"
                />
              </Field>
              <Field label="Start date" htmlFor={fieldId("start")}>
                <TextInput id={fieldId("start")} type="month" name={`${prefix}[startDate]`} />
              </Field>
              <Field
                label={entry.current ? "Expected graduation" : "End date"}
                htmlFor={fieldId("end")}
              >
                <TextInput id={fieldId("end")} type="month" name={`${prefix}[endDate]`} />
              </Field>
            </div>

            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name={`${prefix}[current]`}
                checked={entry.current}
                onChange={() => toggleCurrent(entry.id)}
                className="h-4 w-4 rounded border-gray-300 accent-brand-strong"
              />
              Currently studying here
            </label>
          </div>
        );
      })}

      <button
        type="button"
        onClick={addEntry}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-200 py-2.5 text-xs font-medium text-gray-500 transition-all duration-200 hover:border-brand hover:bg-brand/5 hover:text-brand-strong"
      >
        <Plus className="h-3.5 w-3.5" />
        Add another education
      </button>
    </div>
  );
}
