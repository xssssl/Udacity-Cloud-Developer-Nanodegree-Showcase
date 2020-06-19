import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getAllTodoItems } from '../../businessLogic/todos'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getJwtToken } from '../utils'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  try {
    // console.log(event)
    const jwtToken = getJwtToken(event)
    // console.log(`Get JWT Token: ${jwtToken}`)

    const items = await getAllTodoItems(jwtToken)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: error.message
      })
    }
  }
})

handler.use(
  cors({
    credentials: true
  })
  )