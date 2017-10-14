# IBCF MUSIC API

## Application Summary

'IBCF Music API' serves as the back-end for the IBCF-Music web application. This API allows users to sign-up, login, and list availability.

## Run examples locally

1. Clone the repository.
2. Install dependencies: `yarn install` || `npm install`
3. Start database: `yarn start-db` || `npm start-db`
4. Start server: `yarn start` || `npm start`

## API Endpoints

> ### POST `/api/userSignup`

**Description:**

* This endpoint enables new users to sign-up in order to begin adding availability entries.

**Required Values:**

* The body of the request must contain the following
json formatted data.

|Key|Value|Required|
|---|-----|--------|
|'username'|`String`| yes|
|'password'|`String`|yes|
|'firstName'|`String`|no|
|lastName|`String`| no|
|'email'|`String`|yes|
|'isAdmin'|`Boolean`|yes|

**Response:**
* The response body will contain a **token**.
* The response Header will set a browser **session** cookie called `X-IBCF-Token` which may be used for authentication.
---
> ### GET `/api/userLogin`

**Description:**

* This endpoint enables users to login and set the correct browser session cookie for authentication.

**Required Values:**

* The following values must be provided via basic authentication in order to receive a browser session cookie.

|Key|Value|Required|
|---|-----|--------|
|'username'|`String`| yes|
|'password'|`String`|yes|

**Response:**
* The response body will contain a **token**.
* The response header will set a browser **session** cookie called `X-IBCF-Token` which may be used for authentication.

---
> ### GET `/api/user`

**Description:**

* This endpoint enables queries for a users profile once they are logged in.

**Response:**
* The response body will contain the users json formatted data.

---
> ### PUT `/api/userUpdate`

**Description:**

* This endpoint enables users to update their existing user profiles.

**Required Values:**

* The body of the request may contain any of the following
json formatted data.

|Key|Value|Required|
|---|-----|--------|
|'username'|`String`| no|
|'password'|`String`|no|
|'firstName'|`String`|no|
|lastName|`String`| no|
|'email'|`String`|no|
|'isAdmin'|`Boolean`|no|

**Response:**
* The response body will contain the newly updated user profile.

---
> ### DELETE `/api/userDelete`

**Description:**

* This endpoint simply enables logged-in users to delete their profile.
* You will likely want to consider clearing the browser session cookie after the user deletes their profile in order to log them out.

---
