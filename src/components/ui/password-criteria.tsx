'use client'

import { CheckCircle, XCircle } from 'lucide-react'

interface PasswordCriteriaProps {
  password: string
}

interface Criteria {
  id: string
  label: string
  test: (password: string) => boolean
}

const criteria: Criteria[] = [
  {
    id: 'length',
    label: 'Au moins 8 caractères',
    test: (password) => password.length >= 8
  },
  {
    id: 'lowercase',
    label: 'Une minuscule',
    test: (password) => /(?=.*[a-z])/.test(password)
  },
  {
    id: 'uppercase',
    label: 'Une majuscule',
    test: (password) => /(?=.*[A-Z])/.test(password)
  },
  {
    id: 'number',
    label: 'Un chiffre',
    test: (password) => /(?=.*\d)/.test(password)
  },
  {
    id: 'special',
    label: 'Un caractère spécial',
    test: (password) => /(?=.*[@$!%*?&])/.test(password)
  }
]

export function PasswordCriteria({ password }: PasswordCriteriaProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">Critères requis :</h4>
      <div className="space-y-1.5">
        {criteria.map((criterion) => {
          const isValid = criterion.test(password)
          return (
            <div key={criterion.id} className="flex items-center gap-2 text-xs">
              {isValid ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <XCircle className="h-3 w-3 text-red-500" />
              )}
              <span className={isValid ? 'text-green-600' : 'text-red-500'}>
                {criterion.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
