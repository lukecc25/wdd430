import { ref } from 'vue';

/** True in the browser bundle only (client-side rendering). */
export const isClientMounted = ref(typeof window !== 'undefined');

export function useClientMounted() {
  return { isClientMounted };
}
