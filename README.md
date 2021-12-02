# HOUSE OF GAMES API

---

- http://nc-bg-reviews.herokuapp.com/api/

---

#### **This project is an API for accessing a PSQL database of boardgame reviews**

The link at the top of the repo redirects to a list of all endpoints currently contained in the API. Please follow this more information about what is contained

---

### _**Requirements**_

To run this project you need to use at least:

- `Node.js - 17.1.0`
- `Postgres - 8.7.1`

---

## _Local Use_

#### **Cloning**

To clone the repo:

- Select the green Code button the top right
- Copy the HTTPS address
- In the terminal enter `git clone [COPY-REPO-URL-HERE]`

#### **Dependencies**

To get the required modules run `npm install -D` inside the directory. This should install the modules required for testing

#### **Seed Local Database**

To use locally the database must be seeded:

- Create two files `env.development` and `.env.test`
- Add a single line to each file, using the `setup.sql` to refer to the correct database `PGDATABASE=[insert_relevant)database_name]`
- In the console `npm run setup-dbs`

#### **Testing**

The API can now be tested locally with jest using the console command `npm t`
