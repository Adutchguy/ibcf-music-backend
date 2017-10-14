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
* The response body will contain a token.
* The response Header will set a browser cookie called `X-IBCF-Token` which may be used for authentication. The Cookie is set to expire after 1 week by default. I will likely change this to a session cookie in the future.
---
> ### GET `/api/userLogin`

**Description:**

* This endpoint enables users to login and set the correct browser cookie for authentication.

**Required Values:**

* The following values must be provided via basic authentication in order to receive a session token.

|Key|Value|Required|
|---|-----|--------|
|'username'|`String`| yes|
|'password'|`String`|yes|

**Response:**
* The response body will contain a *token*.
* The response header will set a browser *session* cookie called `X-IBCF-Token` which may be used for authentication.

---
> ### PUT `/api/userUpdate`

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
* The response body will contain a token.
* The response Header will set a browser cookie called `X-IBCF-Token` which may be used for authentication. The Cookie is set to expire after 1 week by default. I will likely change this to a session cookie in the future.
### Create Account/Sign-in
Users will have the option to create a new account or sign-in on the initial page. Account creations requires a valid e-mail, a username, and a password. Sign-in requires username and password.

###  Create available entry
To create an available entry, the user enters a start and end date and time. There is also an option to mark the available entry as "all day" The name of the available entry is entered into the text box, and the available entry type is selected from the drop down menu (options are Appointment, Court Date, Deadline, Task). When the add available entry button is clicked, the available entry will populate to the calendar view.

### Update available entry
To update an available entry, the user clicks on the available entry in the calendar view and makes the necessary changes in the available fields. The available entry is updated when the update available entry button is clicked.

### Delete available entry
To delete an available entry, the user clicks on the available entry in the calendar view and then clicks on the delete available entry button.
=======
# ibcf-music-backend
