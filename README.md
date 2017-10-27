# **IBCF MUSIC API** [![Build Status](https://travis-ci.org/Adutchguy/ibcf-music-backend.svg?branch=master)](https://travis-ci.org/Adutchguy/ibcf-music-backend)

# Application Summary

'IBCF Music API' serves as the back-end for the IBCF-Music web application. This API allows users to sign-up, login, and list availability.

# Run examples locally

1. Clone the repository.
2. Install dependencies: `yarn install` || `npm install`
3. Start database: `yarn start-db` || `npm start-db`
4. Start server: `yarn start` || `npm start`

# API Endpoints

## *USER*


> ### POST `/api/userSignup`

**Description:**

* This endpoint enables new users to sign-up in order to begin adding availability entries.

**Required Values:**

* The body of the request must contain the following
JSON formatted data.
* Note that the password field should be sent AES encrypted using, in this case, the [crypto-js](https://github.com/brix/crypto-js) library.

|Key|Value|Required|
|---|-----|--------|
|'username'|`String`| yes|
|'password'|`String`|yes|
|'firstName'|`String`|no|
|lastName|`String`| no|
|'email'|`String`|yes|

**Response:**
* The response body will contain a **token**.
* The response Header will set a browser **session** cookie called `X-IBCF-Token` which may be used for authentication.
---
> ### GET `/api/userLogin`

**Description:**

* This endpoint enables users to login and set the correct browser session cookie for authentication.

**Required Values:**

* The following values must be provided via basic authentication in order to receive a browser session cookie.
* Note that the password field should be sent AES encrypted using, in this case, the [crypto-js](https://github.com/brix/crypto-js) library.

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
* The response body will contain the users JSON formatted data.

---
> ### GET `/api/userFullName`

**Description:**

* This endpoint enables queries for a users full name via a virtual getter.

**Response:**
* The response body will contain only the users full name.

---
> ### PUT `/api/userUpdate`

**Description:**

* This endpoint enables users to update their existing user profiles.

**Required Values:**

* The body of the request may contain any of the following
JSON formatted data.

|Key|Value|Required|
|---|-----|--------|
|'username'|`String`| no|
|'password'|`String`|no|
|'firstName'|`String`|no|
|lastName|`String`| no|
|'email'|`String`|no|

**Response:**
* The response body will contain the newly updated user profile.

---
> ### DELETE `/api/userDelete`

**Description:**

* This endpoint simply enables logged-in users to delete their profile.
* You will likely want to consider clearing the browser session cookie after the user deletes their profile in order to log them out.

---

## *AVAILABILITY*

> ### POST `/api/availability/createOne`

**Description:**

* This endpoint enables new users to create an available entry.

**Required Values:**

* The body of the request must contain the following
JSON formatted data.

|Key|Value|Required|
|---|-----|--------|
|'date'|`ISO Date`| yes|
|'comment'|`String`|yes|

**Response:**
* The response body will contain the new availability entry. consisting of the following JSON formatted data:

|Key|Value|
|---|-----|
|'fullname'|`String`|
|'firstName'|`String`|
|'lastName'|`String`|
|'comment'|`String`|
|_id|`String`|
|'email'|`String`|
|'ownerId'|`String`|
|'timeStamp'|`ISO Date String`|
|'date'|`Array of ISO Date Strings`|
---

> ### GET `/api/availability`

**Description:**

* This endpoint enables users to get all availability entries in the database.

**Response:**
* The response body will contain an array of objects with each object containing the following JSON formatted data:

|Key|Value|
|---|-----|
|'fullname'|`String`|
|'firstName'|`String`|
|'lastName'|`String`|
|'comment'|`String`|
|_id|`String`|
|'email'|`String`|
|'ownerId'|`String`|
|'timeStamp'|`ISO Date String`|
|'date'|`Array of ISO Date Strings`|
---

> ### PUT `/api/availability/updateOne/:id`

**Example**
> `/api/availability/updateOne/59e65efd04521b2dd46fcb1a`

**Description:**

* This endpoint enables users to update single availability entries that they created.

**Required Values:**

* The :id is the \_id of the availability object to be updated.
* The body of the request may contain the following
JSON formatted data.

|Key|Value|Required|
|---|-----|--------|
|'date'|`ISO Date`| yes|
|'comment'|`String`|yes|

**Response:**
* The response body will contain the new availability entry. consisting of the following JSON formatted data:

|Key|Value|
|---|-----|
|'fullname'|`String`|
|'firstName'|`String`|
|'lastName'|`String`|
|'comment'|`String`|
|_id|`String`|
|'email'|`String`|
|'ownerId'|`String`|
|'timeStamp'|`ISO Date String`|
|'date'|`Array of ISO Date Strings`|
---

> ### DELETE `/api/availability/deleteOne/:id`

**Example**
> `/api/availability/deleteOne/59e65efd04521b2dd46fcb1a`

**Description:**

* This endpoint enables users to delete single availability entries that they created.

---
