export const CATEGORIES = [
  'Electronics',
  'Books & Stationery',
  'ID Cards & Documents',
  'Clothing & Accessories',
  'Keys',
  'Bags',
  'Wallets',
  'Other',
];

export const ROLES = ['Student', 'Faculty', 'Owner'];

export const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};
