import { RequestContext } from '@quma/quma_ddd_base';

export function runInTestContext<T>(testFn: () => T): T {
  return RequestContext.runWithContext(testFn, {
    requestId: 'test-request-id',
  });
}

