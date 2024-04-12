import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {userFlowEnum} from '../constants/enum';


const usePersistentStore = create(
  persist(
    (set, get) => ({
      status: userFlowEnum.INITIAL,
      direction: 0, // -1 = Bear, 1 = Bull
      isClaimedTokens: 0,
      timePurchased: new Date(),
      setTimePurchased: (time) => set(() => ({timePurchased: time})),
      setStatus: (status) => set(() => ({ status}))
    }),
    {
      name: 'persistence-storage', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage) // (optional) by default the 'localStorage' is used
    }
  )
);

export default usePersistentStore;
