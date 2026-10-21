import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T{

  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    //1 iniciamos el cronometro
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay)
    //2 la funcion de limpieza: si el value cambia antes de que termine el delay, 
    // React ejecuta automaticamente este return y asesina el crono anterior.

    return () => {
      clearTimeout(timer);
    }
  }, [value, delay]);//Solo se vuelve a ejecutar si el usuario teclea algo nuevo.
  

  return debouncedValue;
}