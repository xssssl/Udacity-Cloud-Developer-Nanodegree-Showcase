
  

# Serverless Resolution Reminder

This application is my showcase project for the [Udacity Cloud Developer Nanodegree](https://www.udacity.com/course/cloud-developer-nanodegree--nd9990).

The resolution reminder is an **AWS Serverless Application** where a user can pen down their ideas, feelings and inspired images.

# Technology Stack

* AWS 
  * Lambdas (serverless functions)
  * DynamoDB (database)
  * S3 (storage of images)
  * X-Ray (distributed tracing)
* Infrastructure as Code (IaC)
  * [Serverless Framework](https://serverless.com/)
  *  AWS CloudFormation
* Web Application Client
  * React
* [Auth0](https://auth0.com/)
  * 3rd party OAuth integration

# Functionality

* The application allows users to read, create, update, delete resolution ideas
* The application allows users to upload a file through [S3 pre-signed URL](https://docs.aws.amazon.com/AmazonS3/latest/dev/PresignedUrlUploadObject.html)
* The application only displays resolutions for a logged in user
* Authentication is implemented and does not allow unauthenticated access
![Home.png](https://github.com/xssssl/Udacity-Cloud-Developer-Nanodegree-Showcase/blob/dev/screenshots/Home.png)

# Best Practices
* The business layer of the application is separated from data layer code for database access, file storage, and code related to AWS Lambda
* Application has sufficient monitoring with the help of X-Ray and [winston](https://www.npmjs.com/package/winston)
* HTTP requests are validated through using request validation in API Gateway
* RS256 (asymmetric) algorithm is applied to sign a JWT token
* Each Lambda function has its own set of permissions
* Individual packaging of Lambdas

# Resolution item

Each resolution item contains the following fields:
* `userId` (string) - a unique id for a user which is parsed from [Auth0 JSON Web Token](https://auth0.com/docs/tokens/concepts/jwts)
* `itemId` (string) - a unique id for an item
* `title` (string) - title of a resolution item (e.g. "Do more exercises")
* `desc` (string) - description of a resolution item
* `createdAt` (string) - date and time when an item was created
* `modifiedAt` (string) - date and time when an item was last modified
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a resolution item

# API Reference

| Method | HTTP request | Description |
|--|--|--|
| List | Get */items* | Lists all resolutions of the logged in user |
| Create | Post */items* | Create a new resolution |
| Update | Put */items/{itemId}* | Update an existed resolution |
| Delete | Delete */items/{itemId}* | Delete an existed resolution |
| Get | Post */items/{itemId}/attachment* | Get a S3 pre-signed URL for attachment |

#  Local Debugging

## Dynamodb
To deploy Dynamodb locally run the following commands:
```

cd backend

sls dynamodb start

```
A Dynamodb seed data is prepared and would applied automatically.
![Run Dynamodb Locally.png](https://github.com/xssssl/Udacity-Cloud-Developer-Nanodegree-Showcase/blob/dev/screenshots/Run%20Dynamodb%20Locally.png)

## API Gateway and Lambda
To deploy API Gateway and Lambda locally run the following commands:
```

cd backend

sls offline

```
![Deploy locally.png](https://github.com/xssssl/Udacity-Cloud-Developer-Nanodegree-Showcase/blob/dev/screenshots/Deploy%20locally.png)

# How to run the application
  
## Backend

To deploy an application run the following commands:

```

cd backend

npm install

sls deploy -v

```

## Client

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```

cd client

npm install

npm run start

```
# Screenshots
* Deploy to AWS
![Deploy to AWS.png](https://github.com/xssssl/Udacity-Cloud-Developer-Nanodegree-Showcase/blob/dev/screenshots/Deploy%20to%20AWS.png "Deploy to AWS.png")
* AWS CloudFormation Stack
![CloudFormation Stack.png](https://github.com/xssssl/Udacity-Cloud-Developer-Nanodegree-Showcase/blob/dev/screenshots/CloudFormation%20Stack.png "CloudFormation Stack.png")
* AWS X-Ray Service Map
![X-Ray Service Map 2.png](https://github.com/xssssl/Udacity-Cloud-Developer-Nanodegree-Showcase/blob/dev/screenshots/X-Ray%20Service%20Map%202.png "X-Ray Service Map 2.png")
* Auth0 Authentication
![Auth0.png](https://github.com/xssssl/Udacity-Cloud-Developer-Nanodegree-Showcase/blob/dev/screenshots/Auth0.png "Auth0.png")