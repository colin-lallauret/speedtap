// Service GitHub Gist - Ultra fiable et gratuit
class GistService {
  constructor() {
    // ID du Gist public (sera créé automatiquement)
    this.gistId = import.meta.env.VITE_GIST_ID || 'LOCAL_ONLY'
    this.githubToken = import.meta.env.VITE_GITHUB_TOKEN // Optionnel pour plus de requêtes
  }

  // Vérifier si Gist est configuré
  isConfigured() {
    console.log('Gist Configuration:', { gistId: this.gistId, hasToken: !!this.githubToken })
    return this.gistId !== 'LOCAL_ONLY'
  }

  // Récupérer tous les scores depuis le Gist
  async getAllScores() {
    if (!this.isConfigured()) {
      console.log('Gist non configuré - utilisation locale')
      return []
    }

    try {
      const headers = {
        'Accept': 'application/vnd.github.v3+json'
      }
      
      // Ajouter le token GitHub si disponible (pour plus de requêtes)
      if (this.githubToken) {
        headers['Authorization'] = `token ${this.githubToken}`
      }

      const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
        method: 'GET',
        headers
      })

      if (!response.ok) {
        console.error('Erreur Gist:', response.status)
        return []
      }

      const data = await response.json()
      const content = data.files['scores.json'].content
      const parsed = JSON.parse(content)
      return parsed.scores || []

    } catch (error) {
      console.error('Erreur réseau Gist:', error)
      return []
    }
  }

  // Sauvegarder un nouveau score
  async saveScore(wpm, accuracy, playerName = null) {
    if (!this.isConfigured()) {
      console.log('Gist non configuré - sauvegarde locale uniquement')
      return false
    }

    try {
      // 1. Récupérer les scores existants
      const existingScores = await this.getAllScores()

      // 2. Ajouter le nouveau score
      const newScore = {
        wpm: parseFloat(wpm.toFixed(1)),
        accuracy: parseFloat(accuracy.toFixed(1)),
        playerName: playerName,
        date: Date.now()
      }

      existingScores.push(newScore)

      // 3. Trier par WPM décroissant, puis par précision
      const sortedScores = existingScores.sort((a, b) => {
        if (b.wpm !== a.wpm) {
          return b.wpm - a.wpm
        }
        return b.accuracy - a.accuracy
      })

      // 4. Garder seulement les 100 meilleurs
      const topScores = sortedScores.slice(0, 100)

      // 5. Mettre à jour le Gist
      const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }

      if (this.githubToken) {
        headers['Authorization'] = `token ${this.githubToken}`
      }

      const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          files: {
            'scores.json': {
              content: JSON.stringify({ scores: topScores }, null, 2)
            }
          }
        })
      })

      if (!response.ok) {
        console.error('Erreur sauvegarde Gist:', response.status)
        return false
      }

      console.log('Score sauvegardé dans Gist')
      return true

    } catch (error) {
      console.error('Erreur réseau Gist:', error)
      return false
    }
  }

  // Récupérer le top 3
  async getTopScores() {
    const allScores = await this.getAllScores()
    return allScores.slice(0, 3)
  }

  // Créer un nouveau Gist public
  async createGist() {
    const initialData = {
      scores: [
        {
          wpm: 45.3,
          accuracy: 92.5,
          playerName: "Demo",
          date: Date.now()
        }
      ]
    }

    try {
      const response = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: 'Speed Typing Game Scores',
          public: true,
          files: {
            'scores.json': {
              content: JSON.stringify(initialData, null, 2)
            }
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Gist créé avec succès!')
      console.log('📋 Votre Gist ID:', data.id)
      console.log('🔗 URL pour voir vos données:', data.html_url)
      console.log('')
      console.log('📝 Ajoutez ceci dans votre .env.local:')
      console.log(`VITE_GIST_ID=${data.id}`)
      
      return data.id
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error)
      return null
    }
  }
}

export const gistService = new GistService()
