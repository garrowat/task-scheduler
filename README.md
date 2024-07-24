## Description

A Task Scheduler API using the [Nest](https://github.com/nestjs/nest) framework.

This project also uses the Prisma ORM with Postgres.

## Requirements

- pnpm
- docker
- prisma

## Installation

```bash
$ pnpm install
```

## Running the app

### Run the Postgres Container

```bash
docker-compose up -d
```

### Set up .env

Create a .env file in the root directory and add the following:

`DATABASE_URL="postgresql://user:password@localhost:5555/task_scheduler_db"`

### Prisma

```bash
npx prisma generate
```

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev
```

## Test

```bash
# unit tests
$ pnpm run test
```

## Testing the Endpoints

Use the Postman collection in `/tools` or run the following cUrl requests:

| Curl Request                                                                                                                                                                                                                           | Endpoint                                  | Expected Result                                                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `curl --location --request GET 'http://localhost:3333/schedules/1'`                                                                                                                                                                    | `/schedules/:id`                          | Returns the schedule with ID 1. If the schedule does not exist, it should return a 404 Not Found error.                                                        |
| `curl --location --request GET 'http://localhost:3333/schedules'`                                                                                                                                                                      | `/schedules`                              | Returns all schedules. If there are no schedules, it should return an empty array.                                                                             |
| `curl --location --request GET 'http://localhost:3333/filtered-schedules/2024-07-23T10:00:00Z/2024-07-23T22:00:00Z'`                                                                                                                   | `/filtered-schedules/:startTime/:endTime` | Returns schedules filtered by the specified start and end times. If there are no matching schedules, it should return an empty array.                          |
| `curl --location --request POST 'http://localhost:3333/schedules' \ --header 'Content-Type: application/json' \ --data-raw '{ "accountId": 1, "agentId": 1, "startTime": "2024-07-23T10:00:00Z", "endTime": "2024-07-23T12:00:00Z" }'` | `/schedules`                              | Creates a new schedule with the specified data. Returns the created schedule. If the data is invalid, it should return a 400 Bad Request error.                |
| `curl --location --request PATCH 'http://localhost:3333/schedules/1' \ --header 'Content-Type: application/json' \ --data-raw '{ "startTime": "2024-07-23T11:00:00Z", "endTime": "2024-07-23T13:00:00Z" }'`                            | `/schedules/:id`                          | Updates the schedule with ID 1 with the specified data. Returns the updated schedule. If the schedule does not exist, it should return a 404 Not Found error.  |
| `curl --location --request DELETE 'http://localhost:3333/schedules/1'`                                                                                                                                                                 | `/schedules/:id`                          | Deletes the schedule with ID 1. Returns the deleted schedule. If the schedule does not exist, it should return a 404 Not Found error.                          |
| `curl --location --request GET 'http://localhost:3333/tasks/1'`                                                                                                                                                                        | `/tasks/:id`                              | Returns the task with ID 1. If the task does not exist, it should return a 404 Not Found error.                                                                |
| `curl --location --request GET 'http://localhost:3333/tasks'`                                                                                                                                                                          | `/tasks`                                  | Returns all tasks. If there are no tasks, it should return an empty array.                                                                                     |
| `curl --location --request POST 'http://localhost:3333/tasks' \ --header 'Content-Type: application/json' \ --data-raw '{ "scheduleId": "1", "startTime": "2024-07-23T10:00:00Z", "duration": 60, "type": "work" }'`                   | `/tasks`                                  | Creates a new task with the specified data. Returns the created task. If the data is invalid or there is a conflict, it should return a 400 Bad Request error. |
| `curl --location --request PATCH 'http://localhost:3333/tasks/1' \ --header 'Content-Type: application/json' \ --data-raw '{ "duration": 45 }'`                                                                                        | `/tasks/:id`                              | Updates the task with ID 1 with the specified data. Returns the updated task. If the task does not exist, it should return a 404 Not Found error.              |
| `curl --location --request DELETE 'http://localhost:3333/tasks/1'`                                                                                                                                                                     | `/tasks/:id`                              | Deletes the task with ID 1. Returns the deleted task. If the task does not exist, it should return a 404 Not Found error.                                      |

# Future Considerations

- Integration/E2E testing using [Supertest](https://docs.nestjs.com/fundamentals/testing#end-to-end-testing)
- Smarter task booking, where the legality of the task is checked in more detail
- Mock data generation using Prisma
