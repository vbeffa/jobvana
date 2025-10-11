export type CreatedAt = {
  created_at: string;
};

const dateComparator = (obj1: CreatedAt, obj2: CreatedAt) => {
  return (
    new Date(obj2.created_at).getTime() - new Date(obj1.created_at).getTime()
  );
};

export { dateComparator };
