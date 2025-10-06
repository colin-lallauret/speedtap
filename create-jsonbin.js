// Script pour créer automatiquement un bin JSONBin.io
// Exécutez ce script pour créer votre bin automatiquement

async function createJSONBin() {
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
    const response = await fetch('https://api.jsonbin.io/v3/b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bin-Name': 'Speed Typing Scores'
      },
      body: JSON.stringify(initialData)
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ Bin créé avec succès!')
    console.log('📋 Votre Bin ID:', data.metadata.id)
    console.log('🔗 URL pour voir vos données:', `https://api.jsonbin.io/v3/b/${data.metadata.id}/latest`)
    console.log('')
    console.log('📝 Ajoutez ceci dans votre .env.local:')
    console.log(`VITE_JSONBIN_ID=${data.metadata.id}`)
    
    return data.metadata.id
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error)
    return null
  }
}

// Si vous êtes dans Node.js, vous pouvez exécuter ceci:
// createJSONBin()

export { createJSONBin }
