export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MEMBER"
  | "VIEWER";

export interface WorkspaceDTO {
  id: number;
  name: string;
  slug: string;
  role: Role;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponseDTO {
  user: UserDTO;
  workspaces: WorkspaceDTO[];
  accessToken: string;
}

export interface RefreshTokenResponseDTO {
  accessToken: string;
}