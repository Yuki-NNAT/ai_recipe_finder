-- Recipes
CREATE INDEX idx_recipe_name
ON recipes(name);

-- Favorites
CREATE INDEX idx_favorite_user
ON favorites(user_id);

CREATE INDEX idx_favorite_recipe
ON favorites(recipe_id);

-- Search History
CREATE INDEX idx_search_user
ON search_history(user_id);

CREATE INDEX idx_search_time
ON search_history(searched_at);

-- Chat History
CREATE INDEX idx_chat_user
ON chat_history(user_id);

CREATE INDEX idx_chat_recipe
ON chat_history(recipe_id);

CREATE INDEX idx_chat_time
ON chat_history(created_at);

-- Users
CREATE INDEX idx_user_email
ON users(email);