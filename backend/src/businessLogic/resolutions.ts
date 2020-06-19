import * as uuid from 'uuid'

import { ResolutionItem } from '../models/ResolutionItem'
// import { ResolutionUpdate } from '../models/ResolutionUpdate'
import { ResolutionAccess } from '../dataLayer/resAccess'
import { CreateResolutionRequest } from '../requests/CreateResolutionRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'

const resolutionAccess = new ResolutionAccess()

export async function getAllResolutionItems(jwtToken: string): Promise<ResolutionItem[]> {
  const userId = parseUserId(jwtToken)
  console.log(`getAllTodoItems: User ID: ${userId}`)

  return resolutionAccess.getAllItems(userId)
}

export async function createResolutionItem(
  createResolutionRequest: CreateResolutionRequest,
  jwtToken: string
): Promise<ResolutionItem> {

  const resId = uuid.v4()
  const userId = parseUserId(jwtToken)
  const date = new Date().toISOString()

  return await resolutionAccess.createItem({
    userId: userId,
    resId: resId,
    title: createResolutionRequest.title,
    desc: createResolutionRequest.desc,    
    createdAt: date,
    modifiedAt: date
  })
}

// export async function updateToDo(
//   updateTodoRequest: UpdateTodoRequest,
//   todoId: string,
//   jwtToken: string
// ): Promise<TodoUpdate> {
//   const userId = parseUserId(jwtToken)
//   return await todoAccess.updateToDo(updateTodoRequest, todoId, userId)
// }

// export async function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
//   const userId = parseUserId(jwtToken)
//   return await todoAccess.deleteToDo(todoId, userId)
// }

// export function generateUploadUrl(todoId: string, userId:string): Promise<string> {
//   return todoAccess.generateUploadUrl(todoId, userId)
// }