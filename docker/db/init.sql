SELECT 'CREATE DATABASE kc_pitanga'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'kc_pitanga')\gexec

SELECT 'CREATE DATABASE challenges_pitanga'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'challenges_pitanga')\gexec

SELECT 'CREATE DATABASE school_pitanga'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'school_pitanga')\gexec
