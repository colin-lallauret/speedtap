# 🚀 Leaderboard Global avec GitHub Gist - ULTRA FIABLE !

## La solution la plus simple du monde ! 🎯

### ⚡ **Pourquoi GitHub Gist est PARFAIT :**
- ✅ **GRATUIT** - Illimité avec GitHub
- ✅ **ULTRA FIABLE** - GitHub = 99.9% uptime  
- ✅ **2 MINUTES** de configuration max
- ✅ **JSON simple** - Facile à comprendre
- ✅ **PERMANENT** - Vos données ne disparaissent jamais

## 🚀 **Configuration ULTRA-RAPIDE :**

### **Étape 1 : Créer votre stockage (30 secondes)**

1. 🌐 Allez sur [jsonbin.io](https://jsonbin.io)
2. � Dans la grande zone de texte, collez ceci :

```json
{
  "scores": [
    {
      "wpm": 45.3,
      "accuracy": 92.5,
      "playerName": "Test",
      "date": 1696586400000
    }
  ]
}
```

3. � Cliquez sur **"CREATE"**
4. 📋 **COPIEZ L'ID** qui apparaît (ex: `670xxxxxxxxxxxxx`)

### **Étape 2 : Configurer votre projet (1 minute)**

1. 📁 Créez le fichier `.env.local` à la racine :

```bash
VITE_JSONBIN_ID=670xxxxxxxxxxxxx
```

2. 🔄 Remplacez par votre vrai ID copié à l'étape 1

### **Étape 3 : Tester (30 secondes)**

1. 💻 Redémarrez votre app :
```bash
npm run dev
```

2. 🎮 Jouez et faites un bon score !

## ✅ **C'EST TOUT ! VOTRE LEADERBOARD EST GLOBAL !**

### 🎯 **Comment ça marche :**

- **Avec JSONBin configuré** → Leaderboard global partagé
- **Sans configuration** → Leaderboard local (localStorage)
- **En cas d'erreur** → Fallback automatique

### 🚀 **Déploiement Vercel :**

1. 📤 Poussez sur GitHub
2. ⚙️ Dans Vercel → Settings → Environment Variables
3. ➕ Ajoutez : `VITE_JSONBIN_ID` avec votre ID
4. 🚀 Redéployez

### 🔧 **Bonus - Clé API (optionnel) :**

Si vous voulez plus de requêtes (500k/mois) :

1. 📝 Créez un compte sur jsonbin.io
2. 🔑 Récupérez votre API Key
3. ➕ Ajoutez dans `.env.local` :
```bash
VITE_JSONBIN_API_KEY=your_api_key_here
```

### � **Voir vos données :**

Allez sur `https://api.jsonbin.io/v3/b/VOTRE_ID/latest` pour voir vos scores en temps réel !

## 🎮 **Résultat :**
Tous les visiteurs voient maintenant le même leaderboard avec les vrais scores de tous les joueurs !

**Simple, gratuit, instantané ! 🚀**
