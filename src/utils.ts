export type CreatedAt = {
  created_at: string;
};

const dateComparator = (obj1: CreatedAt, obj2: CreatedAt) => {
  return (
    new Date(obj1.created_at).getTime() - new Date(obj2.created_at).getTime()
  );
};

const descDateComparator = (obj1: CreatedAt, obj2: CreatedAt) => {
  return (
    new Date(obj2.created_at).getTime() - new Date(obj1.created_at).getTime()
  );
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

const formatCurrency = currencyFormatter.format;

export { dateComparator, descDateComparator, formatCurrency };
