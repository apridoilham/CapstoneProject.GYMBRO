# Endpoint: `/user/:email`

## Deskripsi
Mengambil data user berdasarkan email.

## HTTP Request

```
GET /user/:email
```

## Headers

| Nama            | Tipe    | Deskripsi                                 |
|-----------------|---------|-------------------------------------------|
| Content-Type    | string  | `application/json`                        |
| Authorization   | string  | `Bearer <token>`                          |

## Contoh Request

```http
GET /user/john.doe@email.com HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer <token>
```

## Output

```json
{
  "data": {
    "email": "coba2@gmail.com",
    "fullName": "Ccoba 2",
    "date": null,
    "age": 20,
    "gender": "Perempuan",
    "height": 150,
    "weight": 45,
    "BloodPressure": {
      "systolic": 130,
      "diastolic": 80
    },
    "FastingGlucose": 95
  },
  "success": true
}
```

# Endpoint: `/user`

## Deskripsi
Mengubah atau menambahkan data yang belum terinput

## HTTP Request

```
PUT /user
```

## Headers

| Nama            | Tipe    | Deskripsi                                 |
|-----------------|---------|-------------------------------------------|
| Content-Type    | string  | `application/json`                        |
| Authorization   | string  | `Bearer <token>`                          |

## Contoh Request

```http
PUT /user
Host: api.example.com
Content-Type: application/json
Authorization: Bearer <token>
```

## Payload
```
NOTE
Untuk bagian date pastikan valid date yang ada di js new Date()
```

```json
{
  "email": "coba2@gmail.com",
  "date": "2025-05-20T13:45:00.000Z",
  "age": 20,
  "gender": "Perempuan",
  "height": 150,
  "weight": 45,
  "BloodPressure": {
    "systolic": 130,
    "diastolic": 80
  },
  "FastingGlucose": 95
}
```

## Output

```json
{
  "message": "Update success",
  "success": true,
  "user": {
    "_id": "682d300247f35e941acdd17b",
    "email": "coba2@gmail.com",
    "fullName": "Ccoba 2",
    "password": "$2b$10$TfJqWPdaoBfJkD6hT.2XjOwVj/oqq7WZi90Mm.O/YL5SoRwAYp8W.",
    "isComplete": true,
    "__v": 0,
    "BloodPressure": {
      "systolic": 130,
      "diastolic": 80
    },
    "FastingGlucose": 95,
    "age": 20,
    "date": "2025-05-20T13:45:00.000Z",
    "gender": "Perempuan",
    "height": 140,
    "weight": 45
  }
}
```

# Endpoint: `/login`

## Deskripsi
Endpoint login pada umumnya

## HTTP Request

```
POST /login
```

## Headers

| Nama            | Tipe    | Deskripsi                                 |
|-----------------|---------|-------------------------------------------|
| Content-Type    | string  | `application/json`                        |

## Contoh Request

```http
POST /login
Host: api.example.com
Content-Type: application/json
```

## Payload
```json
{
  "email": "coba2@gmail.com",
  "password": "Coba 1"
}
```

## Output

```json
{
  "message": "Login successful.",
  "success": true,
  "token": "<token>",
  "data": {
    "email": "coba2@gmail.com"
  }
}
```

# Endpoint: `/register`

## Deskripsi
Endpoint Register pada umumnya

## HTTP Request

```
POST /register
```

## Headers

| Nama            | Tipe    | Deskripsi                                 |
|-----------------|---------|-------------------------------------------|
| Content-Type    | string  | `application/json`                        |

## Contoh Request

```http
POST /register
Host: api.example.com
Content-Type: application/json
```

## Payload
```json
{
  "fullName": "Coba 1",
  "email": "coba2@gmail.com",
  "password": "Coba 1",
  "confirmPassword": "Coba 1",
}
```

## Output

```json
{
  "message": "Registration successful.",
  "success": true,
}
```