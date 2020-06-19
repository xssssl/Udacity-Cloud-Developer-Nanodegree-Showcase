import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodoItem } from '../../businessLogic/todos'
import { getJwtToken } from '../utils'


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  try {
    const jwtToken = getJwtToken(event)
    // console.log(`Get JWT Token: ${jwtToken}`)

    const item = await createTodoItem(newTodo, jwtToken)
    return {
      statusCode: 200,
      body: JSON.stringify({
        item
      })
    }
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        item: newTodo,
        message: 'Create todo item failed'
      })
    }
  }
})

handler.use(
  cors({
    credentials: true
  })
)
