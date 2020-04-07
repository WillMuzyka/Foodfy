-- run these codes if you want to restart the database
-- drop the databse
DROP DATABASE IF EXISTS foodfy;
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- delete all tables contents
DELETE FROM chefs;
DELETE FROM files;
DELETE FROM recipe_files;
DELETE FROM recipes;
DELETE FROM users;

ALTER SEQUENCE chefs_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipe_files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;