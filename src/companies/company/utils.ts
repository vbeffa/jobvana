import { capitalize } from 'lodash';
import type { CompanyAddress, Company as DbCompany } from '../../types';

export type ToDisplay = Pick<
  DbCompany,
  'contact_email' | 'description' | 'industry_id' | 'name' | 'num_employees'
>;

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
  pipeline_size: number;
};

export const EMPTY_PROCESS: InterviewProcess = {
  rounds: [
    // {
    //   type: 'recruiter',
    //   location: 'phone',
    //   duration: 30,
    //   durationUnit: 'minute'
    // }
  ],
  pipeline_size: 5
};

export type InterviewRound = {
  type: RoundType;
  location: RoundLocation;
  duration: number;
  durationUnit: DurationUnit;
};

export const roundTypeToString = (type: RoundType) => {
  switch (type) {
    case 'hr':
      return 'Human Resources';
    case 'take_home':
      return 'Take Home';
    default:
      return capitalize(type);
  }
};

export const validateAddress = async (
  address: Pick<CompanyAddress, 'street' | 'city' | 'state' | 'zip'>
) => {
  const url = new URL(
    'https://forward-reverse-geocoding.p.rapidapi.com/v1/forward'
  );
  url.searchParams.append('format', 'json');
  url.searchParams.append('street', address.street);
  url.searchParams.append('city', address.city);
  url.searchParams.append('state', address.state);
  url.searchParams.append('postalcode', address.zip);
  url.searchParams.append('country', 'USA');
  url.searchParams.append('addressdetails', '1');
  url.searchParams.append('accept-language', 'en');
  url.searchParams.append('namedetails', '0');
  url.searchParams.append('limit', '1');
  url.searchParams.append('bounded', '0');
  url.searchParams.append('polygon_text', '0');
  url.searchParams.append('polygon_kml', '0');
  url.searchParams.append('polygon_svg', '0');
  url.searchParams.append('polygon_geojson', '0');
  url.searchParams.append('polygon_threshold', '0.0');

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '1965928fb7msh924dfaa0130dcd4p1537b5jsn88568eeda361',
      'x-rapidapi-host': 'forward-reverse-geocoding.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    // console.log(response);
    const result = await response.json();
    // console.log('result:', result);
    return {
      lat: result?.[0]?.lat,
      long: result?.[0]?.lon
    };
  } catch (error) {
    console.log(error);
    return { lat: undefined, long: undefined };
  }
};
