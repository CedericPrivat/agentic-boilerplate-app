-- Create the umami database and user for analytics
-- This script runs automatically when PostgreSQL container is first initialized

CREATE USER umami WITH PASSWORD 'umami';
CREATE DATABASE umami OWNER umami;
