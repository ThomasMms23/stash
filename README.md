# Dashboard SaaS - Gestion Achat-Revente

Un dashboard moderne et complet pour la gestion d'achat-revente de sneakers, vêtements et accessoires, développé avec Next.js 14, TypeScript, Prisma et PostgreSQL.

## 🚀 Fonctionnalités

### 🔐 Authentification
- **NextAuth.js** avec support Google OAuth et email/password
- Gestion des rôles (USER/ADMIN)
- Protection des routes avec middleware
- Sessions sécurisées

### 📦 Gestion des Produits
- **CRUD complet** : Créer, lire, modifier, supprimer
- **Upload d'images** via Supabase Storage
- **Filtres avancés** : recherche, catégorie, marque, statut
- **Pagination** et tri
- **Calcul automatique** des marges et bénéfices

### 📊 Dashboard Analytics
- **Statistiques en temps réel** : revenus, bénéfices, marge moyenne
- **Graphiques interactifs** avec Recharts :
  - Revenus mensuels (barres)
  - Répartition par catégorie (camembert)
  - Top marques (barres horizontales)
- **Métriques clés** : taux de vente, performance par catégorie

### 🎨 Interface Utilisateur
- **Design moderne** avec shadcn/ui et Tailwind CSS
- **Dark mode** intégré
- **Responsive** : mobile-first design
- **Composants réutilisables** et accessibles
- **Animations fluides** et transitions

### 🗄️ Base de Données
- **PostgreSQL** avec Prisma ORM
- **Schéma optimisé** pour les relations
- **Migrations** automatiques
- **Types TypeScript** générés automatiquement

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 14** (App Router, RSC)
- **React 19** avec TypeScript
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants
- **Recharts** pour les graphiques
- **React Hook Form** + Zod pour les formulaires

### Backend
- **Next.js API Routes**
- **NextAuth.js** pour l'authentification
- **Prisma ORM** pour la base de données
- **Zod** pour la validation des données

### Base de Données & Stockage
- **PostgreSQL** (base de données principale)
- **Supabase Storage** (upload d'images)

### Outils de Développement
- **TypeScript** pour le typage strict
- **ESLint** pour la qualité du code
- **Jest** + **React Testing Library** pour les tests
- **Prisma Studio** pour la gestion de la DB

## 📦 Installation

### Prérequis
- Node.js 18+ 
- PostgreSQL
- Compte Supabase (pour le stockage d'images)

### 1. Cloner le projet
```bash
git clone <repository-url>
cd dashboard
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de l'environnement
Créez un fichier `.env.local` à la racine du projet :

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dashboard_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

### 4. Configuration de la base de données
```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# (Optionnel) Ouvrir Prisma Studio
npx prisma studio
```

### 5. Configuration Supabase
1. Créez un projet sur [Supabase](https://supabase.com)
2. Créez un bucket `product-images` dans Storage
3. Configurez les politiques d'accès pour le bucket

### 6. Lancer le serveur de développement
```bash
npm run dev
```

Le serveur sera accessible sur [http://localhost:3001](http://localhost:3001)

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:coverage
```

## 📁 Structure du Projet

```
src/
├── app/                    # App Router Next.js
│   ├── api/               # API Routes
│   ├── auth/              # Pages d'authentification
│   ├── dashboard/         # Pages du dashboard
│   └── globals.css        # Styles globaux
├── components/            # Composants React
│   ├── charts/           # Composants de graphiques
│   ├── layout/           # Layout et navigation
│   ├── products/         # Composants produits
│   ├── providers/        # Providers React
│   └── ui/               # Composants UI de base
├── lib/                  # Utilitaires et configuration
│   ├── auth.ts           # Configuration NextAuth
│   ├── prisma.ts         # Client Prisma
│   ├── supabase.ts       # Client Supabase
│   ├── validations.ts    # Schémas Zod
│   └── utils.ts          # Utilitaires généraux
├── types/               # Types TypeScript
└── middleware.ts        # Middleware Next.js

prisma/
├── schema.prisma        # Schéma de base de données
└── migrations/         # Migrations Prisma
```

## 🗄️ Modèle de Données

### User
- Informations utilisateur et authentification
- Rôles (USER/ADMIN)
- Relations avec produits et transactions

### Product
- Informations produit (nom, marque, catégorie, taille)
- Prix d'achat et de vente
- Statut (en stock, vendu, réservé, rupture)
- Image et SKU

### Transaction
- Historique des achats et ventes
- Montants et quantités
- Notes et références produit

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Variables d'environnement requises
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🔧 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linter ESLint
npm run test         # Tests Jest
npm run test:watch   # Tests en mode watch
npm run test:coverage # Tests avec couverture
```

## 📈 Fonctionnalités Futures

- [ ] **Export CSV/PDF** des transactions
- [ ] **Notifications temps réel** via Supabase Realtime
- [ ] **Multi-tenant** (organisations)
- [ ] **API REST** publique
- [ ] **Mobile app** React Native
- [ ] **Intégration paiements** Stripe
- [ ] **Système de commandes** avancé

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

Développé avec ❤️ par un développeur senior spécialisé en React/Next.js

---

**Note** : Ce projet est conçu comme un exemple de dashboard SaaS moderne avec les meilleures pratiques de développement web full-stack.