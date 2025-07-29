login

{
    "data": {
        "login": null
    },
    "errors": [
        {
            "message": "Exception while fetching data (/login) : org.postgresql.util.PSQLException: ERROR: duplicate key value violates unique constraint \"sessions_user_id_index\"\n  Detail: Key (user_id)=(2) already exists.",
            "locations": [
                {
                    "line": 4,
                    "column": 5
                }
            ],
            "path": [
                "login"
            ]
        }
    ]
}


but i want  to allow the user to be able to have more than one session, 
if the login request doesnt have the token with or  if the session for that token is still active, else a new)