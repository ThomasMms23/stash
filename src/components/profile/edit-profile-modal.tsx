'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Camera, Save, X } from 'lucide-react'
import { toast } from 'sonner'

interface EditProfileModalProps {
  user: {
    name: string
    email: string
    avatar: string | null
  }
  onSave: (data: { name: string; email: string; avatar: string | null }) => void
  children: React.ReactNode
}

export function EditProfileModal({ user, onSave, children }: EditProfileModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  })

  // Réinitialiser le formulaire quand le modal s'ouvre
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      setFormData({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      })
    }
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Le nom est requis')
      return
    }
    if (!formData.email.trim()) {
      toast.error('L\'email est requis')
      return
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Format d\'email invalide')
      return
    }

    onSave(formData)
    handleOpenChange(false)
  }

  const handleAvatarChange = () => {
    // Simulation d'upload d'avatar
    toast.info('Fonctionnalité d\'upload d\'avatar en cours de développement')
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le profil</DialogTitle>
          <DialogDescription>
            Mettez à jour vos informations personnelles.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={formData.avatar || undefined} alt={formData.name} />
                <AvatarFallback className="text-lg">
                  {formData.name.split(' ').map(n => n[0]).join('')}
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
          </div>

          {/* Formulaire */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={user.name || "Votre nom complet"}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder={user.email || "votre@email.com"}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
