async function routes (fastify, options) {
    const collection = fastify.mongo.db.collection('test_collection')

    // by adding a response schema, we can make sure that the response is always in the expected format and that we are not leaking information
    const opts = {
        schema: {
          response: {
            200: {
              type: 'object',
              properties: {
                hello: { type: 'string' }
              }
            }
          }
        }
    }

    fastify.get('/', opts, async (request, reply) => {
      return { hello: 'world', db: 'test_database' }  
      // db: 'test_database' will not be returned because it is not in the response schema  
    })
  
    fastify.get('/animals', async (request, reply) => {
      const result = await collection.find().toArray()
      if (result.length === 0) {
        throw new Error('No documents found')
      }
      return result
    })
  
    fastify.get('/animals/:animal', async (request, reply) => {
      const result = await collection.findOne({ animal: request.params.animal })
      if (!result) {
        throw new Error('Invalid value')
      }
      return result
    })
    
    // Request data validation
    const animalBodyJsonSchema = {
      type: 'object',
      required: ['animal'],
      properties: {
        animal: { type: 'string' },
        age: { type: 'number' },
        favoriteSnacks: {
          type: 'array'
        }
      },
    }
    const myQuerySchema = {
      query: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          excitement: { type: 'integer' }
        }
      },
    }

    fastify.get('/q', {myQuerySchema} ,async (request, reply) => {
      console.log('query ->>')
      console.log(request.query)
      reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ your_query: request.query })
    })
  
    const schema = {
      body: animalBodyJsonSchema,
      query: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          excitement: { type: 'integer' }
        }
      },
    }
  
    fastify.post('/animals', { schema }, async (request, reply) => {
        // Fastify parses 'application/json' and 'text/plain' request payloads natively
        console.log(request.body)
        console.log(request.body.animal)
        console.log(request.body.age)
        console.log('query ->>')
        console.log(request.query)
        // we can use the `request.body` object to get the data sent by the client
        const result = await collection.insertOne({ animal: request.body.animal, age: request.body.age, favoriteSnacks: request.body.favoriteSnacks })
        return result
    })
}

export default routes