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

CREATE TABLE ratings (
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    rating TINYINT UNSIGNED NOT NULL,

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (
        user_id,
        recipe_id
    ),

    CONSTRAINT chk_ratings_value
        CHECK (
            rating BETWEEN 1 AND 5
        ),

    CONSTRAINT fk_ratings_user
        FOREIGN KEY (
            user_id
        )
        REFERENCES users (
            user_id
        )
        ON DELETE CASCADE,

    CONSTRAINT fk_ratings_recipe
        FOREIGN KEY (
            recipe_id
        )
        REFERENCES recipes (
            recipe_id
        )
        ON DELETE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE comments (
    comment_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    content TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (
        comment_id
    ),

    CONSTRAINT chk_comments_content_length
        CHECK (
            CHAR_LENGTH(TRIM(content))
            BETWEEN 1 AND 2000
        ),

    CONSTRAINT fk_comments_user
        FOREIGN KEY (
            user_id
        )
        REFERENCES users (
            user_id
        )
        ON DELETE CASCADE,

    CONSTRAINT fk_comments_recipe
        FOREIGN KEY (
            recipe_id
        )
        REFERENCES recipes (
            recipe_id
        )
        ON DELETE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE shopping_list_items (
    item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id INT NULL,
    ingredient_text VARCHAR(500) NOT NULL,
    is_checked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_shopping_list_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_shopping_list_recipe
        FOREIGN KEY (recipe_id)
        REFERENCES recipes(recipe_id)
        ON DELETE SET NULL,
);