import { initializeApp } from 'firebase/app'
import { getFunctions, httpsCallable } from 'firebase/functions'

const firebaseConfig = {
  apiKey: 'AIzaSyATWu8X589F8dcDQkXB6M3OOIkrKH2G10A',
  authDomain: 'eclat-de-jus-b3a68.firebaseapp.com',
  projectId: 'eclat-de-jus-b3a68',
  storageBucket: 'eclat-de-jus-b3a68.appspot.com',
  messagingSenderId: '603137316631',
  appId: '1:603137316631:web:ebcfd2f701b94fa9acc952',
}

initializeApp(firebaseConfig)

// const functions = getFunctions()
// const helloWorld = httpsCallable(functions, 'helloWorld')

// helloWorld()
