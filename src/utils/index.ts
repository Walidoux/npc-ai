import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))

export const getSample = (sample: string) =>
  import.meta.env.BASE_URL.concat(sample)
