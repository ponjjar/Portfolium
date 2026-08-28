/**
 * Executes a set of async tasks with a maximum concurrency limit.
 * 
 * @param items Array of items to process
 * @param concurrencyLimit Maximum number of concurrent tasks
 * @param processor Async function to process each item
 * @returns Array of results
 */
export async function runWithConcurrency<T, R>(
  items: T[],
  concurrencyLimit: number,
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  const queue = items.map((item, index) => ({ item, index }));
  
  const worker = async () => {
    while (queue.length > 0) {
      const task = queue.shift();
      if (task) {
        results[task.index] = await processor(task.item);
      }
    }
  };

  const workers = Array.from({ length: Math.min(concurrencyLimit, items.length) }, () => worker());
  await Promise.all(workers);
  
  return results;
}
