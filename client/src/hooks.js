import { useEffect, useState } from 'react';
import { api } from './api.js';

export function useLookups() {
  const [data, setData] = useState({ categories: [], locations: [] });
  useEffect(() => { api('/lookups').then(setData).catch(() => {}); }, []);
  return data;
}
