-- ============================================================
-- SURVIVING FRANCE — SCHEMA SQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS surviving_france
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE surviving_france;

-- ============================================================
-- 1. USERS
-- ============================================================

CREATE TABLE users (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name    VARCHAR(100)        NOT NULL,
    last_name     VARCHAR(100)        NOT NULL,
    username      VARCHAR(50)         NOT NULL UNIQUE,
    email         VARCHAR(255)        NOT NULL UNIQUE,
    password_hash VARCHAR(255)        NOT NULL,
    avatar_url    VARCHAR(255)        NULL,
    role          ENUM('user', 'superuser', 'banned') NOT NULL DEFAULT 'user',
    points        INT UNSIGNED        NOT NULL DEFAULT 0,
    created_at    DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP
                                       ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 2. GRADES (référentiel de progression, ex: Lost Tourist, Croissant Rookie...)
-- ============================================================

CREATE TABLE grades (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    min_points  INT UNSIGNED NOT NULL,
    sort_order  TINYINT UNSIGNED NOT NULL
) ENGINE=InnoDB;

INSERT INTO grades (name, min_points, sort_order) VALUES
    ('Lost Tourist',       0,    1),
    ('Croissant Rookie',   300,  2),
    ('Baguette Apprentice',1000, 3),
    ('Honorary Frenchie',  4000, 4);

-- Vue pratique pour récupérer le grade actuel d'un user sans le stocker en dur
CREATE VIEW user_current_grade AS
SELECT
    u.id AS user_id,
    g.id AS grade_id,
    g.name AS grade_name,
    g.min_points,
    (
        SELECT g2.min_points
        FROM grades g2
        WHERE g2.min_points > g.min_points
        ORDER BY g2.min_points ASC
        LIMIT 1
    ) AS next_grade_min_points
FROM users u
JOIN grades g
    ON g.min_points = (
        SELECT MAX(g3.min_points)
        FROM grades g3
        WHERE g3.min_points <= u.points
    );

-- ============================================================
-- 3. BADGES
-- ============================================================

CREATE TABLE badges (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    description     VARCHAR(255) NOT NULL,
    icon_url        VARCHAR(255) NULL,
    condition_type  ENUM('account_created', 'quiz_completed', 'articles_read') NOT NULL,
    condition_target INT UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB;

INSERT INTO badges (name, description, condition_type, condition_target) VALUES
    ('Bonjour!',    'Create your account',   'account_created', 1),
    ('Quiz Addict',  'Finish 5 quiz',          'quiz_completed', 5),
    ('Bookworm',     'Read all 7 articles',    'articles_read',  7);

CREATE TABLE user_badges (
    user_id     INT UNSIGNED NOT NULL,
    badge_id    INT UNSIGNED NOT NULL,
    progress    INT UNSIGNED NOT NULL DEFAULT 0,
    unlocked_at DATETIME NULL,
    PRIMARY KEY (user_id, badge_id),
    FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 4. ARTICLES
-- ============================================================

CREATE TABLE articles (
    id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title             VARCHAR(200) NOT NULL,
    slug              VARCHAR(220) NOT NULL UNIQUE,
    category          ENUM('everyday_life', 'paperwork', 'food', 'transport', 'culture') NOT NULL,
    cover_image_url   VARCHAR(255) NULL,
    summary           VARCHAR(300) NOT NULL,
    content           MEDIUMTEXT   NOT NULL,
    status            ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    read_time_minutes TINYINT UNSIGNED NOT NULL DEFAULT 3,
    author_id         INT UNSIGNED NOT NULL,
    created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                                ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE article_progress (
    user_id       INT UNSIGNED NOT NULL,
    article_id    INT UNSIGNED NOT NULL,
    percent_read  TINYINT UNSIGNED NOT NULL DEFAULT 0,
    completed     BOOLEAN NOT NULL DEFAULT FALSE,
    last_read_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                            ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, article_id),
    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 5. BUILDINGS (page /map)
-- ============================================================

CREATE TABLE buildings (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    type        ENUM('monument', 'church', 'castle') NOT NULL,
    city        VARCHAR(100) NOT NULL,
    region      VARCHAR(100) NULL,
    latitude    DECIMAL(9,6) NOT NULL,
    longitude   DECIMAL(9,6) NOT NULL,
    image_url   VARCHAR(255) NULL,
    text        TEXT NOT NULL,
    tip         VARCHAR(255) NULL
) ENGINE=InnoDB;

-- ============================================================
-- 6. QUIZ
-- ============================================================

CREATE TABLE quiz_themes (
    id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(100) NOT NULL UNIQUE,
    status  ENUM('available', 'coming_soon') NOT NULL DEFAULT 'coming_soon'
) ENGINE=InnoDB;

INSERT INTO quiz_themes (name, status) VALUES
    ('Everyday life', 'available'),
    ('Paperwork',      'coming_soon'),
    ('Food & Drinks',  'coming_soon'),
    ('Transport',      'coming_soon');

CREATE TABLE questions (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    theme_id     INT UNSIGNED NOT NULL,
    question     VARCHAR(300) NOT NULL,
    points       SMALLINT UNSIGNED NOT NULL DEFAULT 10,
    status       ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    explanation  TEXT NULL,
    FOREIGN KEY (theme_id) REFERENCES quiz_themes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE answers (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    question_id  INT UNSIGNED NOT NULL,
    label        CHAR(1) NOT NULL,        -- A, B, C, D
    text         VARCHAR(255) NOT NULL,
    is_correct   BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    UNIQUE KEY uq_question_label (question_id, label)
) ENGINE=InnoDB;

-- ============================================================
-- 7. QUIZ ATTEMPTS (historique de jeu + classement)
-- ============================================================

CREATE TABLE quiz_attempts (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED NOT NULL,
    theme_id    INT UNSIGNED NOT NULL,
    score       SMALLINT UNSIGNED NOT NULL,
    max_score   SMALLINT UNSIGNED NOT NULL,
    played_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)  REFERENCES users(id)       ON DELETE CASCADE,
    FOREIGN KEY (theme_id) REFERENCES quiz_themes(id)
) ENGINE=InnoDB;

CREATE TABLE quiz_attempt_answers (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    attempt_id   INT UNSIGNED NOT NULL,
    question_id  INT UNSIGNED NOT NULL,
    answer_id    INT UNSIGNED NOT NULL,   -- réponse choisie par l'user
    is_correct   BOOLEAN NOT NULL,
    FOREIGN KEY (attempt_id)  REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id),
    FOREIGN KEY (answer_id)   REFERENCES answers(id)
) ENGINE=InnoDB;

-- ============================================================
-- 8. VUE CLASSEMENT (utilisée par /ranking)
-- ============================================================

CREATE VIEW ranking_all_time AS
SELECT
    u.id AS user_id,
    u.username,
    u.avatar_url,
    u.points,
    RANK() OVER (ORDER BY u.points DESC) AS `rank`
FROM users u
WHERE u.role <> 'banned';

CREATE VIEW ranking_this_week AS
SELECT
    u.id AS user_id,
    u.username,
    u.avatar_url,
    COALESCE(SUM(qa.score), 0) AS points_this_week,
    RANK() OVER (ORDER BY COALESCE(SUM(qa.score), 0) DESC) AS `rank`
FROM users u
LEFT JOIN quiz_attempts qa
    ON qa.user_id = u.id
    AND qa.played_at >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
WHERE u.role <> 'banned'
GROUP BY u.id, u.username, u.avatar_url;

-- ============================================================
-- INDEXES UTILES
-- ============================================================

CREATE INDEX idx_articles_status   ON articles(status);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_questions_theme   ON questions(theme_id);
CREATE INDEX idx_attempts_user     ON quiz_attempts(user_id);
CREATE INDEX idx_attempts_played   ON quiz_attempts(played_at);
CREATE INDEX idx_buildings_type    ON buildings(type);