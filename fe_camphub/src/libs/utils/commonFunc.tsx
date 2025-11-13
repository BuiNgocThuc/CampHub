export const renderLabelWithAsterisk = (label: string, required: boolean) => (
  <span>
    {label}
    {required && <span style={{ color: "red" }}> *</span>}
  </span>
);


export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}


export function formatCurrency(amount?: number | null): string {
    if (amount == null || isNaN(amount)) return "—";
    return amount.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    });
}

export function formatDateTime(date?: string | number | Date | null): string {
    if (!date) return "—";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "—";

    return d.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}
