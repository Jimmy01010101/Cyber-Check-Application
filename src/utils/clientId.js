import { v4 as uuidv4 } from 'uuid'

export function getClientId() {
  let clientId = localStorage.getItem('client_id')

  if (!clientId) {
    clientId = uuidv4()
    localStorage.setItem('client_id', clientId)
    console.log('Client ID baru dibuat:', clientId)
  } else {
    console.log('Client ID lama dipakai:', clientId)
  }

  return clientId
}