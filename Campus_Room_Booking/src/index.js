import app from './app.js'

const port = process.env.PORT || 43187

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`)
})