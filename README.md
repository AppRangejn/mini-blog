# MINI BLOG

Міні-блог із публічною стрічкою постів та адмін-панеллю.

## Технології

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS, Yup
- **Backend:** Express, TypeScript, JWT, bcrypt
- **База даних:** PostgreSQL, Sequelize

## Структура проєкту

```text
backend/                 Express API та PostgreSQL
  src/controllers/       Controllers
  src/database/models/   Моделі Sequelize
  src/middlewares/       Auth, admin, validation, error handlers
  src/routes/            Маршрути API
  src/seeders/           Початкові дані
  __tests__/             Vitest-тести

frontend/                Next.js-додаток
  src/app/               Сторінки App Router
  src/components/        UI-компоненти
  src/context/           Авторизація
  src/lib/               API-клієнт
```

## Вимоги

- Node.js 20 або новішої версії
- npm
- PostgreSQL 13 або новішої версії

Перевірити встановлені версії:

```bash
node --version
npm --version
psql --version
```

## 1. Створення бази даних

Створіть порожню PostgreSQL-базу з назвою `mini_blog`:

```bash
createdb mini_blog
```

Або виконайте у `psql`:

```sql
CREATE DATABASE mini_blog;
```

Якщо база або користувач мають інші назви, змініть відповідні змінні у
`backend/.env`.

## 2. Налаштування backend

Перейдіть у папку backend і встановіть залежності:

```bash
cd backend
npm install
```

Створіть локальний файл налаштувань:

```bash
cp .env.example .env
```

Обов’язково замініть у `backend/.env` значення під своє локальне середовище:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=mini_blog
DB_USER=postgres
DB_PASSWORD=ваш_пароль_postgresql
DB_SYNC_ALTER=true

JWT_SECRET=довгий_випадковий_секрет
CORS_ORIGIN=http://localhost:3000

SEED_FORCE_UPDATE=false
```

Пояснення змінних:

| Змінна | Призначення |
|---|---|
| `DB_*` | Параметри підключення до локальної PostgreSQL-бази |
| `DATABASE_URL` | Альтернатива для хмарної PostgreSQL; для локального запуску зазвичай не потрібна |
| `JWT_SECRET` | Секрет підпису JWT-токенів. Має бути довгим і випадковим |
| `CORS_ORIGIN` | Адреса, з якої браузер може звертатись до API |
| `DB_SYNC_ALTER` | Дозволяє Sequelize синхронізувати структуру БД у development |
| `SEED_FORCE_UPDATE` | Якщо `true`, seeder перезаписує пароль і дані seeded-користувачів |

Для генерації JWT-секрету в Linux/macOS можна виконати:

```bash
openssl rand -base64 32
```

Для хмарної PostgreSQL замість набору `DB_*` можна використовувати
`DATABASE_URL`. У цьому випадку SSL-параметри налаштовуються через
`DB_SSL` і `DB_SSL_REJECT_UNAUTHORIZED`.

## 3. Запуск backend

Запустіть backend у режимі development:

```bash
cd backend
npm run dev
```

Backend доступний за адресою:

```text
http://localhost:5000
```

API знаходиться під префіксом:

```text
http://localhost:5000/api
```

Перевірка доступності:

```bash
curl http://localhost:5000/api/posts
```

## 4. Додавання початкових даних

Seeder створює адміністратора та приклади постів. Його можна запустити окремим
терміналом, доки backend запущений або зупинений:

```bash
cd backend
npm run seed
```

За замовчуванням `SEED_FORCE_UPDATE=false`, тому повторний запуск seeder не
замінює пароль і дані вже наявного адміністратора. Для оновлення seeded-даних
тимчасово встановіть:

```env
SEED_FORCE_UPDATE=true
```

Після цього запустіть seeder ще раз і поверніть параметр назад у `false`.

## 5. Налаштування frontend

У другому терміналі перейдіть у frontend і встановіть залежності:

```bash
cd frontend
npm install
cp .env.example .env.local
```

`frontend/.env.local` має містити адресу backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```


Запустіть frontend:

```bash
npm run dev
```

Сайт доступний за адресою:

```text
http://localhost:3000
```

Після зміни файлів `.env` або `.env.local` необхідно перезапустити відповідний
dev-сервер.

## 6. Швидкий запуск із двох терміналів

Термінал 1:

```bash
cd backend
npm install
npm run dev
```

Термінал 2:

```bash
cd frontend
npm install
npm run dev
```

За потреби один раз заповніть базу даними:

```bash
cd backend
npm run seed
```

## Ролі користувачів

- **User** — реєстрація, login, перегляд постів і сторінка деталей.
- **Admin** — повний CRUD постів через адмін-панель `/admin`.

Після входу frontend автоматично зберігає JWT у localStorage.

## API endpoints

Усі endpoint знаходяться під префіксом `/api`.

| Method | Route | Доступ |
|---|---|---|
| `POST` | `/auth/register` | Guest |
| `POST` | `/auth/login` | Guest |
| `GET` | `/auth/me` | User, Admin |
| `GET` | `/posts` | Guest, User, Admin |
| `GET` | `/posts/:id` | Guest, User, Admin |
| `POST` | `/posts` | Admin |
| `PUT` | `/posts/:id` | Admin |
| `DELETE` | `/posts/:id` | Admin |

Query-параметри публічного отримання постів:

- `page` — номер сторінки;
- `limit` — кількість постів на сторінці;
- `sort=oldest|newest|title` — сортування;
- `search` — пошук у назві, excerpt або content.

## Збірка і перевірка

Backend:

```bash
cd backend
npm test
npm run build
npm run start
```

Для frontend:

```bash
cd frontend
npm run lint
npm run build
npm run start
```

`npm run build` backend не запускає сервер; для запуску зібраного backend
використовується `npm run start`.

## Приклади HTTP-запитів

У папці `backend/tests/` є приклади REST-запитів для VS Code REST Client або
інших сумісних HTTP-клієнтів:

- `auth.http` — реєстрація, login і `/auth/me`;
- `posts.http` — публічні та адмінські операції з постами.
