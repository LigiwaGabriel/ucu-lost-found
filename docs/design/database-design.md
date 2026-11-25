# Database design  (Milestone 1d)  Owner: Member 2
Project: UCU Lost and Found
Milestone: 1d – Database Design
Owner: Member 2

## ERD (add image: docs/design/erd.png)
The Entity Relationship Diagram (ERD) provides a visual representation of the database structure for the UCU Lost and Found website.

It is intended to illustrate the entities involved in the system, their attributes, primary keys, foreign keys, and the relationships between different entities.

The ERD will be included in the project documentation at:

docs/design/erd.png

The diagram should correspond to the actual database schema implemented in schema.sql.


## Tables, keys and relationships

The database schema is documented in the project's schema.sql file.

The database design should identify the tables required to support the Lost and Found system.

For each table, the documentation should specify:

Table name and purpose.

Columns and their data types.

Primary keys used to uniquely identify records.

Foreign keys used to connect related records.

Relationships between tables.

The final list of tables and their relationships will be documented after reviewing the actual SQL schema.


## Where private data lives and how it is protected
The system may handle information submitted by users when reporting lost or found belongings.

Database design should consider the protection of private information, including:

Restricting access to sensitive user information.

Avoiding unnecessary storage of personal information.

Applying appropriate access controls.

Protecting authentication credentials where authentication is implemented.

Ensuring that users can only access information permitted by their roles.

The actual security mechanisms should be documented according to the implementation in the project.
## Normalisation / design decisions

Database normalisation is an important consideration when designing a structured database.

The design should aim to reduce unnecessary duplication of information, maintain data consistency, and establish appropriate relationships between records.

The following considerations will guide the database design:

Each table should represent a clearly defined entity or purpose.

Each record should have an appropriate primary key.

Related records should be connected using foreign keys where appropriate.

Repeated information should be organised to reduce unnecessary duplication.

Appropriate data types and constraints should be used to maintain data integrity.

The final normalisation decisions will be explained with reference to the actual tables and relationships in schema.sql.