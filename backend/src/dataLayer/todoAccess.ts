import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { Types } from 'aws-sdk/clients/s3'

// const XAWS = AWSXRay.captureAWS(AWS)
const AWSSDK = chooseAwsSdk()

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly s3Client: Types = new AWSSDK.S3({ signatureVersion: 'v4' }),
    private readonly s3BucketName = process.env.TODOS_S3_BUCKET,
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async getAllItems(userId: string): Promise<TodoItem[]> {
    console.log(`Getting all items: ${userId}`)
    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
    const items = result.Items
    return items as TodoItem[]
  }

  async createItem(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()
    return todoItem
  }

  async updateToDo(
    todoUpdate: TodoUpdate,
    todoId: string,
    userId: string
  ): Promise<TodoUpdate> {
    console.log(`Updating todo: User ID: ${userId}`)

    const params = {
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'set #a = :a, #b = :b, #c = :c',
      ExpressionAttributeNames: {
        '#a': 'name',
        '#b': 'dueDate',
        '#c': 'done'
      },
      ExpressionAttributeValues: {
        ':a': todoUpdate['name'],
        ':b': todoUpdate['dueDate'],
        ':c': todoUpdate['done']
      },
      ReturnValues: 'ALL_NEW'
    }

    const result = await this.docClient.update(params).promise()
    console.log(result)
    const attributes = result.Attributes

    return attributes as TodoUpdate
  }

  async deleteToDo(todoId: string, userId: string): Promise<string> {
    console.log(`Deleting todo: User ID: ${userId}`)

    const params = {
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    }

    const result = await this.docClient.delete(params).promise()
    console.log(result)

    return '' as string
  }

  async generateUploadUrl(todoId: string, userId: string): Promise<string> {
    console.log(`Generating Upload URL: Todo ID: ${todoId}`)
    const uploadUrl = `https://${this.s3BucketName}.s3.amazonaws.com/${todoId}`
  
    await this.docClient.update({
      TableName: this.todosTable,
        Key: {
          "userId": userId,
          "todoId": todoId
        },
        UpdateExpression: "set attachmentUrl= :attachmentUrl",
        ExpressionAttributeValues:{
          ":attachmentUrl": uploadUrl
        }
    }).promise()

    const url = this.s3Client.getSignedUrl('putObject', {
      Bucket: this.s3BucketName,
      Key: todoId,
      Expires: 3000
    })

    return url as string
  }
}

function chooseAwsSdk() {
  if(process.env.AWS_X_RAY_ENABLE) {
    console.log('AWS X-Ray enabled')
    return AWSXRay.captureAWS(AWS)
  } else {
    console.log('AWS X-Ray disabled')
    return AWS
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    const localDynamodbPort = process.env.LOCAL_DYNAMODB_PORT
    console.log(`IS_OFFLINE=${process.env.IS_OFFLINE}`)
    console.log(`Creating a local DynamoDB instance: Port:${localDynamodbPort}`)
    return new AWSSDK.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: `http://localhost:${localDynamodbPort}`
    })
  }
  return new AWSSDK.DynamoDB.DocumentClient()
}