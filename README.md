# Chat Anniversaire de Julia

Une application Next.js festive pour guider Julia vers le spectacle de stand-up parfait. L'interface propose un chatbot alimenté par l'API OpenAI et journalise chaque échange dans un Google Doc grâce à un webhook Google Apps Script.

## Prérequis

- Node.js 18 ou version supérieure.
- npm, pnpm ou yarn.
- Un compte OpenAI avec une clé API.
- Un Google Doc partagé et un déploiement Google Apps Script pouvant écrire dedans (voir ci-dessous).

## Installation

```bash
npm install
```

## Variables d'environnement

Créez un fichier `.env.local` à la racine avec les variables suivantes :

```
OPENAI_API_KEY="sk-..."
GOOGLE_APPS_SCRIPT_URL="https://script.google.com/..."
```

### Mettre en place le Google Apps Script

1. Ouvrez [Google Apps Script](https://script.google.com/).
2. Créez un nouveau projet et collez le script qui écrit dans votre document Google Docs partagé.
3. Dans **Déployer → Déployer en tant qu'application Web**, choisissez "Exécuter en tant que : Moi" et autorisez l'accès à "Tout le monde ayant le lien".
4. Déployez et copiez l'URL fournie, puis collez-la dans `GOOGLE_APPS_SCRIPT_URL`.
5. Vérifiez que le document Google Docs est accessible avec le niveau de partage voulu (ex. "Toute personne disposant du lien peut commenter/modifier").

## Lancer en développement

```bash
npm run dev
```

Visitez ensuite [http://localhost:3000](http://localhost:3000).

## Déploiement

1. Créez un nouveau projet sur [Vercel](https://vercel.com/).
2. Importez ce dépôt.
3. Dans les paramètres du projet, ajoutez les variables `OPENAI_API_KEY` et `GOOGLE_APPS_SCRIPT_URL`.
4. Déployez. Vercel détectera automatiquement Next.js.

## Personnalisation

- Le prompt système se trouve dans `lib/prompt.ts`.
- La logique d'appel OpenAI et de journalisation est dans `app/api/chat/route.ts` et `lib/googleDocs.ts`.
- Le style principal est défini dans `app/globals.css`.

Amusez-vous à pimper le thème ou à ajouter d'autres surprises pour Julia !
