async function routes (fastify, options) {
    fastify.get('/', async (request, reply) => {
      return { hello: 'world of routes' }
    })
    // add a new route
    fastify.get('/test', async (request, reply) => {
      return { hello: 'world of test' }
    })
  }
  
export default routes