# feedback_project
## Установка и запуск проекта

1. **Клонировать репозиторий:**  
   ```bash
   git clone https://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@github.com/nioh13/feedback_project.git
   ```
   
2. **Перейти в директорию проекта и установить зависимости:**
   ```bash
   cd feedback_project
   npm install
   ```

3. **Смена под вашу базу:**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public" // - здесь поменять значения
   JWT_SECRET="kodzima"
   PORT=4000
   ```
 

4. **Применить миграции Prisma:**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **(Опционально) Заполнить тестовыми данными:**
   ```bash
   npm run prisma:seed
   ```
   Это создаст несколько категорий и статусов в базе.

6. **Запустить сервер:**
   ```bash
   npm run dev
   ```
   
   Сервер будет доступен на локалке `http://localhost:4000`.

---

## Основные эндпоинты и их использование

Ниже перечислены все основные маршруты API, метод запроса и необходимый набор данных, а также примеры запросов для Postman.

### Авторизация (Auth)

#### Регистрация пользователя

- **Метод:** `POST`
- **URL:** `http://localhost:4000/api/auth/register`
- **Тело запроса (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "123456",
    "avatar": "http://example.com/avatar.png"
  }
  ```
  Поле `avatar` опционально.

- **Результат:** Возвращает созданного пользователя и JWT-токен:
  ```json
  {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "avatar": "http://example.com/avatar.png",
      "createdAt": "2024-01-01T12:00:00.000Z"
    },
    "token": "eyJhbGciOi..."
  }
  ```

**Пример в Postman:**  
- Метод: POST  
- URL: `http://localhost:4000/api/auth/register`  
- Headers: `Content-Type: application/json`  
- Body (raw JSON):
  ```json
  {
    "email": "user@example.com",
    "password": "123456"
  }
  ```


#### Авторизация (логин)

- **Метод:** `POST`
- **URL:** `http://localhost:4000/api/auth/login`
- **Тело запроса (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "123456"
  }
  ```

- **Результат:** Возвращает данные пользователя и JWT-токен:
  ```json
  {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "avatar": null,
      "createdAt": "2024-01-01T12:00:00.000Z"
    },
    "token": "eyJhbGciOi..."
  }
  ```

**Пример в Postman:**  
- Метод: POST  
- URL: `http://localhost:4000/api/auth/login`  
- Headers: `Content-Type: application/json`  
- Body (raw JSON):
  ```json
  {
    "email": "user@example.com",
    "password": "123456"
  }
  ```

#### Получение информации о текущем пользователе

- **Метод:** `GET`
- **URL:** `http://localhost:4000/api/auth/me`
- **Заголовок:** `Authorization: Bearer <ваш_токен>`

- **Результат:**
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "avatar": null,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
  ```

**Пример в Postman:**  
- Метод: GET  
- URL: `http://localhost:4000/api/auth/me`  
- Headers:
  - `Authorization: Bearer eyJhbGciOi...`
  

---

### Категории (Categories)

#### Список категорий

- **Метод:** `GET`
- **URL:** `http://localhost:4000/api/categories`
- **Результат:**
  ```json
  [
    { "id": 1, "name": "Функциональность" },
    { "id": 2, "name": "Баг" },
    { "id": 3, "name": "UI" },
    { "id": 4, "name": "Производительность" }
  ]
  ```

**Пример в Postman:**  
- Метод: GET  
- URL: `http://localhost:4000/api/categories`  

---

### Статусы (Statuses)

#### Список статусов

- **Метод:** `GET`
- **URL:** `http://localhost:4000/api/statuses`
- **Результат:**
  ```json
  [
    { "id": 1, "name": "Идея" },
    { "id": 2, "name": "Запланировано" },
    { "id": 3, "name": "В работе" },
    { "id": 4, "name": "Выполнено" }
  ]
  ```

**Пример:**  
- Метод: GET  
- URL: `http://localhost:4000/api/statuses`  

---

### Предложения (Feedback)

#### Создать предложение

