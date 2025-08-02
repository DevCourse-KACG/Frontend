// lib/api.ts

export async function login({ email, password }: { email: string; password: string }) {
  const response = await fetch('http://localhost:8080/api/v1/members/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json(); // 예: { accessToken: "...", refreshToken: "..." }
}
