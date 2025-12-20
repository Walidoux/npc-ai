import { cx } from 'class-variance-authority'

export const cn = (...inputs: (string | undefined | null | false)[]) =>
  cx(inputs.filter(Boolean))

export const getSample = (sample: string) =>
  import.meta.env.BASE_URL.concat(sample)
