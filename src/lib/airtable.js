// Service Airtable pour gérer les scores
// Documentation : https://airtable.com/developers/web/api/introduction

class AirtableService {
  constructor() {
    // Ces valeurs seront définies dans les variables d'environnement
    this.baseId = import.meta.env.VITE_AIRTABLE_BASE_ID
    this.apiKey = import.meta.env.VITE_AIRTABLE_API_KEY
    this.tableName = 'Scores' // Nom de votre table dans Airtable
  }

  // Vérifier si Airtable est configuré
  isConfigured() {
    return !!(this.baseId && this.apiKey)
  }

  // Sauvegarder un score dans Airtable
  async saveScore(wpm, accuracy, playerName = null) {
    if (!this.isConfigured()) {
      console.log('Airtable non configuré - sauvegarde locale uniquement')
      return false
    }

    try {
      const response = await fetch(`https://api.airtable.com/v0/${this.baseId}/${this.tableName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            WPM: parseFloat(wpm.toFixed(1)),
            Accuracy: parseFloat(accuracy.toFixed(1)),
            PlayerName: playerName || '',
            Date: new Date().toISOString()
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Erreur Airtable:', error)
        return false
      }

      const data = await response.json()
      console.log('Score sauvegardé dans Airtable:', data)
      return true
    } catch (error) {
      console.error('Erreur réseau Airtable:', error)
      return false
    }
  }

  // Récupérer les top 3 scores depuis Airtable
  async getTopScores() {
    if (!this.isConfigured()) {
      console.log('Airtable non configuré - utilisation des scores locaux')
      return []
    }

    try {
      // Trier par WPM décroissant, puis par Accuracy décroissant
      const url = `https://api.airtable.com/v0/${this.baseId}/${this.tableName}?sort%5B0%5D%5Bfield%5D=WPM&sort%5B0%5D%5Bdirection%5D=desc&sort%5B1%5D%5Bfield%5D=Accuracy&sort%5B1%5D%5Bdirection%5D=desc&maxRecords=3`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Erreur récupération Airtable:', error)
        return []
      }

      const data = await response.json()
      
      // Convertir le format Airtable vers notre format
      return data.records.map(record => ({
        wpm: record.fields.WPM,
        accuracy: record.fields.Accuracy,
        playerName: record.fields.PlayerName || null,
        date: new Date(record.fields.Date).getTime()
      }))
    } catch (error) {
      console.error('Erreur réseau Airtable:', error)
      return []
    }
  }
}

export const airtableService = new AirtableService()
