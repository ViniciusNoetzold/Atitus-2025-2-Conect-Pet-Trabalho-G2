import axios from 'axios';

// Usar variável de ambiente para o URL base da API
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ripe-donella-atitus-fbbf314a.koyeb.app';
const API_URL = `${BASE_URL}/auth`;

// NOVO: Flag para ativar a API de dados simulados
const IS_MOCKING = import.meta.env.VITE_MOCK_API === 'true';

// Dados simulados
const MOCK_TOKEN = 'mock-auth-token-123';

export async function signIn(email, password) {
  if (IS_MOCKING) {
    console.log('MOCK API: Simulating successful sign-in');
    return new Promise((resolve) => setTimeout(() => resolve({ token: MOCK_TOKEN }), 500));
  }

  try {
    const response = await axios.post(`${API_URL}/signin`, { email, password });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error('Requisição inválida.');
      }
      if (error.response.status === 401) {
        throw new Error('Usuário ou senha incorretos.');
      }
    }
    throw new Error('Erro ao autenticar.');
  }
}

export async function signUp(name, email, password) {
  if (IS_MOCKING) {
    console.log('MOCK API: Simulating successful sign-up');
    return new Promise((resolve) => setTimeout(() => resolve({ message: 'Usuário cadastrado com sucesso (MOCK).' }), 500));
  }

  try {
    const response = await axios.post(`${API_URL}/signup`, { name, email, password });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error('Requisição inválida.');
      }
      if (error.response.status === 409) {
        throw new Error('Usuário já cadastrado.');
      }
    }
    throw new Error('Erro ao cadastrar usuário.');
  }
}