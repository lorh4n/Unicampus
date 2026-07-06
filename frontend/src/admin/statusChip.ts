import type { CSSProperties } from 'react';
import type { AdminCourseStatus } from '../models';

/** Chip de status das tabelas do painel (Ativa verde / Rascunho amarelo). */
export function statusChipStyle(status: AdminCourseStatus): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 11.5,
    fontWeight: 800,
    borderRadius: 9,
    padding: '5px 10px',
    color: status === 'ativa' ? '#16A085' : '#9a8b3d',
    background: status === 'ativa' ? '#E6F7F2' : '#FBF3D9',
  };
}