- **Метод:** `POST`
- **URL:** `http://localhost:4000/api/feedback`
- **Заголовок:** `Authorization: Bearer <ваш_токен>`
- **Тело (JSON):**
  ```json
  {
    "title": "Добавить тёмную тему",
    "description": "Было бы здорово иметь тёмный режим интерфейса.",
    "categoryId": 1,
    "statusId": 1
  }
  ```

- **Результат:**
  ```json
  {
    "id": 1,
    "title": "Добавить тёмную тему",
    "description": "Было бы здорово иметь тёмный режим интерфейса.",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z",
    "categoryId": 1,
    "statusId": 1,
    "authorId": 1
  }
  ```

**Пример:**  
- Метод: POST  
- URL: `http://localhost:4000/api/feedback`  
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <ваш_токен>`
- Body (raw JSON):
  ```json
  {
    "title": "Добавить тёмную тему",
    "description": "Было бы здорово иметь тёмный режим интерфейса.",
    "categoryId": 1,
    "statusId": 1
  }
  ```

#### Получить список предложений

- **Метод:** `GET`
- **URL:** `http://localhost:4000/api/feedback`
- **Параметры:**
  - `category` (string) – фильтр по названию категории
  - `status` (string) – фильтр по названию статуса
  - `sort` (string) – `upvotes` для сортировки по количеству голосов, `date` для сортировки по дате
  - `page` (number) – номер страницы (по умолчанию 1)
  - `limit` (number) – количество результатов на страницу (по умолчанию 10)

**Пример:**  
`GET http://localhost:4000/api/feedback?category=Функциональность&sort=upvotes&page=1&limit=5`

- **Результат:**
  ```json
  {
    "data": [
      {
        "id": 1,
        "title": "Добавить тёмную тему",
        "description": "Было бы здорово иметь тёмный режим интерфейса.",
        "createdAt": "2024-01-01T12:00:00.000Z",
        "updatedAt": "2024-01-01T12:00:00.000Z",
        "categoryId": 1,
        "statusId": 1,
        "authorId": 1,
        "category": { "id": 1, "name": "Функциональность" },
        "status": { "id": 1, "name": "Идея" },
        "_count": { "upvotes": 0 }
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 5,
      "totalPages": 1
    }
  }
  ```

#### Получить предложение по ID

- **Метод:** `GET`
- **URL:** `http://localhost:4000/api/feedback/:id`

**Пример:**  
`GET http://localhost:4000/api/feedback/1`

- **Результат:**
  ```json
  {
    "id": 1,
    "title": "Добавить тёмную тему",
    "description": "Было бы здорово иметь тёмный режим интерфейса.",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z",
    "categoryId": 1,
    "statusId": 1,
    "authorId": 1,
    "category": { "id": 1, "name": "Функциональность" },
    "status": { "id": 1, "name": "Идея" },
    "_count": { "upvotes": 0 }
  }
  ```

#### Обновить предложение

- **Метод:** `PUT`
- **URL:** `http://localhost:4000/api/feedback/:id`
- **Заголовок:** `Authorization: Bearer <ваш_токен>` (должен быть автором предложения)
- **Тело (JSON) - только изменяемые поля:**
  ```json
  {
    "title": "Обновлённый заголовок"
  }
  ```

**Пример:**  
`PUT http://localhost:4000/api/feedback/1`  
Body:
```json
{
  "title": "Обновлённая идея тёмной темы"
}
```

#### Удалить предложение

- **Метод:** `DELETE`
- **URL:** `http://localhost:4000/api/feedback/:id`
- **Заголовок:** `Authorization: Bearer <ваш_токен>` (должен быть автором предложения)

**Пример:**  
`DELETE http://localhost:4000/api/feedback/1`

- **Результат:**
  ```json
  {
    "message": "Предложение удалено"
  }
  ```

---

### Голосование (Upvote)

#### Проголосовать или убрать голос за предложение

- **Метод:** `POST`
- **URL:** `http://localhost:4000/api/feedback/:id/upvote`
- **Заголовок:** `Authorization: Bearer <ваш_токен>`

---
