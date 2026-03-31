import { getPayload } from 'payload'
import config from './src/payload.config'

async function checkData() {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({ collection: 'reponses' })
  
  console.log('--- Database Audit ---')
  docs.forEach(doc => {
    console.log(`ID: ${doc.id}, Accueil: "${doc.accueil}", Attente: "${doc.attente}", Service: "${doc.serviceGlobal}"`)
  })
}

checkData()
