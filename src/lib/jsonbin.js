// Service JSONBin.io - Ultra simple pour stocker les scores
// Documentation : https://jsonbin.io/

class JSONBinService {
  constructor() {
    // URL publique où seront stockés les scores (vous la changerez)
    this.binId = import.meta.env.VITE_JSONBIN_ID || 'DEFAULT_BIN_ID'
    this.apiKey = import.meta.env.VITE_JSONBIN_API_KEY // Optionnel
    this.baseUrl = 'https://api.jsonbin.io/v3/b'
  }

  // Vérifier si JSONBin est configuré
  isConfigured() {
    console.log('JSONBin Configuration:', { binId: this.binId, hasApiKey: !!this.apiKey })
    return this.binId !== 'DEFAULT_BIN_ID'
  }

  // Récupérer tous les scores
  async getAllScores() {
    if (!this.isConfigured()) {
      console.log('JSONBin non configuré - utilisation locale')
      return []
    }

    try {
      const headers = {
        'Content-Type': 'application/json'
      }
      
      // Ajouter la clé API si disponible (pour plus de requêtes)
      if (this.apiKey) {
        headers['X-Master-Key'] = this.apiKey
      }

      const response = await fetch(`${this.baseUrl}/${this.binId}/latest`, {
        method: 'GET',
        headers
      })

      if (!response.ok) {
        console.error('Erreur JSONBin:', response.status)
        return []
      }

      const data = await response.json()
      return data.record.scores || []

    } catch (error) {
      console.error('Erreur réseau JSONBin:', error)
      return []
    }
  }

  // Sauvegarder un nouveau score
  async saveScore(wpm, accuracy, playerName = null) {
    if (!this.isConfigured()) {
      console.log('JSONBin non configuré - sauvegarde locale uniquement')
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

      // 4. Garder seulement les 50 meilleurs (pour ne pas surcharger)
      const topScores = sortedScores.slice(0, 50)

      // 5. Sauvegarder dans JSONBin
      const headers = {
        'Content-Type': 'application/json'
      }

      if (this.apiKey) {
        headers['X-Master-Key'] = this.apiKey
      }

      const response = await fetch(`${this.baseUrl}/${this.binId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ scores: topScores })
      })

      if (!response.ok) {
        console.error('Erreur sauvegarde JSONBin:', response.status)
        return false
      }

      console.log('Score sauvegardé dans JSONBin')
      return true

    } catch (error) {
      console.error('Erreur réseau JSONBin:', error)
      return false
    }
  }

  // Récupérer le top 3
  async getTopScores() {
    const allScores = await this.getAllScores()
    return allScores.slice(0, 3)
  }
}

export const jsonbinService = new JSONBinService()
