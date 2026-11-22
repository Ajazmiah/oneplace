// Field building blocks for the profile form. No hooks or handlers, so they render on the
// server in ProfileForm and can also be used inside the client EducationEntries.
// Save errors come from the client <FieldError>, which reads them from ProfileFormShell.
import { ChevronDown } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { cn } from "@/lib/utils";
import { FieldError } from "./ProfileFormShell";

const focusRing = "focus-visible:ring-brand/40 focus-visible:border-brand";

/**
 * Label + control + hint + save error. `errorFor` is the saveProfile fieldErrors key
 * (or keys) to show; it defaults to `htmlFor`, which matches the field name.
 */
export function Field({ label, htmlFor, errorFor = htmlFor, optional, hint, className, children }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
        {optional && <span className="ml-1 font-normal text-gray-400">(optional)</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {errorFor && <FieldError name={errorFor} />}
    </div>
  );
}

export function TextInput({ className, ...props }) {
  return <Input className={cn("bg-white", focusRing, className)} {...props} />;
}

export function NativeSelect({ options, placeholder = "Select…", defaultValue, className, ...props }) {
  return (
    <div className="relative">
      <select
        defaultValue={defaultValue ?? ""}
        className={cn(
          "h-9 w-full appearance-none rounded-md border border-input bg-white pl-3 pr-9 text-sm text-gray-900 shadow-xs outline-none transition-[color,box-shadow]",
          "focus-visible:ring-[3px]",
          focusRing,
          className
        )}
        {...props}
      >
        {/* Selectable, so a saved choice can be cleared again */}
        <option value="">{placeholder}</option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}

/**
 * Pill-style radios (type="radio") or checkboxes (type="checkbox"). The selected state is
 * pure CSS (has-[:checked]), so no client JS is needed.
 * `defaultValue` is the saved value (radio) or list of values (checkbox).
 */
export function ChoicePills({ name, type = "radio", options, legend, optional, defaultValue }) {
  const selected = new Set([defaultValue ?? []].flat());

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-medium text-gray-700">
        {legend}
        {optional && <span className="ml-1 font-normal text-gray-400">(optional)</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map(({ value, label }) => (
          <label
            key={value}
            className={cn(
              "cursor-pointer select-none rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 transition-colors",
              "hover:border-brand/40 hover:text-brand-strong",
              "has-[:checked]:border-brand has-[:checked]:bg-brand/10 has-[:checked]:text-brand-strong",
              "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-brand/40"
            )}
          >
            <input
              type={type}
              name={name}
              value={value}
              defaultChecked={selected.has(value)}
              className="sr-only"
            />
            {label}
          </label>
        ))}
      </div>
      <FieldError name={name} />
    </fieldset>
  );
}
