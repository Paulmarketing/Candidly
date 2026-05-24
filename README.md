# Candidly — Suivi de candidatures stages & emploi

Application web full-stack de suivi de candidatures pour étudiants francophones.
Interface glassmorphism style Apple, rappels email automatiques, abonnement Stripe.

---

## Stack technique

- **Frontend** : Next.js 14 (App Router) + Tailwind CSS
- **Backend** : Next.js API Routes (serverless)
- **Base de données + Auth** : Supabase (PostgreSQL + Auth)
- **Paiements** : Stripe (abonnement 5€/mois, essai 14 jours)
- **Emails** : Resend
- **Déploiement** : Vercel

---

## Prérequis

- Node.js 18+
- Un compte [Supabase](https://supabase.com) (gratuit)
- Un compte [Stripe](https://stripe.com) (gratuit en mode test)
- Un compte [Resend](https://resend.com) (gratuit jusqu'à 3 000 emails/mois)
- Un compte [Vercel](https://vercel.com) pour le déploiement

---

## Lancer le projet en local

### 1. Cloner et installer les dépendances

```bash
git clone https://github.com/ton-username/candidly.git
cd candidly
npm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Remplis `.env.local` avec tes clés (voir section "Configuration des services" ci-dessous).

### 3. Initialiser la base de données Supabase

1. Va sur [app.supabase.com](https://app.supabase.com) → crée un projet
2. Ouvre **SQL Editor** → clique **New query**
3. Colle le contenu de `supabase-schema.sql` et exécute

### 4. Lancer le serveur de développement

```bash
npm run dev
```

L'app est accessible sur [http://localhost:3000](http://localhost:3000)

---

## Configuration des services

### Supabase

1. Crée un projet sur [app.supabase.com](https://app.supabase.com)
2. **Settings > API** → copie :
   - `NEXT_PUBLIC_SUPABASE_URL` = URL du projet
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = clé `anon public`
   - `SUPABASE_SERVICE_ROLE_KEY` = clé `service_role` (⚠️ gardée secrète)
3. **Authentication > Providers** → Active **Google** si tu veux le OAuth Google
   - Remplis Client ID et Client Secret depuis [console.cloud.google.com](https://console.cloud.google.com)

### Stripe

1. Crée un compte sur [stripe.com](https://stripe.com)
2. **Dashboard > API keys** → copie la clé `Secret key` → `STRIPE_SECRET_KEY`
3. **Products** → Crée un produit "Candidly Pro" à 5€/mois
   - Copie l'ID du prix (commence par `price_`) → `STRIPE_PRO_PRICE_ID`
4. **Webhooks** → Crée un endpoint vers `https://ton-domaine.vercel.app/api/stripe/webhook`
   - Événements à écouter :
     - `checkout.session.completed`
     - `customer.subscription.deleted`
     - `customer.subscription.paused`
     - `customer.subscription.updated`
   - Copie le **Signing secret** → `STRIPE_WEBHOOK_SECRET`

**En local**, utilise le Stripe CLI pour forwarder les webhooks :

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Resend

1. Crée un compte sur [resend.com](https://resend.com)
2. **API Keys** → crée une clé → `RESEND_API_KEY`
3. **Domains** → ajoute et vérifie ton domaine pour envoyer depuis `rappels@ton-domaine.fr`
   - En développement, tu peux envoyer depuis `onboarding@resend.dev` (vers ton email uniquement)

---

## Déploiement sur Vercel

### 1. Pousser sur GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ton-username/candidly.git
git push -u origin main
```

### 2. Connecter à Vercel

1. Va sur [vercel.com](https://vercel.com) → **Add New Project**
2. Importe ton repo GitHub
3. **Environment Variables** → ajoute toutes les variables de `.env.local`
4. Clique **Deploy**

### 3. Configurer les Cron Jobs

Le fichier `vercel.json` configure déjà le cron job pour les rappels email (8h chaque matin).
Il nécessite le plan **Vercel Hobby** (gratuit) ou supérieur.

Ajoute aussi la variable `CRON_SECRET` (une chaîne aléatoire longue) dans Vercel **et** dans ton `.env.local`.

---

## Structure du projet

```
candidly/
├── app/
│   ├── page.tsx                    → Landing page
│   ├── login/page.tsx              → Connexion
│   ├── register/page.tsx           → Inscription
│   ├── pricing/page.tsx            → Tarifs
│   ├── dashboard/
│   │   ├── layout.tsx              → Protection de route (auth requise)
│   │   └── page.tsx                → Dashboard principal
│   └── api/
│       ├── candidatures/
│       │   ├── route.ts            → GET liste, POST création
│       │   └── [id]/route.ts       → PATCH modification, DELETE suppression
│       ├── stripe/
│       │   ├── checkout/route.ts   → Crée une session Stripe Checkout
│       │   └── webhook/route.ts    → Webhook Stripe (activation Pro)
│       └── cron/
│           └── reminders/route.ts  → Cron job rappels email
├── components/
│   ├── Logo.tsx                    → Logo de l'app
│   ├── StatsGrid.tsx               → Grille de statistiques
│   ├── CandidatureCard.tsx         → Carte candidature (liste)
│   ├── AddModal.tsx                → Modale ajout/modification
│   ├── ReminderBanner.tsx          → Bannière rappels imminents
│   ├── PricingCard.tsx             → Carte de pricing
│   └── ConfirmDialog.tsx           → Dialog de confirmation suppression
├── lib/
│   ├── supabase.ts                 → Clients Supabase (browser/server/admin)
│   ├── stripe.ts                   → Client Stripe
│   └── resend.ts                   → Client Resend + template email
├── types/
│   └── index.ts                    → Types TypeScript + constantes
├── supabase-schema.sql             → Schéma BDD à exécuter dans Supabase
├── vercel.json                     → Configuration cron Vercel
└── .env.example                    → Exemple de variables d'environnement
```

---

## Fonctionnalités

| Fonctionnalité | Plan Gratuit | Plan Pro |
|---|---|---|
| Candidatures | 10 max | Illimitées |
| Tableau de bord + stats | ✅ | ✅ |
| Ajout/modification/suppression | ✅ | ✅ |
| Filtrage + recherche | ✅ | ✅ |
| Export CSV | ✅ | ✅ |
| Rappels email automatiques | — | ✅ |
| Dates de relance | — | ✅ |

---

## Développement

```bash
# Lancer en mode développement
npm run dev

# Build de production
npm run build

# Lancer en mode production local
npm start

# Linter
npm run lint
```

---

## Licence

MIT — libre d'usage commercial.
