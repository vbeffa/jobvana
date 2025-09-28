import { capitalize } from 'lodash';

export const ROUND_TYPES = [
  'recruiter',
  'hr',
  'technical',
  'coding',
  'take_home',
  'management'
] as const;
export const ROUND_LOCATIONS = ['phone', 'video', 'office', 'offline'] as const;
export const ROUND_UNITS = ['minute', 'hour', 'day'] as const;

export type RoundType = (typeof ROUND_TYPES)[number];
export type RoundLocation = (typeof ROUND_LOCATIONS)[number];
export type DurationUnit = (typeof ROUND_UNITS)[number];

export type InterviewProcess = {
  rounds: Array<InterviewRound>;
};

export const EMPTY_PROCESS: InterviewProcess = {
  rounds: [
    // {
    //   type: 'recruiter',
    //   location: 'phone',
    //   duration: 30,
    //   durationUnit: 'minute'
    // }
  ]
};

export type InterviewRound = {
  type: RoundType;
  location: RoundLocation;
  duration: number;
  durationUnit: DurationUnit;
};

export const formatType = (type: RoundType) => {
  switch (type) {
    case 'hr':
      return 'Human Resources';
    case 'take_home':
      return 'Take Home';
    default:
      return capitalize(type);
  }
};
