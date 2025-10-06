import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Vérifier que les variables d'environnement sont définies
let supabase = null

if (!supabaseUrl || !supabaseKey) {
  console.warn('Variables Supabase manquantes - fonctionnement en mode local uniquement')
} else {
  supabase = createClient(supabaseUrl, supabaseKey)
}

export { supabase }

// Structure de la table scores :
// CREATE TABLE scores (
//   id SERIAL PRIMARY KEY,
//   wpm DECIMAL(5,1) NOT NULL,
//   accuracy DECIMAL(5,1) NOT NULL,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

export const saveScoreToDatabase = async (wpm, accuracy, playerName = null) => {
  if (!supabase) {
    console.log('Supabase non configuré - sauvegarde locale uniquement')
    return false
  }

  try {
    const { data, error } = await supabase
      .from('scores')
      .insert([
        { 
          wpm: parseFloat(wpm.toFixed(1)), 
          accuracy: parseFloat(accuracy.toFixed(1)),
          player_name: playerName
        }
      ])
      .select()

    if (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      return false
    }

    console.log('Score sauvegardé:', data)
    return true
  } catch (error) {
    console.error('Erreur réseau:', error)
    return false
  }
}

export const getTopScores = async () => {
  if (!supabase) {
    console.log('Supabase non configuré - utilisation des scores locaux')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('scores')
      .select('wpm, accuracy, player_name, created_at')
      .order('wpm', { ascending: false })
      .order('accuracy', { ascending: false })
      .limit(3)

    if (error) {
      console.error('Erreur lors de la récupération:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Erreur réseau:', error)
    return []
  }
}
