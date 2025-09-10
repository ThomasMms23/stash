'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { 
  Settings, 
  User, 
  Mail, 
  Key, 
  Trash2, 
  Palette, 
  Globe, 
  Bell, 
  Users, 
  Plus,
  Shield,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'
import { ChangePasswordModal } from '@/components/profile/change-password-modal'


const mockTeamMembers = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', avatar: null },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', avatar: null },
]

export default function SettingsPage() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    lowStock: true,
    newProduct: true,
    saleCompleted: false,
  })
  const [inviteEmail, setInviteEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Utiliser les données de la session
  const userEmail = session?.user?.email || 'email@example.com'

  // Éviter l'erreur d'hydratation
  useEffect(() => {
    setMounted(true)
  }, [])

  // Charger les préférences de notification
  useEffect(() => {
    const fetchNotificationPreferences = async () => {
      try {
        const response = await fetch('/api/notifications/preferences')
        if (response.ok) {
          const preferences = await response.json()
          setNotifications({
            lowStock: preferences.lowStockEnabled,
            newProduct: preferences.newProductEnabled,
            saleCompleted: preferences.saleCompletedEnabled,
          })
        }
      } catch (error) {
        console.error('Erreur lors du chargement des préférences:', error)
      }
    }

    fetchNotificationPreferences()
  }, [])

  // Sauvegarder les préférences de notification
  const saveNotificationPreferences = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lowStockEnabled: notifications.lowStock,
          newProductEnabled: notifications.newProduct,
          saleCompletedEnabled: notifications.saleCompleted,
          emailEnabled: false, // Pour l'instant désactivé
        }),
      })

      if (response.ok) {
        toast.success('Préférences de notification sauvegardées')
      } else {
        toast.error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setIsLoading(false)
    }
  }


  const handleDeleteAccount = () => {
    toast.error('Fonctionnalité de suppression de compte en cours de développement')
  }

  const handleInviteMember = () => {
    if (!inviteEmail) {
      toast.error('Veuillez saisir une adresse email')
      return
    }
    toast.success(`Invitation envoyée à ${inviteEmail}`)
    setInviteEmail('')
  }

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    toast.success(`Notifications ${notifications[key] ? 'désactivées' : 'activées'}`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">
              Gérez vos préférences et paramètres de compte
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Section Compte */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Compte
              </CardTitle>
              <CardDescription>
                Gérez les informations de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={userEmail}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Modifiez votre email depuis la page Profil
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <ChangePasswordModal>
                  <Button variant="outline" className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Changer de mot de passe
                  </Button>
                </ChangePasswordModal>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer mon compte
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Supprimer le compte
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                        Êtes-vous sûr de vouloir continuer ?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer définitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          {/* Section Préférences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Préférences
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence et la langue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                {mounted ? (
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un thème" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="system">Système</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    Chargement...
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select defaultValue="fr">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en" disabled className="text-muted-foreground">
                      English (Bientôt disponible)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Section Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configurez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="low-stock">Alerte stock faible</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir une notification quand le stock est faible
                    </p>
                  </div>
                  <Switch
                    id="low-stock"
                    checked={notifications.lowStock}
                    onCheckedChange={() => handleNotificationChange('lowStock')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-product">Nouveau produit ajouté</Label>
                    <p className="text-sm text-muted-foreground">
                      Notification lors de l'ajout d'un nouveau produit
                    </p>
                  </div>
                  <Switch
                    id="new-product"
                    checked={notifications.newProduct}
                    onCheckedChange={() => handleNotificationChange('newProduct')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sale-completed">Vente réalisée</Label>
                    <p className="text-sm text-muted-foreground">
                      Notification lors de la finalisation d'une vente
                    </p>
                  </div>
                  <Switch
                    id="sale-completed"
                    checked={notifications.saleCompleted}
                    onCheckedChange={() => handleNotificationChange('saleCompleted')}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button 
                  onClick={saveNotificationPreferences}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section Équipe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Équipe
              </CardTitle>
              <CardDescription>
                Gérez les membres de votre équipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Inviter un membre */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Inviter un collaborateur</Label>
                  <div className="flex gap-2">
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="email@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    <Button onClick={handleInviteMember}>
                      <Plus className="h-4 w-4 mr-2" />
                      Inviter
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Liste des membres */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Membres de l'équipe</h4>
                <div className="space-y-3">
                  {mockTeamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar || undefined} alt={member.name} />
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'}>
                          {member.role === 'Admin' ? (
                            <>
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </>
                          ) : (
                            'Utilisateur'
                          )}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
