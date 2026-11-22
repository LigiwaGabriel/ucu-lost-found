// Labelled form control with an associated, announced error message.
export default function Field({ label, id, error, hint, as = 'input', children, ...props }) {
  const Tag = as;
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(' ') || undefined;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {hint && <p id={`${id}-hint`} className="hint">{hint}</p>}
      <Tag id={id} name={id} aria-invalid={error ? 'true' : undefined} aria-describedby={describedBy} {...props}>
        {children}
      </Tag>
      {error && <p id={`${id}-err`} className="error" role="alert">{error}</p>}
    </div>
  );
}
