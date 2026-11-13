CREATE TABLE deposits (player TEXT NOT NULL CHECK(player IN ('Gui','Helen')), value INTEGER NOT NULL CHECK(value BETWEEN 1 AND 200), created_at TEXT NOT NULL, PRIMARY KEY(player,value));
