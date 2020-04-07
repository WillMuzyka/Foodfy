-- run these codes if you want to start the database
-- create database
CREATE DATABASE foodfy;
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- create the tables
CREATE TABLE "chefs"(
  "id" SERIAL PRIMARY KEY,
	"name" TEXT NOT NULL,
	"file_id" INT,
	"created_at" TIMESTAMP DEFAULT(now())
);

CREATE TABLE "files"(
  "id" SERIAL PRIMARY KEY,
	"name" TEXT,
	"path" TEXT NOT NULL
);

CREATE TABLE "recipe_files"(
  "id" SERIAL PRIMARY KEY,
	"recipe_id" INT NOT NULL,
	"file_id" INT NOT NULL
);

CREATE TABLE "recipes"(
  "id" SERIAL PRIMARY KEY,
	"chef_id" INT NOT NULL,
	"user_id" INT NOT NULL,
	"title" TEXT NOT NULL,
	"ingredients" TEXT[],
	"preparation" TEXT[],
	"information" TEXT,
	"created_at" TIMESTAMP DEFAULT(now()),
	"updated_at" TIMESTAMP DEFAULT(now())
);

CREATE TABLE "users"(
  "id" SERIAL PRIMARY KEY,
	"name" TEXT NOT NULL,
	"email" TEXT UNIQUE NOT NULL,
	"password" TEXT NOT NULL,
	"is_admin" BOOLEAN DEFAULT false,
	"reset_token" TEXT,
	"reset_token_expires" TEXT,
	"created_at" TIMESTAMP DEFAULT(now()),
	"updated_at" TIMESTAMP DEFAULT(now())
);

ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON DELETE CASCADE;
ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON DELETE CASCADE;
ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") ON DELETE CASCADE;
ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id") ON DELETE CASCADE;
ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

-- create procedures
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- create triggers products and users
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON "recipes"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON "users"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- connection pg simple table
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "session" ("expire");