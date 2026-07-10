CREATE TABLE users (

    user_id INT AUTO_INCREMENT PRIMARY KEY,

    cognito_sub VARCHAR(100) NOT NULL UNIQUE,

    username VARCHAR(100),

    email VARCHAR(255) NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE recipes (

    recipe_id INT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    description TEXT,

    ingredients JSON,

    ingredients_raw JSON,

    steps JSON,

    servings FLOAT,

    serving_size VARCHAR(100),

    tags JSON,

    ingredient_count INT,

    ingredient_raw_count INT,

    step_count INT,

    tag_count INT,

    has_ingredients BOOLEAN,

    has_ingredients_raw BOOLEAN,

    has_steps BOOLEAN,

    has_tags BOOLEAN

);

CREATE TABLE nutrition (

    fdc_id BIGINT PRIMARY KEY,

    food_name VARCHAR(255) NOT NULL,

    data_type VARCHAR(100),

    calories FLOAT

);

CREATE TABLE favorites (

    user_id INT NOT NULL,

    recipe_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(user_id, recipe_id),

    FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY(recipe_id)
        REFERENCES recipes(recipe_id)
        ON DELETE CASCADE

);

CREATE TABLE search_history (

    history_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    keyword VARCHAR(255),

    total_result INT,

    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE

);

CREATE TABLE chat_history (

    chat_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    role ENUM('user','assistant') NOT NULL,

    message LONGTEXT,

    recipe_id INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY(recipe_id)
        REFERENCES recipes(recipe_id)
        ON DELETE SET NULL

);

CREATE TABLE ingredient_mapping (
    ingredient_name VARCHAR(255) PRIMARY KEY,
    fdc_id BIGINT NOT NULL,
    confidence FLOAT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (fdc_id)
        REFERENCES nutrition(fdc_id)
        ON DELETE CASCADE
);

-- Checking Database
SELECT COUNT(*) AS total_recipes
FROM recipes;

SELECT COUNT(*) AS total_nutrition
FROM nutrition;

SELECT *
FROM recipes
LIMIT 10;

SELECT *
FROM recipes
ORDER BY RAND()
LIMIT 10;

SELECT
    recipe_id,
    JSON_LENGTH(ingredients) AS ingredient_count
FROM recipes
LIMIT 10;

SELECT *
FROM nutrition
LIMIT 10;

SELECT *
FROM nutrition
ORDER BY RAND()
LIMIT 10;


SELECT
    recipe_id,
    name,
    JSON_LENGTH(ingredients) AS ingredient_num,
    JSON_LENGTH(steps) AS step_num
FROM recipes
LIMIT 10;
