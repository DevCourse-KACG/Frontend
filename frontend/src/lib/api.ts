export async function login({ email, password }: { email: string; password: string }) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const response = await fetch(`${API_BASE_URL}/api/v1/members/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // à¤| ìhXì ”­
  });

  if (!response.ok) {
    let errorMessage = 'Login failed';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      // JSON ñ ä( Ü 0ø TÜÀ ¬©
    }
    throw new Error(errorMessage);
  }

  return response.json(); // : { accessToken: "...", refreshToken: "..." 
  }