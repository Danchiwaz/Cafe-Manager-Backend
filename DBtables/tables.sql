CREATE TABLE user(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    contactNumber VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL,
    UNIQUE (email)
);

INSERT INTO user (
    name,
    contactNumber,
    email,
    password,
    status,
    role
) VALUES(
    'Admin',
    '123456789',
    'mainadanielwachira@gmail.com',
    'admin1234',
    'true',
    'admin'
);