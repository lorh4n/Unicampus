// Ponto único de acesso ao Model: escolhe mock (modo dev) ou HTTP (backend real).
import { isDevMode } from '../http/httpClient';
import { httpRepositories } from './httpRepositories';
import { mockRepositories } from './mockRepositories';
import type { Repositories } from './types';

export const repos: Repositories = isDevMode ? mockRepositories : httpRepositories;
export { isDevMode };
export type { Repositories, SignupPayload } from './types';
