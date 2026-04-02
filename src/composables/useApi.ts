import { ref, shallowRef } from 'vue';

import { type HttpError, http } from '@/lib/http';

interface UseApiOptions {
  immediate?: boolean;
}

export function useApi<T>(endpoint: string, options: UseApiOptions = {}) {
  const data = shallowRef<T | null>(null);
  const error = shallowRef<HttpError | null>(null);
  const loading = ref(false);

  let abortController: AbortController | null = null;

  async function execute(): Promise<T | null> {
    abortController?.abort();
    abortController = new AbortController();

    loading.value = true;
    error.value = null;

    try {
      const result = await http.get<T>(endpoint, { signal: abortController.signal });
      data.value = result;
      return result;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return null;
      }
      error.value = err as HttpError;
      return null;
    } finally {
      loading.value = false;
    }
  }

  function abort(): void {
    abortController?.abort();
  }

  if (options.immediate) {
    void execute();
  }

  return { data, error, loading, execute, abort };
}
