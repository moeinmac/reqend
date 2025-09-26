import localForage from "localforage";

const storage = localForage.createInstance({
  name: "reqend",
  storeName: "collection",
  driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE],
});

export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    return await storage.getItem<T>(key);
  } catch (err) {
    console.error("Storage get error:", err);
    return null;
  }
};

export const setItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    await storage.setItem(key, value);
  } catch (err) {
    console.error("Storage set error:", err);
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await storage.removeItem(key);
  } catch (err) {
    console.error("Storage remove error:", err);
  }
};

export const clear = async (): Promise<void> => {
  try {
    await storage.clear();
  } catch (err) {
    console.error("Storage clear error:", err);
  }
};
