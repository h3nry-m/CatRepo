\echo 'Delete and recreate cat_repo db?'
\prompt 'Return for yes or control-C to cancel >' answer 

DROP DATABASE IF EXISTS cat_repo; 
CREATE DATABASE cat_repo;
\connect cat_repo;

\i cat-repo-schema.sql 
