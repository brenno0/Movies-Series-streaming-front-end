import * as React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.ComponentProps<'input'> {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  containerClassName?: string
}

function Input({
  className,
  type,
  startIcon,
  endIcon,
  containerClassName,
  ...props
}: Readonly<InputProps>) {
  // Se não tem ícones, retorna o input simples
  if (!startIcon && !endIcon) {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className,
        )}
        {...props}
      />
    )
  }

  // Com ícones, usa um wrapper
  return (
    <div
      className={cn('relative flex items-center w-full', containerClassName)}
    >
      {/* Ícone do início */}
      {startIcon && (
        <div className="absolute left-3 z-10 flex items-center justify-center text-muted-foreground pointer-events-none">
          {startIcon}
        </div>
      )}

      {/* Input */}
      <input
        type={type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] flex',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          // Ajusta padding baseado nos ícones
          startIcon && !endIcon && 'pl-10 pr-3',
          !startIcon && endIcon && 'pl-3 pr-10',
          startIcon && endIcon && 'pl-10 pr-10',
          !startIcon && !endIcon && 'px-3',
          className,
        )}
        {...props}
      />

      {/* Ícone do fim */}
      {endIcon && (
        <div className="absolute right-3 z-10 flex items-center justify-center text-muted-foreground pointer-events-none">
          {endIcon}
        </div>
      )}
    </div>
  )
}

export { Input }
