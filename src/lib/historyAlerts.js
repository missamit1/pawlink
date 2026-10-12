

import { supabase } from '../services/supabase.js'
import { localDayBoundsISO } from './historyDateRange.js'

export async function fetchAlertsForLocalDay(dateKey, dogId) {
  const bounds = localDayBoundsISO(dateKey)
  if (!bounds) {
    return {
      data: [],
      error: new Error('Invalid date key'),
      bounds: null,
    }
  }

  if (!dogId) {
    return {
      data: [],
      error: new Error('Missing dogId for History query'),
      bounds,
    }
  }

  const { data, error } = await supabase
    .from('alerts')
    .select('id, anomaly_type, severity, value, baseline, created_at, dog_id')
    .eq('dog_id', dogId)
    .gte('created_at', bounds.startISO)
    .lt('created_at', bounds.endISO)
    .order('created_at', { ascending: true })

  if (error) {
    if (import.meta.env.DEV) {
      console.error('[PawLink History] alerts day query failed:', error)
    }
    return { data: [], error, bounds }
  }

  return { data: data ?? [], error: null, bounds }
}
