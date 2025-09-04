export const roleLevel = (level: number) => {
  switch (level) {
    case 0:
      return 'Entry Level';
    case 1:
      return 'Junior';
    case 2:
      return 'Mid-Level';
    case 3:
      return 'Senior';
    case 4:
      return 'Staff';
  }
};
