export const renderLabelWithAsterisk = (label: string, required: boolean) => (
  <span>
    {label}
    {required && <span style={{ color: "red" }}> *</span>}
  </span>
);


export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
