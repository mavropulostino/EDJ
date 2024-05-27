import { initializeApp } from 'firebase/app'
import firebase from 'firebase/compat/app'
import { getFunctions, httpsCallable } from 'firebase/functions'

const firebaseConfig = {
  apiKey: 'AIzaSyATWu8X589F8dcDQkXB6M3OOIkrKH2G10A',
  authDomain: 'eclat-de-jus-b3a68.firebaseapp.com',
  projectId: 'eclat-de-jus-b3a68',
  storageBucket: 'eclat-de-jus-b3a68.appspot.com',
  messagingSenderId: '603137316631',
  appId: '1:603137316631:web:ebcfd2f701b94fa9acc952',
}

const app = initializeApp(firebaseConfig)

async function preparePayment(req) {
  try {
    const processRef = httpsCallable(getFunctions(), 'preparePayment')
    const response = await processRef(req)
    console.log(response.data.format)
    return response.data.format
  } catch (error) {
    console.log(error)
  }
}

export { preparePayment }
