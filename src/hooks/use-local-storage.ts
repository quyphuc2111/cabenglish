import { useState, useEffect } from 'react'

type SetValue<T> = T | ((val: T) => T)

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void] {
  // Lấy giá trị từ localStorage khi component mount
  const readValue = (): T => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Lỗi khi đọc localStorage key "${key}":`, error)
      return initialValue
    }
  }

  const [storedValue, setStoredValue] = useState<T>(readValue)

  // Hàm để cập nhật cả state và localStorage
  const setValue = (value: SetValue<T>) => {
    try {
      const newValue = value instanceof Function ? value(storedValue) : value
      window.localStorage.setItem(key, JSON.stringify(newValue))
      setStoredValue(newValue)
    } catch (error) {
      console.warn(`Lỗi khi set localStorage key "${key}":`, error)
    }
  }

  useEffect(() => {
    setStoredValue(readValue())
  }, [key])

  return [storedValue, setValue]
}

export default useLocalStorage
