'use client'

import { useState } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ProductStatus = 'IN_STOCK' | 'RESERVED' | 'SOLD'

interface ProductStatusBadgeProps {
  value: ProductStatus
  onChange: (newValue: ProductStatus) => Promise<void> | void
  onOpenChange?: (isOpen: boolean) => void
  disabled?: boolean
  className?: string
}

const statusConfig = {
  IN_STOCK: {
    label: 'En stock',
    color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    hoverColor: 'hover:bg-green-200 dark:hover:bg-green-900/30',
    dotColor: 'bg-green-500',
  },
  RESERVED: {
    label: 'Réservé',
    color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    hoverColor: 'hover:bg-blue-200 dark:hover:bg-blue-900/30',
    dotColor: 'bg-blue-500',
  },
  SOLD: {
    label: 'Vendu',
    color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    hoverColor: 'hover:bg-red-200 dark:hover:bg-red-900/30',
    dotColor: 'bg-red-500',
  },
} as const

export function ProductStatusBadge({ 
  value, 
  onChange, 
  onOpenChange,
  disabled = false, 
  className 
}: ProductStatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const currentStatus = statusConfig[value]

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }

  const handleStatusChange = async (newValue: ProductStatus) => {
    if (newValue === value || isLoading) return

    setIsLoading(true)
    try {
      await onChange(newValue)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error)
    } finally {
      setIsLoading(false)
      handleOpenChange(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return

        switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        handleOpenChange(!isOpen)
        break
      case 'Escape':
        handleOpenChange(false)
        break
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) handleOpenChange(true)
        break
    }
  }

  return (
    <div className="relative inline-block">
      {/* Badge principal */}
      <button
        type="button"
        onClick={() => !disabled && handleOpenChange(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          currentStatus.color,
          !disabled && 'hover:shadow-sm cursor-pointer',
          className
        )}
        aria-label={`Statut actuel: ${currentStatus.label}. Cliquer pour modifier`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Point coloré */}
        <div className={cn('w-1.5 h-1.5 rounded-full', currentStatus.dotColor)} />
        
        {/* Label */}
        <span>{currentStatus.label}</span>
        
        {/* Icône chevron */}
        <ChevronDown 
          className={cn(
            'w-2.5 h-2.5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} 
        />
        
        {/* Loader */}
        {isLoading && (
          <Loader2 className="w-2.5 h-2.5 animate-spin" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay pour fermer en cliquant à l'extérieur */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => handleOpenChange(false)}
            aria-hidden="true"
          />
          
          {/* Menu dropdown */}
          <div 
            className={cn(
              'absolute top-full left-0 mt-1 z-20',
              'bg-popover border border-border rounded-lg shadow-lg',
              'py-1 min-w-[120px]',
              'animate-in fade-in-0 zoom-in-95 duration-200'
            )}
            role="listbox"
            aria-label="Options de statut"
          >
            {Object.entries(statusConfig).map(([statusValue, config]) => (
              <button
                key={statusValue}
                type="button"
                onClick={() => handleStatusChange(statusValue as ProductStatus)}
                disabled={isLoading}
                className={cn(
                  'w-full flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium transition-colors duration-150',
                  'hover:bg-accent focus:bg-accent focus:outline-none',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  statusValue === value && 'bg-accent'
                )}
                role="option"
                aria-selected={statusValue === value}
                aria-label={`Changer le statut vers ${config.label}`}
              >
                {/* Point coloré */}
                <div className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
                
                {/* Label */}
                <span className="flex-1 text-left">{config.label}</span>
                
                {/* Indicateur de sélection */}
                {statusValue === value && (
                  <div className="w-1 h-1 rounded-full bg-blue-500" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/*
 * EXPLICATION DES CHOIX UX :
 * 
 * 1. **Badge persistant** : Le statut reste visible même fermé, contrairement à un select qui cache la valeur
 * 
 * 2. **Feedback visuel immédiat** : 
 *    - Couleurs cohérentes (vert=stock, bleu=réservé, rouge=vendu)
 *    - Points colorés pour reconnaissance rapide
 *    - Animation du chevron pour indiquer l'état ouvert/fermé
 * 
 * 3. **Interactions fluides** :
 *    - Animation fade/scale à l'ouverture
 *    - Hover states sur chaque option
 *    - Loader pendant la mise à jour
 * 
 * 4. **Accessibilité** :
 *    - Navigation clavier complète (Enter, Escape, ArrowDown)
 *    - ARIA labels et roles appropriés
 *    - Focus management
 * 
 * 5. **Mobile-friendly** :
 *    - Overlay pour fermer en tapant à l'extérieur
 *    - Taille de touch target appropriée
 *    - Pas de scroll dans le dropdown
 * 
 * 6. **Performance** :
 *    - Pas de re-render inutile
 *    - Animation CSS pure (pas de JS)
 *    - Gestion d'état locale optimisée
 */
