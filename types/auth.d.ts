declare module "#auth-utils" {
  interface User {
    id: number;
    name?: string | null;
    username?: string | null;
    password?: string | null;
    email: string;
    birthDate?: number | null;
    country?: string | null;
    aboutMe?: string | null;
    createdAt: number;
    updatedAt: number;
    hash: string;
  }
}

export {};
