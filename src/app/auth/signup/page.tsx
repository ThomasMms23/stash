'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { PasswordCriteria } from '@/components/ui/password-criteria'
import { toast } from 'sonner'
import { Loader2, TrendingUp, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const router = useRouter()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Format d\'email invalide')
      return false
    }
    setEmailError('')
    return true
  }

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères')
      return false
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      setPasswordError('Le mot de passe doit contenir au moins une minuscule')
      return false
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      setPasswordError('Le mot de passe doit contenir au moins une majuscule')
      return false
    }
    
    if (!/(?=.*\d)/.test(password)) {
      setPasswordError('Le mot de passe doit contenir au moins un chiffre')
      return false
    }
    
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      setPasswordError('Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)')
      return false
    }
    
    setPasswordError('')
    return true
  }

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas')
      return false
    }
    setConfirmPasswordError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')

    try {
      const formData = new FormData(e.currentTarget)
      const name = formData.get('name') as string
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      const confirmPassword = formData.get('confirmPassword') as string

      // Validations
      if (!validateEmail(email)) {
        setIsLoading(false)
        return
      }

      if (!validatePassword(password)) {
        setIsLoading(false)
        return
      }

      if (!validateConfirmPassword(password, confirmPassword)) {
        setIsLoading(false)
        return
      }

      if (!agreeTerms) {
        toast.error('Vous devez accepter les conditions d\'utilisation')
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        toast.success('Compte créé avec succès')
        // Connexion automatique après inscription
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.ok) {
          router.push('/dashboard')
          router.refresh()
        }
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de la création du compte')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      toast.error('Erreur lors de la connexion avec Google')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleDemoMode = async () => {
    setIsDemoLoading(true)
    try {
      const response = await fetch('/api/auth/demo', {
        method: 'POST',
      })
      const data = await response.json()
      
      if (data.success) {
        router.push(data.redirectTo)
      } else {
        toast.error('Erreur lors de l\'accès au mode démo')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setIsDemoLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10 -z-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-primary/3 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-primary/4 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-primary/3 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Stash.</span>
          </Link>
          <Link href="/" className="cursor-pointer">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="w-full max-w-4xl">
          {/* Logo et tagline */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold">Stash.</h1>
                <p className="text-xs text-muted-foreground">Gérer, analyser, vendre</p>
              </div>
            </div>
          </div>

          {/* Form card */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-semibold">Créer votre compte</h2>
                  <p className="text-sm text-muted-foreground">Commencez votre aventure avec Stash</p>
                </div>

                {/* Google Sign In */}
                <Button
                  variant="outline"
                  className="w-full h-10 cursor-pointer"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Continuer avec Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Ou continuer avec
                    </span>
                  </div>
                </div>

                {/* Form avec mise en page en deux colonnes */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Colonne gauche - Formulaire */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="name" className="text-sm font-medium">Nom complet</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Jean Dupont"
                          required
                          disabled={isLoading}
                          className="h-9"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="votre@email.com"
                          required
                          disabled={isLoading}
                          className={`h-9 ${emailError ? 'border-red-500 focus:border-red-500' : ''}`}
                          onChange={(e) => {
                            if (emailError) validateEmail(e.target.value)
                          }}
                        />
                        {emailError && (
                          <p className="text-xs text-red-500">{emailError}</p>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                            minLength={8}
                            className={`h-9 pr-9 ${passwordError ? 'border-red-500 focus:border-red-500' : ''}`}
                            onChange={(e) => {
                              setPassword(e.target.value)
                              if (passwordError) validatePassword(e.target.value)
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-9 px-2 hover:bg-transparent cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-3 w-3 text-muted-foreground" />
                            ) : (
                              <Eye className="h-3 w-3 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                        {passwordError && (
                          <p className="text-xs text-red-500">{passwordError}</p>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmer le mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                            className={`h-9 pr-9 ${confirmPasswordError ? 'border-red-500 focus:border-red-500' : ''}`}
                            onChange={(e) => {
                              if (confirmPasswordError) validateConfirmPassword(password, e.target.value)
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-9 px-2 hover:bg-transparent cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-3 w-3 text-muted-foreground" />
                            ) : (
                              <Eye className="h-3 w-3 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                        {confirmPasswordError && (
                          <p className="text-xs text-red-500">{confirmPasswordError}</p>
                        )}
                      </div>
                    </div>

                    {/* Colonne droite - Critères de validation */}
                    <div className="flex items-start justify-center lg:justify-start">
                      <div className="w-full max-w-xs">
                        <PasswordCriteria password={password} />
                      </div>
                    </div>
                  </div>

                  {/* Checkbox et boutons */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={agreeTerms}
                        onCheckedChange={setAgreeTerms}
                        className="mt-0.5 h-3 w-3"
                      />
                      <Label htmlFor="terms" className="text-xs leading-relaxed text-muted-foreground">
                        J'accepte les{' '}
                        <Link href="/terms" className="text-primary hover:underline cursor-pointer">
                          CGU
                        </Link>{' '}
                        et la{' '}
                        <Link href="/privacy" className="text-primary hover:underline cursor-pointer">
                          politique de confidentialité
                        </Link>
                      </Label>
                    </div>

                    <Button type="submit" className="w-full h-9 cursor-pointer" disabled={isLoading || !agreeTerms}>
                      {isLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                      Créer mon compte
                    </Button>
                  </div>
                </form>

                {/* Demo Mode */}
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Ou essayer
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full h-9 border-dashed cursor-pointer"
                    onClick={handleDemoMode}
                    disabled={isDemoLoading}
                  >
                    {isDemoLoading ? (
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    ) : (
                      <TrendingUp className="mr-2 h-3 w-3" />
                    )}
                    Mode Démo
                  </Button>
                </div>

                {/* Sign in link */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Déjà un compte ?{' '}
                    <Link href="/auth/signin" className="text-primary hover:underline font-medium cursor-pointer">
                      Se connecter
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
