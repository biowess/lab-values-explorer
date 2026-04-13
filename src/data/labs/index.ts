import { LabData } from '../../types';
import hemoglobin from './hemoglobin.json';
import sodium from './sodium.json';
import potassium from './potassium.json';
import bmi from './bmi.json';
import radiothoracicIndex from './radiothoracic-index.json';
import wbc from './wbc.json';

export const labs: LabData[] = [
  hemoglobin as LabData,
  sodium as LabData,
  potassium as LabData,
  bmi as LabData,
  radiothoracicIndex as LabData,
  wbc as LabData,
];
