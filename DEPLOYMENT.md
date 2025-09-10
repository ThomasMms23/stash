# Stash. - Dashboard de gestion de produits et ventes

## 🚀 Déploiement sur Vercel

### Prérequis
- Compte Vercel
- Base de données PostgreSQL (Neon, Supabase, ou Railway)
- Compte Google (pour OAuth - optionnel)

### Étapes de déploiement

#### 1. Préparer la base de données
```bash
# Changer le provider dans prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### 2. Déployer sur Vercel
1. Connecter votre repository GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer

#### 3. Variables d'environnement requises
- `DATABASE_URL`: URL de votre base PostgreSQL
- `NEXTAUTH_URL`: URL de votre application déployée
- `NEXTAUTH_SECRET`: Clé secrète pour NextAuth
- `GOOGLE_CLIENT_ID` (optionnel): Pour l'authentification Google
- `GOOGLE_CLIENT_SECRET` (optionnel): Pour l'authentification Google

### 🛠️ Commandes utiles

```bash
# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:push

# Seeder les données de démo
npm run db:seed-demo
```

### 📱 Fonctionnalités déployées
- ✅ Authentification (Email/Password + Google OAuth)
- ✅ Gestion des produits (CRUD complet)
- ✅ Dashboard avec statistiques dynamiques
- ✅ Analytics avec export CSV/PDF
- ✅ Système de notifications
- ✅ Mode démo intégré
- ✅ Interface responsive
- ✅ Mode sombre/clair
