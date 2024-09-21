import Fastify from 'fastify'
import routes from './routes.js'
import dbConnector from './our-db-connector.js'

const fastify = Fastify({
  logger: true
})

// Declare a route
/*
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world!!' })
})
*/

fastify.register(dbConnector)

// use route from routes.js
fastify.register(routes)


// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})