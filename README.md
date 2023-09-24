# Finova

Finova represent finance and innovation which signifies a forward-thinking and innovative platform for financial management within a corporate or enterprise context

[![npm version](https://badge.fury.io/js/express.svg)](https://badge.fury.io/js/express)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#features-implemented)
- [Working Routes](#working-routes)
- [Improvements](#improvements)
- [License](#license)


# Introduction

This API serves as the foundation for a straightforward business financing application, following RESTful principles.


### Project Structure

```bash
├── src
├── .env.sample
├── .eslintrc
├── .gitignore
├── .prettierrc
├── jest.config
├── Makefile
├── package.json
├── README.md
└── tsconfig.json
```

### Project Database Architecture

BaseModel
- id
- createdAt
- updatedAt
- createdBy
- updatedBy
- deletedAt
- deletedBy

Account Entity Extends BaseModel
- accountNumber
- balance
- currency
- cards (One to Many relationship)
- company (Many to One relationship)
- transactions (One to Many relationship)


Card Entity Extends BaseModel
- cardNumber
- cardType [visa | master]
- pin
- cvv
- expiryDate
- status [activated | pending | deactivated | expired]
- remainingSpend
- spendingLimit
- spendingLimitInterval  [ daily | weekly | monthly ]
- spendingLimitDate
- account (Many to One relationship)
- company (Many to One relationship)
- transactions (One to Many relationship)


Company Entity Extends BaseModel
- companyName
- companyAddress
- yearFounded
- status
- accounts (One to Many relationship)
- cards (One to Many relationship)


Transaction Entity Extends BaseModel
- amount
- message
- status [ credit | debit ]
- type [debit | credit ]
- card (Many to One relationship)
- account (Many to One relationship)



### Entity Relationship Diagram(ER)

- ER diagram of the project is available on ![ER-Digram-Finova](https://github.com/AbonyiXavier/Backend-Recruitment/assets/49367987/cda0b2e8-fa9e-40bd-9580-35b609180ba2)


### Features Implemented

<<<< Company Functionality >>>>
- Signup
- Login
- Change of password
- Get company
- Get companies(paginated and search)
- Update company's information
- Deactivate company

<<<< Account Functionality >>>> 
- Create account for company (company add more accounts by company)
- Get account(search by card number)
    
<<<< Card Functionality >>>>
- Create card for company (Company can add more cards)
- Get card
- Activate card
- Update card pin
- Get pending cards
- Get activated cards
- Set spending limit on card

<<<< Transaction Functionality >>>>
- Fetch all transactions
- Transfer funds from their account to another company's account

<<<< Cro job functions >>>>
- Expire card when due
- Reset spend limit and remaining spend when due

# Getting Started

### Dependencies

This project uses [Express.js](https://expressjs.com/) v4.18.2 It has the following dependencies:

- [Node.js `>=` 12.18.3](https://nodejs.org/en/download)
[Postgres Database](https://www.postgresql.org/)
- [Typeorm](https://typeorm.io/)
- ESLint & Prettier

#### _Prerequisites_

- Ensure you have **NodeJS** installed by entering `node -v` on your terminal
  If you don't have **NodeJS** installed, go to the [NodeJS Website](http://nodejs.org), and follow the download instructions

### Getting the Source

### Installation & Usage

- After cloning the repository, create a `.env` file from `.env.sample` and set your local `.env.` variable(s).

```sh
cp .env.sample .env
```

### Using the Makefile for Testing
How to run all tests locally

1. `make install` - Installs dependencies.
2. `make dev` - Run the server
3. `make ts-build` - Run build to generate dist folder
4. `make lint` - Lint code

# Working Routes

## _API Endpoints_

- Public API documentation of this project is available on [Postman Docs](https://documenter.getpostman.com/view/7775892/2s9Xy5MAqs)


| Endpoint                       |           Functionality            | HTTP method |
| ------------------------------ | :--------------------------------: | ----------: |
| /api/v1/signup        | Signup a company |        POST |
| /api/v1/login        | login  |        POST |
| /api/v1/company/changepassword        | Change of password |        PATCH |
| /api/v1/company                |          Get companies           |         GET |
| /api/v1/company/:companyId            |        Get company        |         GET |
| /api/v1/company/:companyId    |     Update company information     |       PATCH |
| /api/v1/company/deactivate/:companyId  |         Deactivate company         |      PATCH |
| /api/v1/card/create            |           Create card             |        POST |
| /api/v1/card/setlimit/:cardId      |     Set spending limit on card     |        PATCH |
| /api/v1/card/:cardId      |           Activate card            |       PATCH |
| /api/v1/card/:cardId               |         Get card          |         GET |
| /api/v1/card/pin/:cardId           |          Update card pin           |       PATCH |
| /api/v1/card/activated/:companyId           |          Get activated cards           |       GET |
| /api/v1/card/pending/:companyId         |          Get pending cards           |       GET |
| /api/v1/account/:accountId            |        Get account        |         GET |
| /api/v1/account/create            |        create account        |         POST |
| /api/v1/transaction/transfer/:accountId        | Transfer funds  |        POST |
| /api/v1/transaction            |       Fetch all transactions       |         GET |



### HTTP Response Codes

Each response will be returned with one of the following HTTP status codes:

- `200` `OK` The request was successful
- `201` `New Resource` The request was successful and created a new resource
- `400` `Bad Request` There was a problem with the request (security, malformed)
- `404` `Not Found` An attempt was made to access a resource that does not exist in the API
- `500` `Server Error` An error on the server occurred

# Improvements

- Introduce a Reward System: Implement a rewards program where users can earn redeemable points based on their card usage frequency

- Notification for Expiring Cards: Set up a notification system to proactively remind users of their card's upcoming expiration. Notifications can be sent via push notifications or email alerts

- Enable Account Funding Options: Provide users with the ability to fund their accounts through convenient methods.

- Diversify Account Categories: Introduce versatility in account classifications with distinct types to accommodating both private and savings accounts.
    
# License :boom:

This project is under the MIT LICENSE