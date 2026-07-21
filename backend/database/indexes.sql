-- Recipes
CREATE INDEX idx_recipe_name
ON recipes(name);

-- Favorites
CREATE INDEX idx_favorite_recipe
ON favorites(recipe_id);

-- Search History
CREATE INDEX idx_search_user_searched
ON search_history(user_id, searched_at);

-- Chat History
CREATE INDEX idx_chat_user_created
ON chat_history(user_id, created_at);

CREATE INDEX idx_chat_recipe
ON chat_history(recipe_id);

#Ratings
CREATE INDEX idx_ratings_recipe_id
    ON ratings (
        recipe_id
    );

#Comments
CREATE INDEX idx_comments_recipe_created
    ON comments (
        recipe_id,
        created_at,
        comment_id
    );

#Shopping List
CREATE INDEX idx_shopping_list_user_created
    ON shopping_list_items(user_id, created_at);

CREATE INDEX idx_shopping_list_recipe
    ON shopping_list_items(recipe_id);