// Service de gestion des scores avec fallback localStorage
import { saveScoreToDatabase, getTopScores, getTodayTopScores } from './supabase.js'

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

  // Vérifier si un score mérite d'être dans le top 3 (général OU du jour)
  async isTopScore(wpm, accuracy) {
    try {
      // Vérifier le top 3 de tous les temps
      const currentTopScores = await this.getTopScores()
      
      // Si moins de 3 scores, c'est automatiquement un top score
      if (currentTopScores.length < 3) {
        return true
      }

      // Vérifier si le score est meilleur que le 3ème du classement général
      const thirdPlace = currentTopScores[2]
      
      // Comparer d'abord par WPM, puis par précision
      if (wpm > thirdPlace.wpm) {
        return true
      } else if (wpm === thirdPlace.wpm && accuracy > thirdPlace.accuracy) {
        return true
      }

      // Vérifier également le top 3 du jour (dernières 24h)
      const todayTopScores = await this.getTodayTopScores()
      
      // Si moins de 3 scores aujourd'hui, c'est un top score du jour
      if (todayTopScores.length < 3) {
        return true
      }

      // Vérifier si le score est meilleur que le 3ème du jour
      const thirdPlaceToday = todayTopScores[2]
      
      if (wpm > thirdPlaceToday.wpm) {
        return true
      } else if (wpm === thirdPlaceToday.wpm && accuracy > thirdPlaceToday.accuracy) {
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
      return scores.slice(0, 10) // Top 10 local
    } catch (error) {
      console.error('Erreur localStorage:', error)
      return []
    }
  }

  async getTodayTopScores() {
    try {
      // Essayer de récupérer les scores du jour depuis Supabase
      const onlineScores = await getTodayTopScores()
      
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
      console.log('Erreur récupération scores du jour Supabase, utilisation des scores locaux récents')
    }

    // Fallback sur les scores locaux des dernières 24h
    const localTodayScores = this.getLocalTodayScores()
    return localTodayScores || [] // S'assurer de toujours retourner un tableau
  }

  getLocalTodayScores() {
    try {
      const scores = JSON.parse(localStorage.getItem('speedTypingScores') || '[]')
      
      // S'assurer que scores est un tableau
      if (!Array.isArray(scores)) {
        return []
      }
      
      const yesterday = Date.now() - (24 * 60 * 60 * 1000) // 24h en millisecondes
      
      // Filtrer les scores des dernières 24h et prendre le top 3
      const todayScores = scores.filter(score => 
        score && 
        typeof score.date === 'number' && 
        score.date >= yesterday
      )
      
      return todayScores.slice(0, 3)
    } catch (error) {
      console.error('Erreur localStorage pour les scores du jour:', error)
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
