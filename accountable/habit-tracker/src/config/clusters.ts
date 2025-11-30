import { Cluster } from '@/data/models/Cluster';

export const CLUSTERS = [
  new Cluster(
    'physical',
    'PHYSICAL',
    'physical',
    ['yoga', 'gym', 'jiu-jitsu', 'sauna'],
    1 // 1 of 4 required
  ),
  new Cluster(
    'mental',
    'MENTAL',
    'mental',
    ['meditation', 'not-yelling'],
    2 // 2 of 2 required
  ),
  new Cluster(
    'diet',
    'DIET/HEALTH',
    'diet',
    ['supplements'],
    1 // 1 of 1 required
  ),
];