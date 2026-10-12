export const PROPERTY_TYPES = [
  { label: 'Toate', value: '' },
  { label: 'Birou', value: 'Birou' },
  { label: 'Apartament', value: 'Apartament' },
  { label: 'Vilă', value: 'Vila' },
];

export const TRANSACTION_TYPES = [
  { label: 'Toate', value: '' },
  { label: 'Vânzare', value: 'Vanzare' },
  { label: 'Închiriere', value: 'Inchiriere' },
];

export const ROOM_OPTIONS = [
  { label: 'Orice', value: '' },
  { label: '1 cameră', value: '1' },
  { label: '2 camere', value: '2' },
  { label: '3 camere', value: '3' },
  { label: '4 camere', value: '4' },
  { label: '5+ camere', value: '5+' },
];

export const SIZE_RANGES = [
  { label: '0-50 mp', value: '0-50', min: null, max: 50 },
  { label: '50-100 mp', value: '50-100', min: 50, max: 100 },
  { label: '100-150 mp', value: '100-150', min: 100, max: 150 },
  { label: '150-200 mp', value: '150-200', min: 150, max: 200 },
  { label: '200+ mp', value: '200+', min: 200, max: null },
];

export const YEAR_RANGES = [
  { label: 'Înainte de 2000', value: 'before-2000', min: null, max: 1999 },
  { label: '2000-2010', value: '2000-2010', min: 2000, max: 2010 },
  { label: '2010-2015', value: '2010-2015', min: 2010, max: 2015 },
  { label: '2015-2020', value: '2015-2020', min: 2015, max: 2020 },
  { label: 'După 2020', value: 'after-2020', min: 2021, max: null },
];

export const LOCATION_GROUPS = [
  {
    label: 'București',
    code: 'ro',
    value: 'city_Bucharest',
    items: [
      { label: 'Sector 1', value: 'zone_Sector 1' },
      { label: 'Sector 2', value: 'zone_Sector 2' },
      { label: 'Floreasca', value: 'zone_Floreasca' },
      { label: 'Băneasa', value: 'zone_Baneasa' },
    ],
  },
  {
    label: 'Dubai',
    code: 'ae',
    value: 'city_Dubai',
    items: [
      { label: 'Dubai Marina', value: 'zone_DubaiMarina' },
      { label: 'Jumeirah Village Circle (JVC)', value: 'zone_JVC' },
      { label: 'Downtown Dubai', value: 'zone_Downtown' },
    ],
  },
];

export const EMPTY_FILTERS = {
  propertyType: '',
  transactionType: '',
  zone: '',
  city: '',
  minPrice: '',
  maxPrice: '',
  sizeRanges: [],
  rooms: '',
  yearBuiltRanges: [],
};

export const STATUS_LABELS = {
  sold: 'Vândut',
  rented: 'Închiriat',
};
