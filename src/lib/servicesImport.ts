import { getServicesFS, replaceServices, type ServiceDoc } from './firestore';

export type ServiceSeed = Omit<ServiceDoc, 'id'>;

/** Удаляет все услуги и загружает новые одним запросом (PHP API). */
export async function deleteAllServicesInFirestore(): Promise<number> {
  const current = await getServicesFS();
  return current.length;
}

export async function importServicesBatched(items: ServiceSeed[]): Promise<void> {
  await replaceServices(items);
}
