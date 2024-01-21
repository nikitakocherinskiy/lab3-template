# Лабораторная работа #2

![GitHub Classroom Workflow](../../workflows/GitHub%20Classroom%20Workflow/badge.svg?branch=master)

## Microservices

### Формулировка

В рамках второй лабораторной работы _по вариантам_ требуется реализовать систему, состоящую из нескольких
взаимодействующих друг с другом сервисов.

### Требования

1. Каждый сервис имеет свое собственное хранилище, если оно ему нужно. Для учебных целей можно использовать один
   instance базы данных, но каждый сервис работает _только_ со своей логической базой. Запросы между базами _запрещены_.
2. Для межсервисного взаимодействия использовать HTTP (придерживаться RESTful). Допускается использовать и другие
   протоколы, например grpc, но это требуется согласовать с преподавателем.
3. Выделить **Gateway Service** как единую точку входа и межсервисной коммуникации . Горизонтальные запросы между
   сервисами делать _нельзя_.
4. На каждом сервисе сделать специальный endpoint `GET /manage/health`, отдающий 200 ОК, он будет использоваться для
   проверки доступности сервиса (в [Github Actions](.github/workflows/classroom.yml) в скрипте проверки готовности всех
   сервисов [wait-script.sh](scripts/wait-script.sh).
   ```shell
   "$path"/wait-for.sh -t 120 "http://localhost:$port/manage/health" -- echo "Host localhost:$port is active"
   ```
5. Код хранить на Github, для сборки использовать Github Actions.
6. Gateway Service должен запускаться на порту 8080, остальные сервисы запускать на портах 8050, 8060, 8070.
7. Каждый сервис должен быть завернут в docker.
8. В [docker-compose.yml](docker-compose.yml) прописать сборку и запуск docker контейнеров.
9. В [classroom.yml](.github/workflows/classroom.yml) дописать шаги на сборку и прогон unit-тестов.
10. Для автоматических прогонов тестов в файле [autograding.json](.github/classroom/autograding.json)
    и [classroom.yml](.github/workflows/classroom.yml) заменить `<variant>` на ваш вариант.

### Пояснения

1. Для разработки можно использовать Postgres в docker, для этого нужно запустить docker compose up -d, поднимется
   контейнер с Postgres 13, и будут созданы соответствующие вашему варианту (описанные в
   файлах [schema-$VARIANT](postgres/scripts)) базы данных и пользователь `program`:`test`.
2. Для создания базы нужно прописать в [20-create-schemas.sh](postgres/20-create-databases.sh) свой вариант задания в
3. Docker Compose позволяет выполнять сборку образа, для этого нужно прописать
   блок [`build`](https://docs.docker.com/compose/compose-file/build/).
4. Горизонтальную коммуникацию между сервисами делать нельзя.
5. Интеграционные тесты можно проверить локально, для этого нужно импортировать в Postman
   коллекцию `<variant>/postman/collection.json`) и `<variant>/postman/environment.json`.

![Services](images/services.png)

Предположим, у нас сервисы `UserService`, `OrderService`, `WarehouseService` и `Gateway`:

- На `Gateway` от пользователя `Alex` приходит запрос `Купить товар с productName: 'Lego Technic 42129`.
- `Gateway` -> `UserService` проверяем что пользователь существует и получаем `userUid` пользователя по `login: Alex`.
- `Gateway` -> `WarehouseService` получаем `itemUid` товара по `productName` и резервируем его для заказа.
- `Gateway` -> `OrderService` с `userUid` и `itemUid` и создаем заказ с `orderUid`.
- `Gateway` -> `WarehouseService` с `orderUid` и переводим товар `itemUid` из статуса `Зарезервировано` в
  статус `Заказан` и прописываем ссылку на `orderUid`.

### Прием задания

1. При получении задания у вас создается fork этого репозитория для вашего пользователя.
2. После того как все тесты успешно завершатся, в Github Classroom на Dashboard будет отмечено успешное выполнение
   тестов.

### Варианты заданий

Варианты заданий берутся исходя из формулы:
(номер в [списке группы](https://docs.google.com/spreadsheets/d/1BT5iLgERiWUPPn4gtOQk4KfHjVOTQbUS7ragAJrl6-Q)-1) % 4)+1.

1. [Flight Booking System](v1/README.md)
1. [Hotels Booking System](v2/README.md)
1. [Car Rental System](v3/README.md)
1. [Library System](v4/README.md)

## Car Rental System

Система предоставляет пользователю возможность забронировать автомобиль на выбранные даты.

### Структура Базы Данных

#### Cars Service

Сервис запускается на порту 8070.

```sql
CREATE TABLE cars
(
    id                  SERIAL PRIMARY KEY,
    car_uid             uuid UNIQUE NOT NULL,
    brand               VARCHAR(80) NOT NULL,
    model               VARCHAR(80) NOT NULL,
    registration_number VARCHAR(20) NOT NULL,
    power               INT,
    price               INT         NOT NULL,
    type                VARCHAR(20)
        CHECK (type IN ('SEDAN', 'SUV', 'MINIVAN', 'ROADSTER')),
    availability        BOOLEAN     NOT NULL
);
```

#### Rental Service

Сервис запускается на порту 8060.

```sql
CREATE TABLE rental
(
    id          SERIAL PRIMARY KEY,
    rental_uid  uuid UNIQUE              NOT NULL,
    username    VARCHAR(80)              NOT NULL,
    payment_uid uuid                     NOT NULL,
    car_uid     uuid                     NOT NULL,
    date_from   TIMESTAMP WITH TIME ZONE NOT NULL,
    date_to     TIMESTAMP WITH TIME ZONE NOT NULL,
    status      VARCHAR(20)              NOT NULL
        CHECK (status IN ('IN_PROGRESS', 'FINISHED', 'CANCELED'))
);
```

#### Payment Service

Сервис запускается на порту 8050.

```sql
CREATE TABLE payment
(
    id          SERIAL PRIMARY KEY,
    payment_uid uuid        NOT NULL,
    status      VARCHAR(20) NOT NULL
        CHECK (status IN ('PAID', 'CANCELED')),
    price       INT         NOT NULL
);
```

### Описание API

#### Получить список всех доступных для бронирования автомобилей

Если передан флаг `showAll = true`, то выводить автомобили в резерве (`availability = false`).

```http request
GET {{baseUrl}}/api/v1/cars&page={{page}}&size={{size}}
```

#### Получить информацию о всех арендах пользователя

```http request
GET {{baseUrl}}/api/v1/rental
X-User-Name: {{username}}
```

#### Информация по конкретной аренде пользователя

При запросе требуется проверить, что аренда принадлежит пользователю.

```http request
GET {{baseUrl}}/api/v1/rental/{{rentalUid}}
X-User-Name: {{username}}
```

#### Забронировать автомобиль

Пользователь вызывает метод `GET {{baseUrl}}/api/v1/cars` и выбирает нужный автомобиль и в запросе на аренду передает:

- `carUid` (UUID автомобиля) – берется из запроса `/cars`;
- `dateFrom` и `dateTo` (дата начала и конца аренды) – задается пользователем.

Система проверяет, что автомобиль с таким `carUid` существует и резервирует его (флаг `availability = false`). При
повторном вызове `GET {{baseUrl}}/api/v1/cars` этот автомобиль будет скрыт в выдаче результатов пока не будет передан
флаг `showAll = true`.

Считается количество дней аренды (`dateFrom` – `dateTo`), вычисляется общая сумма бронирования, выполняется запрос в
Payment Service и создается новая запись об оплате. В сервисе Rental Service создается запись с информацией о
бронировании.

```http request
POST {{baseUrl}}/api/v1/rental
Content-Type: application/json
X-User-Name: {{username}}

{
  "carUid": "109b42f3-198d-4c89-9276-a7520a7120ab",
  "dateFrom": "2021-10-08",
  "dateTo": "2021-10-11"
}
```

#### Завершение аренды автомобиля

- С автомобиля снимается резерв.
- В Rental Service аренда помечается завершенной (статус `FINISHED`).

```http request
POST {{baseUrl}}/api/v1/rental/{{rentalUid}}/finish
X-User-Name: {{username}}
```

#### Отмена аренды автомобиля

- С автомобиля снимается резерв.
- В Rental Service аренда помечается отмененной (статус `CANCELED`).
- В Payment Service запись об оплате помечается отмененной (статус `CANCELED`).

```http request
DELETE {{baseUrl}}/api/v1/rental/{{rentalUid}}
X-User-Name: {{username}}
```

Описание в формате [OpenAPI](%5Binst%5D%5Bv3%5D%20Car%20Rental%20System.yml).

### Данные для тестов

Создать данные для тестов:

```yaml
cars:
  – id: 1
    car_uid: "109b42f3-198d-4c89-9276-a7520a7120ab"
    brand: "Mercedes Benz"
    model: "GLA 250"
    registration_number: "ЛО777Х799"
    power: 249
    type: "SEDAN"
    price: 3500
    available: true
```
