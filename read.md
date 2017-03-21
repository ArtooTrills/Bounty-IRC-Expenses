# LIST OF APIs

Base URL :`http://localhost:3003/message`

### Command:add user "username"

`POST: /add user username` (to add user)

	Response codes:

		1. 200 - User is added.

		2. 400 - Oops you missed something.


### Command: delete user "username" (to delete user)
`POST: /delete user username`

	Response codes:

		1. 200 - User is deleted.

		2. 400 - Oops you missed something.


### Command: user paid 600 for dinner (to add expenses)
`POST: /user paid 600 for dinner

	Response codes:

		1. 200 - Transaction recorded.

		2. 400 - Oops you missed something.

### Command: paid 600 for dinner (to add expenses)
`POST: /paid 600 for dinner

	Response codes:

		1. 200 - Transaction recorded.

		2. 400 - Oops you missed something.