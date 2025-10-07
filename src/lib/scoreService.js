// Service de gestion des scores avec fallback localStorage
import { saveScoreToDatabase, getTopScores } from './supabase.js'

class ScoreService {
  async saveScore(wpm, accuracy, playerName = null) {
    const score = {
      wpm: parseFloat(wpm.toFixed(1)),
      accuracy: parseFloat(accuracy.toFixed(1)),
      playerName: playerName,
      date: Date.now()
    }

    // Toujours sauvegarder en local comme backup
    this.saveToLocalStorage(score)

    // Essayer de sauvegarder en ligne avec Supabase
    try {
      console.log('Tentative de sauvegarde:', score)
      const success = await saveScoreToDatabase(score.wpm, score.accuracy, score.playerName)
      if (success) {
        console.log('✅ Score sauvegardé dans Supabase et localement')
      } else {
        console.log('⚠️ Score sauvegardé uniquement localement')
      }
    } catch (error) {
      console.log('❌ Erreur réseau, score sauvegardé uniquement localement:', error)
    }
  }

  // Vérifier si un score mérite d'être dans le top 3
  async isTopScore(wpm, accuracy) {
    try {
      const currentTopScores = await this.getTopScores()
      
      // Si moins de 3 scores, c'est automatiquement un top score
      if (currentTopScores.length < 3) {
        return true
      }

      // Vérifier si le score est meilleur que le 3ème
      const thirdPlace = currentTopScores[2]
      
      // Comparer d'abord par WPM, puis par précision
      if (wpm > thirdPlace.wpm) {
        return true
      } else if (wpm === thirdPlace.wpm && accuracy > thirdPlace.accuracy) {
        return true
      }

      return false
    } catch (error) {
      console.error('Erreur lors de la vérification du top score:', error)
      return false
    }
  }

  saveToLocalStorage(score) {
    try {
      const existingScores = JSON.parse(localStorage.getItem('speedTypingScores') || '[]')
      existingScores.push(score)
      
      // Garder seulement les 10 meilleurs scores locaux
      const sortedScores = existingScores.sort((a, b) => {
        if (b.wpm !== a.wpm) {
          return b.wpm - a.wpm
        }
        return b.accuracy - a.accuracy
      })

      localStorage.setItem('speedTypingScores', JSON.stringify(sortedScores.slice(0, 10)))
    } catch (error) {
      console.error('Erreur localStorage:', error)
    }
  }

  async getTopScores() {
    try {
      // Essayer de récupérer les scores depuis Supabase
      const onlineScores = await getTopScores()
      
      if (onlineScores && onlineScores.length > 0) {
        // Convertir le format Supabase vers notre format
        return onlineScores.map(score => ({
          wpm: score.wpm,
          accuracy: score.accuracy,
          playerName: score.player_name,
          date: new Date(score.created_at).getTime()
        }))
      }
    } catch (error) {
      console.log('Erreur récupération Supabase, utilisation des scores locaux')
    }

    // Fallback sur les scores locaux (commenté pour forcer Supabase uniquement)
    // return this.getLocalScores()
    return [] // Retourner un tableau vide si pas de scores Supabase
  }

  getLocalScores() {
    try {
      const scores = JSON.parse(localStorage.getItem('speedTypingScores') || '[]')
      return scores.slice(0, 3) // Top 3 local
    } catch (error) {
      console.error('Erreur localStorage:', error)
      return []
    }
  }

  // Méthode debug pour vider tous les scores (local + affichage)
  clearAllScores() {
    localStorage.removeItem('speedTypingScores')
    console.log('Scores locaux effacés')
  }
}

export const scoreService = new ScoreService()
