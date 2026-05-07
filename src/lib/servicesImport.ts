import {
  collection,
  getDocs,
  writeBatch,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';
import { stripUndefined, type ServiceDoc } from './firestore';

const CHUNK = 500;

export type ServiceSeed = Omit<ServiceDoc, 'id'>;

/** Удаляет все документы в коллекции `services` (пакетами). */
export async function deleteAllServicesInFirestore(): Promise<number> {
  const snap = await getDocs(collection(db, 'services'));
  const ids = snap.docs.map(d => d.id);
  for (let i = 0; i < ids.length; i += CHUNK) {
    const batch = writeBatch(db);
    for (const id of ids.slice(i, i + CHUNK)) {
      batch.delete(doc(db, 'services', id));
    }
    await batch.commit();
  }
  return ids.length;
}

/** Добавляет услуги пакетами (лучше после очистки). */
export async function importServicesBatched(items: ServiceSeed[]): Promise<void> {
  for (let i = 0; i < items.length; i += CHUNK) {
    const batch = writeBatch(db);
    const chunk = items.slice(i, i + CHUNK);
    for (const data of chunk) {
      const ref = doc(collection(db, 'services'));
      batch.set(ref, stripUndefined({ ...data } as Record<string, unknown>));
    }
    await batch.commit();
  }
}
