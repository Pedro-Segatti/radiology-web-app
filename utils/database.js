import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjUXcXaUiqHks8z_2B9vtGeUnNluFgJs0",
  authDomain: "presente-site.firebaseapp.com",
  projectId: "presente-site",
  storageBucket: "presente-site.appspot.com",
  messagingSenderId: "86568649815",
  appId: "1:86568649815:web:b89a8d7f2dbebad79ccf12",
  measurementId: "G-T0P020H3BK"
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

export function getFirebaseAuthErrorMessage(error) {  
  switch (error.code) {
    case 'auth/invalid-email':
      return 'O e-mail fornecido é inválido.';
    case 'auth/user-disabled':
      return 'Este usuário foi desativado.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado. Verifique suas credenciais.';
    case 'auth/wrong-password':
      return 'Senha incorreta. Tente novamente.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas de login. Tente novamente mais tarde.';
    case 'auth/invalid-credential':
      return 'Credenciais inválidas';
    case 'auth/email-already-in-use':
      return 'E-mail já cadastrado';
    default:
      return error.message || 'Não foi possível realizar o login. Lembre-se de ativar a sua conta pelo e-mail enviado ao criar a conta.';
  }
}