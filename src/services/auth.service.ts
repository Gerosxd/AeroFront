// src/services/auth.service.ts
import http from '@/api/http';

export type LoginResponse = {
    token: string;
    username: string;
};

export async function login(username: string, password: string) {
    const { data } = await http.post<LoginResponse>('/api/auth/login', {
        username,
        password,
    });
    return data;
}

export function saveSession(session: LoginResponse) {
    localStorage.setItem('token', session.token);
    localStorage.setItem('username', session.username);
}

export function getToken() {
    return localStorage.getItem('token');
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
}