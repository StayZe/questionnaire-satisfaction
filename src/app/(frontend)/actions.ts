'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function submitReponse(formData: any) {
  try {
    const payload = await getPayload({ config })
    
    const reponse = await payload.create({
      collection: 'reponses',
      data: formData,
      // Access control is bypassable if we want to ignore it here, 
      // but payload.create already checks permissions if overrideAccess is false (default is true for Local API).
      // Since it's a public form, we can just create it.
    })
    
    return { success: true, id: reponse.id }
  } catch (error) {
    console.error('Error in submitReponse:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
