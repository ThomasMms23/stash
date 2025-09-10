'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  Package, 
  TrendingUp, 
  DollarSign,
  Edit,
  Key,
  Camera,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { EditProfileModal } from '@/components/profile/edit-profile-modal'
import { ChangePasswordModal } from '@/components/profile/change-password-modal'

interface UserProfile {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  createdAt: string
  updatedAt: string
}

interface UserStats {
  totalProducts: number
  totalSales: number
  totalRevenue: number
  totalProfit: number
  averageMargin: number
  stockValue: number
  potentialStockValue: number
  inStockCount: number
  reservedCount: number
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  
  // Utiliser les données de la session avec des valeurs par défaut
  const user = {
    id: session?.user?.id || '1',
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    avatar: session?.user?.image || null,
    role: session?.user?.role || 'USER',
    createdAt: '2024-01-15T10:30:00Z', // Mock date
    lastLogin: new Date().toISOString(), // Date actuelle
  }

  // Récupérer les informations du profil utilisateur
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.id) return
      
      try {
        setIsLoadingProfile(true)
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          setUserProfile(data)
        } else {
          console.error('Erreur lors du chargement du profil')
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error)
        toast.error('Erreur lors du chargement du profil')
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchUserProfile()
  }, [session?.user?.id])

  // Récupérer les statistiques utilisateur
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!session?.user?.id) return
      
      try {
        setIsLoadingStats(true)
        const response = await fetch('/api/user/stats')
        if (response.ok) {
          const data = await response.json()
          setUserStats(data)
        } else {
          console.error('Erreur lors du chargement des statistiques')
        }
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error)
        toast.error('Erreur lors du chargement des statistiques')
      } finally {
        setIsLoadingStats(false)
      }
    }

    fetchUserStats()
  }, [session?.user?.id])

  const handleSaveProfile = async (data: { name: string; email: string; avatar: string | null }) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
        }),
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setUserProfile(updatedProfile)
        toast.success('Profil mis à jour avec succès')
        
        // Rafraîchir la session pour mettre à jour les données côté client
        window.location.reload()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la mise à jour du profil')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error)
      toast.error('Une erreur est survenue')
    }
  }

  const handleAvatarChange = () => {
    toast.info('Fonctionnalité de changement d\'avatar en cours de développement')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mon Profil</h1>
            <p className="text-muted-foreground">
              Gérez vos informations personnelles et consultez vos statistiques
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Informations utilisateur */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations utilisateur
                </CardTitle>
                <CardDescription>
                  Vos informations personnelles et de connexion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar et nom */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userProfile?.image || undefined} alt={userProfile?.name || 'Utilisateur'} />
                      <AvatarFallback className="text-lg">
                        {(userProfile?.name || 'Utilisateur').split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      onClick={handleAvatarChange}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-semibold">{userProfile?.name || 'Utilisateur'}</h2>
                      <Badge variant={userProfile?.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {userProfile?.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{userProfile?.email || 'email@example.com'}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Dates importantes */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Membre depuis</span>
                    </div>
                    <div className="font-medium">
                      {isLoadingProfile ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Chargement...</span>
                        </div>
                      ) : userProfile ? (
                        formatDate(userProfile.createdAt)
                      ) : (
                        'Date non disponible'
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Dernière modification</span>
                    </div>
                    <div className="font-medium">
                      {isLoadingProfile ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Chargement...</span>
                        </div>
                      ) : userProfile ? (
                        formatDate(userProfile.updatedAt)
                      ) : (
                        'Date non disponible'
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex gap-3">
                  <EditProfileModal 
                    user={{
                      name: (userProfile || user).name || '',
                      email: (userProfile || user).email || '',
                      avatar: null // Pas d'avatar pour l'instant
                    }} 
                    onSave={handleSaveProfile}
                  >
                    <Button>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier les infos
                    </Button>
                  </EditProfileModal>
                  
                  <ChangePasswordModal>
                    <Button variant="outline">
                      <Key className="h-4 w-4 mr-2" />
                      Changer le mot de passe
                    </Button>
                  </ChangePasswordModal>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistiques personnelles */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Mes statistiques
                </CardTitle>
                <CardDescription>
                  Résumé de votre activité sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingStats ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Chargement des statistiques...</span>
                  </div>
                ) : userStats ? (
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Produits ajoutés</p>
                          <p className="text-xs text-muted-foreground">Total dans votre inventaire</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{userStats.totalProducts}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                          <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Ventes réalisées</p>
                          <p className="text-xs text-muted-foreground">Produits vendus</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{userStats.totalSales}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                          <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Chiffre d'affaires</p>
                          <p className="text-xs text-muted-foreground">Revenus générés</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(userStats.totalRevenue)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30">
                          <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Marge moyenne</p>
                          <p className="text-xs text-muted-foreground">Bénéfice par produit</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{userStats.averageMargin.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                          <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Bénéfices totaux</p>
                          <p className="text-xs text-muted-foreground">Profit réalisé</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(userStats.totalProfit)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30">
                          <Package className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">En stock</p>
                          <p className="text-xs text-muted-foreground">Produits disponibles</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{userStats.inStockCount}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Aucune donnée disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
