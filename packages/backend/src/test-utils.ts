import { RequestContext } from '@quma/ddd';

export function runInTestContext<T>(testFn: () => T): T {
  return RequestContext.runWithContext(testFn, {
    requestId: 'test-request-id',
  });
}
