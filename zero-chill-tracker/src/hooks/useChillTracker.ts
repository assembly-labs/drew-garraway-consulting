import { useState, useEffect } from 'react'

export type ChillValue = 0 | 1 | null

export interface ChillData {
  [key: string]: ChillValue // key format: 'YYYY-MM-DD'
}

export function useChillTracker() {
  const [data, setData] = useState<ChillData>(() => {
    const stored = localStorage.getItem('chillTracker')
    return stored ? JSON.parse(stored) : {}
  })

  useEffect(() => {
    localStorage.setItem('chillTracker', JSON.stringify(data))
  }, [data])

  const toggleDay = (date: string) => {
    setData(prev => {
      const current = prev[date]
      let newValue: ChillValue

      if (current === null || current === undefined) {
        newValue = 1 // First click: chill
      } else if (current === 1) {
        newValue = 0 // Second click: no chill
      } else {
        newValue = null // Third click: unset
      }

      return {
        ...prev,
        [date]: newValue
      }
    })
  }

  const getDay = (date: string): ChillValue => {
    return data[date] ?? null
  }

  const getMonthStats = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    let chillDays = 0
    let noChillDays = 0

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const value = data[dateStr]

      if (value === 1) chillDays++
      else if (value === 0) noChillDays++
    }

    return {
      chillDays,
      noChillDays,
      totalTracked: chillDays + noChillDays,
      chillPercentage: chillDays + noChillDays > 0
        ? Math.round((chillDays / (chillDays + noChillDays)) * 100)
        : 0
    }
  }

  return {
    toggleDay,
    getDay,
    getMonthStats
  }
}
