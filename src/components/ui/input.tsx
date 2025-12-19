interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { type = 'text', placeholder = 'Enter text', className = '', ...props },
    ref,
  ) => (
    <input
      className={`w-full select-none rounded border-2 px-4 py-2 font-head shadow-md transition focus:shadow-xs focus:outline-hidden ${
        props['aria-invalid']
          ? 'border-destructive text-destructive shadow-destructive shadow-xs'
          : ''
      } ${className}`}
      placeholder={placeholder}
      ref={ref}
      type={type}
      {...props}
    />
  ),
)

Input.displayName = 'Input'
