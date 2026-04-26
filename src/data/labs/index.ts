import { LabData } from '../../types';
import { validateLab } from './validate';

const modules = import.meta.glob<{ default: unknown }>('./*.json', { eager: true });

export const labs: LabData[] = Object.values(modules)
  .map((mod) => mod.default)
  .filter(validateLab)
  .sort((a, b) => a.name.localeCompare(b.name));
