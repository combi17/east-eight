import supabase from './supabaseClient';
import sampleProperties from '../data/sampleProperties';
import { SIZE_RANGES, YEAR_RANGES } from '../data/filters';

const splitList = (value) => (value ? value.split(',').filter(Boolean) : []);

const pickRanges = (ranges, selected) => ranges.filter((range) => selected.includes(range.value));

const inRange = (value, { min, max }) =>
  (min === null || value >= min) && (max === null || value <= max);

const rangeCondition = (column, { min, max }) => {
  const parts = [];
  if (min !== null) parts.push(`${column}.gte.${min}`);
  if (max !== null) parts.push(`${column}.lte.${max}`);
  return parts.length === 1 ? parts[0] : `and(${parts.join(',')})`;
};

export const readFilters = (searchParams) => ({
  propertyType: searchParams.get('propertyType') || '',
  transactionType: searchParams.get('transactionType') || '',
  zone: searchParams.get('zone') || '',
  city: searchParams.get('city') || '',
  minPrice: searchParams.get('minPrice') || '',
  maxPrice: searchParams.get('maxPrice') || '',
  sizeRanges: splitList(searchParams.get('sizeRanges')),
  rooms: searchParams.get('rooms') || '',
  yearBuiltRanges: splitList(searchParams.get('yearBuiltRanges')),
});

const matchesFilters = (property, filters) => {
  const sizes = pickRanges(SIZE_RANGES, filters.sizeRanges);
  const years = pickRanges(YEAR_RANGES, filters.yearBuiltRanges);

  if (filters.zone && property.zone !== filters.zone) return false;
  if (filters.city && property.city !== filters.city) return false;
  if (filters.propertyType && property.type !== filters.propertyType) return false;
  if (filters.transactionType && property.transaction_type !== filters.transactionType) return false;
  if (filters.minPrice && property.price < Number(filters.minPrice)) return false;
  if (filters.maxPrice && property.price > Number(filters.maxPrice)) return false;
  if (filters.rooms === '5+' && property.rooms < 5) return false;
  if (filters.rooms && filters.rooms !== '5+' && property.rooms !== Number(filters.rooms)) return false;
  if (sizes.length && !sizes.some((range) => inRange(property.size, range))) return false;
  if (years.length && !years.some((range) => inRange(property.year, range))) return false;
  return true;
};

const sortLocal = (list, sortBy) => {
  const sorted = [...list];
  if (sortBy === 'price-asc') return sorted.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') return sorted.sort((a, b) => b.price - a.price);
  return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export async function fetchProperties(filters, sortBy) {
  if (!supabase) {
    return sortLocal(sampleProperties.filter((p) => matchesFilters(p, filters)), sortBy);
  }

  let query = supabase.from('properties').select('*');

  if (filters.zone) query = query.eq('zone', filters.zone);
  if (filters.city) query = query.eq('city', filters.city);
  if (filters.propertyType) query = query.eq('type', filters.propertyType);
  if (filters.transactionType) query = query.eq('transaction_type', filters.transactionType);
  if (filters.minPrice) query = query.gte('price', filters.minPrice);
  if (filters.maxPrice) query = query.lte('price', filters.maxPrice);

  if (filters.rooms === '5+') query = query.gte('rooms', 5);
  else if (filters.rooms) query = query.eq('rooms', filters.rooms);

  const sizes = pickRanges(SIZE_RANGES, filters.sizeRanges);
  if (sizes.length) query = query.or(sizes.map((r) => rangeCondition('size', r)).join(','));

  const years = pickRanges(YEAR_RANGES, filters.yearBuiltRanges);
  if (years.length) query = query.or(years.map((r) => rangeCondition('year', r)).join(','));

  if (sortBy === 'price-asc') query = query.order('price', { ascending: true });
  else if (sortBy === 'price-desc') query = query.order('price', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchPropertyById(id) {
  if (!supabase) {
    return sampleProperties.find((p) => String(p.id) === String(id)) ?? null;
  }

  const { data, error } = await supabase.from('properties').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchPropertiesByCity(city, limit) {
  if (!supabase) {
    return sampleProperties.filter((p) => p.city === city).slice(0, limit);
  }

  const { data, error } = await supabase.from('properties').select('*').eq('city', city).limit(limit);
  if (error) throw error;
  return data;
}

export const formatPrice = (property) => {
  const price = `€${property.price.toLocaleString('ro-RO')}`;
  return property.transaction_type === 'Inchiriere' ? { price, suffix: '/lună' } : { price, suffix: '' };
};
