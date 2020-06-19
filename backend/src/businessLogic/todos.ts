import * as uuid from 'uuid'

import { TodoItem } from '../models/ResolutionItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess()

export async function getAllTodoItems(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)
  console.log(`getAllTodoItems: User ID: ${userId}`)

  return todoAccess.getAllItems(userId)
}

export async function createTodoItem(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const todoId = uuid.v4()
  const userId = parseUserId(jwtToken)
  console.log(`createTodoItem: User ID: ${userId}`)

  return await todoAccess.createItem({
    userId: userId,
    todoId: todoId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false
  })
}

export async function updateToDo(
  updateTodoRequest: UpdateTodoRequest,
  todoId: string,
  jwtToken: string
): Promise<TodoUpdate> {
  const userId = parseUserId(jwtToken)
  return await todoAccess.updateToDo(updateTodoRequest, todoId, userId)
}

export async function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
  const userId = parseUserId(jwtToken)
  return await todoAccess.deleteToDo(todoId, userId)
}

export function generateUploadUrl(todoId: string, userId:string): Promise<string> {
  return todoAccess.generateUploadUrl(todoId, userId)
}