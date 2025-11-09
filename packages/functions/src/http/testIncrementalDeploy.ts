/**
 * Test Function for Incremental Deployment
 *
 * Purpose: Verify whether we can add a single function without rebuilding all functions
 *
 * Test Plan:
 * 1. Add this file
 * 2. Import it in src/index.ts
 * 3. Run npm run build (should only compile this new file)
 * 4. Deploy with func azure functionapp publish
 * 5. Check if function count goes from 19 to 20
 *
 * Expected Results:
 * - If incremental works: Function deploys, count = 20
 * - If full rebuild required: Need to verify all 19 functions still work
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

export async function testIncrementalDeploy(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('Test incremental deploy function invoked');

  return {
    status: 200,
    jsonBody: {
      message: 'Test incremental deploy function works!',
      timestamp: new Date().toISOString(),
      functionCount: 20,
      deploymentType: 'incremental test'
    }
  };
}

app.http('testIncrementalDeploy', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'test/incremental-deploy',
  handler: testIncrementalDeploy,
});
