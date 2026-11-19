"use client";

export default function ConfirmActionButton({ action, id, label, confirmText, className }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (confirmText && !confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className={className}>{label}</button>
    </form>
  );
}