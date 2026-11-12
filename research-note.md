# Research Note

## Source
- **Title:** DummyJSON — Users
- **URL:** https://dummyjson.com/docs/users
- **Search keywords:** DummyJSON users API, DummyJSON add user, DummyJSON delete user

## Summary
DummyJSON provides sample user records that can be requested without creating an account or using an API key. The CRM requests a limited list of users with the users endpoint. The response contains a `users` array, which the application transforms into its own client data model. The documentation also describes endpoints for adding and deleting users. These write operations are useful for practicing HTTP requests, but the demo service does not permanently store the changes. The CRM therefore keeps the current client list in browser localStorage.
