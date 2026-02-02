type CacheMap<T> = Record<string, T[]>;

export function createListCache<T extends { rowIndex: number }>() {
   const cache: CacheMap<T> = {};

   function getKey(mes: string, ano: number|string) {
      return `${ano}-${mes}`;
   }

   function get(mes: string, ano: number|string) {
      return cache[getKey(mes, ano)];
   }

   function set(mes: string, ano: number|string, data: T[]) {
      cache[getKey(mes, ano)] = data;
   }

   function remove(mes: string, ano: number|string, rowIndex: number) {
      const key = getKey(mes, ano);
      if (!cache[key]) return;

      cache[key] = cache[key].filter(i => i.rowIndex !== rowIndex);
   }

   function update(mes: string, ano: number|string, payload: Partial<T> & { rowIndex: number }) {
      const key = getKey(mes, ano);
      if (!cache[key]) return;

      cache[key] = cache[key].map(i =>
         i.rowIndex === payload.rowIndex
            ? { ...i, ...payload }
            : i
      );
   }

   function clear(mes?: string, ano?: number|string) {
      if (!mes || !ano) {
         Object.keys(cache).forEach(k => delete cache[k]);
         return;
      }
      delete cache[getKey(mes, ano)];
   }

   return {
      getKey,
      get,
      set,
      update,
      remove,
      clear
   };
}
