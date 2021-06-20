# virtual-classroom

#### System Requirements (Dev):

* Docker (v18+)
* Docker Compose (1.22+)
* A real Development computer (Running Linux or Mac)
#### Config Files

Configurations are in the `.env.copy` file. Need to create `.env` file from `.env.copy`.
##### Command list: 
Use `npm i` to install all packages

##### Run Project
Use `docker-compose up --build` build and run the project locally with port `5000`. After running the project a super admin will create.

# APIs
### Login
`url`: `POST /login`

#### Request
```json
{
    "email": "fazlerabby07@gmail.com",
    "password": "teacher1"
}
```

### SuperAdmin and Teacher registration  (Need to pass super admin login token)
`url`: `POST /api/v1/pvt/admin-teacher-registration`

#### Header
```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGNmNmUyMjYxMmIxNzAwMTM1ZDNkNzMiLCJlbWFpbCI6InN1cGVyYWRtaW5AZ21haWwuY29tIiwicm9sZSI6InN1cGVyQWRtaW4iLCJ0dGwiOjE4MDAwMDAsImlhdCI6MTYyNDIwNjk1OSwiZXhwIjoxNjI0MjkzMzU5fQ.nZlyWyInJO5BPS3rfhib1CLAdrAlInFkqxTefmcvnV8"
}
```
#### Request
```json
{
    "fullName": "Teacher1",
    "email": "teacher1@gmail.com",
    "role": "teacher",
    "password": "teacher1"
}
```

### Create Classroom  (Need to pass teacher login token)
`url`: `POST /api/v1/pvt/classrooms`

#### Header
```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGNmNmUyMjYxMmIxNzAwMTM1ZDNkNzMiLCJlbWFpbCI6InN1cGVyYWRtaW5AZ21haWwuY29tIiwicm9sZSI6InN1cGVyQWRtaW4iLCJ0dGwiOjE4MDAwMDAsImlhdCI6MTYyNDIwNjk1OSwiZXhwIjoxNjI0MjkzMzU5fQ.nZlyWyInJO5BPS3rfhib1CLAdrAlInFkqxTefmcvnV8"
}
```
#### Request
```json
{
    "title": "English",
    "teacherId": "60cf6e8b612b1700135d3d77"
}
```


### Student Registration
`url`: `POST /student-registration

#### Request
```json
{
    "fullName": "student2",
    "email": "hussain.rabby@sharetrip.net",
    "role": "student",
    "password": "123456",
    "invitationCode": "r2g5w59e",
    "schoolId": "S-002"
}
```

### create assignment  (Need to pass teacher login token)
`url`: `POST /api/v1/pvt/assignments`

#### Header
```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGNmMGJkYjQ3NDUyMTAwMTM0ZGRjYzgiLCJlbWFpbCI6ImZhemxlcmFiYnkwN0BnbWFpbC5jb20iLCJyb2xlIjoidGVhY2hlciIsInR0bCI6MTgwMDAwMCwiaWF0IjoxNjI0MTgxOTAyLCJleHAiOjE2MjQyNjgzMDJ9.lw_bx0oEJ_yLW1rgXlbIVRs1ZKkI4yXaYHnozj8HoVA"
}
```
#### Request
`It will be a form-data`
```json
{
    "classroomId": "60cf6f16612b1700135d3d7c",
    "title": "English assignment1",
    "teacherId": "60cf6e8b612b1700135d3d77",
    "startDate": "2021-06-21T01:20:00",
    "lastDateOfsubmition": "2021-06-21",
    "assignment": "file link"
}
```

### submit student assignmnet (Need to pass student login token)
`url`: `PUT /api/v1/pvt/assignments/:assignmentId/student-assignment`

#### Header
```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGNmMGQ3NjQ3NDUyMTAwMTM0ZGRjY2YiLCJlbWFpbCI6ImZhemxlLmhhbmR5bWFtYUBnbWFpbC5jb20iLCJyb2xlIjoic3R1ZGVudCIsInR0bCI6MTgwMDAwMCwiaWF0IjoxNjI0MTg3NzE0LCJleHAiOjE2MjQyNzQxMTR9.tGq9y6Sq7biZx3ENAxGEZzzYDQcx-qWGGEgML2yhDuQ"
}
```
#### Request
`It will be a form-data`
```json
{
    "assignment": "file link"
}
```

### upload assignment result by teacher  (Need to pass teacher login token)
`url`: `PUT /api/v1/pvt/assignments/:assignmentId/assignment-result

#### Header
```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGNmMTNhZDdiOGM4MTAwZDU2ZGI0OGYiLCJlbWFpbCI6Imh1c3NhaW4ucmFiYnlAc2hhcmV0cmlwLm5ldCIsInJvbGUiOiJ0ZWFjaGVyIiwidHRsIjoxODAwMDAwLCJpYXQiOjE2MjQxODc5NzcsImV4cCI6MTYyNDI3NDM3N30.RDddBoMh7_l3Y6Lf6DyPMDXiZxqwRg3Bus5CJzlGx24"
}
```
#### Request

```json
{
    "studentId": "60cf0d7647452100134ddccf",
    "marks": 80
}
```


### upload assignment result by teacher 
`url`: `GET/api/v1/pvt/assignments/:assignmentId/student-result

#### Header (Need to pass student login token)
```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGNmMGQ3NjQ3NDUyMTAwMTM0ZGRjY2YiLCJlbWFpbCI6ImZhemxlLmhhbmR5bWFtYUBnbWFpbC5jb20iLCJyb2xlIjoic3R1ZGVudCIsInR0bCI6MTgwMDAwMCwiaWF0IjoxNjI0MTg4NjU0LCJleHAiOjE2MjQyNzUwNTR9.-DofoKfrg9-uGJWv-eqnndhapt3Jf7DmlnDs2cQw5b8"
}
```



