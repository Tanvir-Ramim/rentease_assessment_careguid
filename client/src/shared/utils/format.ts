export const formatMoney = (n: number) =>
  `৳${new Intl.NumberFormat("en-BD").format(n)}`;

export const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-GB") : "-";

export const currentMonth = () => new Date().toISOString().slice(0, 7);
