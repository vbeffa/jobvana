import type { Job } from '../types';

export const jobTypeToString = (type: Job['type']) => {
  switch (type) {
    case 'full_time':
      return 'Full time';
    case 'part_time':
      return 'Part time';
    case 'contract':
      return 'Contract';
    case 'internship':
      return 'Internship';
  }
};
