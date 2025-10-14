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

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'numeric',
  day: 'numeric'
});

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

const formatCurrency = currencyFormatter.format;

const formatDate = dateFormatter.format;

export { dateComparator, descDateComparator, formatCurrency, formatDate };
