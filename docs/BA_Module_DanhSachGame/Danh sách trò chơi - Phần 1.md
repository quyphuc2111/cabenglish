# 📑 TÀI LIỆU THIẾT KẾ CHI TIẾT - MODULE DANH SÁCH TRÒ CHƠI

# BKT SmartKids - Game Library Module

## PHẦN 1: OVERVIEW & EPIC 1

---

## 📋 PROJECT OVERVIEW

### Project Information

- **Project Name:** BKT SmartKids - Game Library Module
- **Module Name:** Danh sách trò chơi (Game Library)
- **Version:** 1.0
- **Date:** October 18, 2025
- **Status:** In Planning
- **Document Type:** Business Analysis & Technical Specification

### Technology Stack

- **Frontend (Web):** Next.js
- **Frontend (Mobile):** Flutter
- **Backend:** ASP.NET Web API 8.0
- **Database:** MySQL/SQL Server
- **Game Engine:** GDevelop 5
- **Integration Method:** WebView embedded games

### Target Users

1. **Primary Users:** Học sinh mầm non (3-6 tuổi)
2. **Secondary Users:** Quản trị viên hệ thống

### Business Context

Module danh sách trò chơi được phát triển nhằm nâng cao kỹ năng học tiếng Anh cho trẻ mầm non thông qua các trò chơi giáo dục tương tác. Module này tăng giá trị cho phần mềm BKT SmartKids, giúp trẻ em ghi nhớ và học hỏi tiếng Anh thông qua các trò chơi sinh động, phù hợp với độ tuổi và phát triển kỹ năng mầm non.

### Project Goals

- **Timeline:** 1 tuần hoàn thành development
- **Delivery Target:** Deploy ít nhất 2 games lên production
- **Value Proposition:** Tăng engagement và learning outcomes thông qua gamification

---

## 🗄️ DATABASE DESIGN

### Database Schema Overview

Hệ thống sử dụng 7 bảng chính để quản lý games, topics, age groups, và user interactions.

---

#### 1.1. Table: `game_topic`

**Purpose:** Quản lý các chủ đề/category của trò chơi (e.g., Animals, Numbers, Colors, Alphabet)

**Table Structure:**

| Column Name   | Data Type    | Constraints                                                     | Description                                       |
| ------------- | ------------ | --------------------------------------------------------------- | ------------------------------------------------- |
| topic_id      | INT          | PRIMARY KEY, AUTO_INCREMENT                                     | ID duy nhất của topic                             |
| topic_name    | VARCHAR(100) | NOT NULL, UNIQUE                                                | Tên chủ đề tiếng Anh (e.g., "Animals", "Numbers") |
| topic_name_vi | VARCHAR(100) | NULL                                                            | Tên chủ đề tiếng Việt                             |
| description   | TEXT         | NULL                                                            | Mô tả chi tiết về chủ đề và mục tiêu học tập      |
| icon_url      | VARCHAR(500) | NULL                                                            | URL icon đại diện cho topic                       |
| order         | INT          | NOT NULL, DEFAULT 0                                             | Thứ tự hiển thị trên UI (số nhỏ hiển thị trước)   |
| is_active     | BOOLEAN      | NOT NULL, DEFAULT TRUE                                          | Trạng thái kích hoạt (TRUE: hiển thị, FALSE: ẩn)  |
| created_at    | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP                             | Thời điểm tạo record                              |
| updated_at    | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời điểm cập nhật gần nhất                       |

**Indexes:**

```sql
PRIMARY KEY (topic_id)
INDEX idx_topic_active_order (is_active, order)
UNIQUE INDEX uk_topic_name (topic_name)
```

**Sample Data:**

```sql
INSERT INTO game_topic (topic_name, topic_name_vi, description, icon_url, order, is_active) VALUES
('Animals', 'Động vật', 'Học tên các con vật bằng tiếng Anh', '/icons/animals.png', 1, TRUE),
('Numbers', 'Số đếm', 'Học đếm số từ 1-10 bằng tiếng Anh', '/icons/numbers.png', 2, TRUE),
('Colors', 'Màu sắc', 'Nhận biết và học tên màu sắc', '/icons/colors.png', 3, TRUE),
('Alphabet', 'Bảng chữ cái', 'Học bảng chữ cái A-Z', '/icons/alphabet.png', 4, TRUE);
```

---

#### 1.2. Table: `game`

**Purpose:** Lưu trữ thông tin chi tiết về từng trò chơi

**Table Structure:**

| Column Name        | Data Type                      | Constraints                                                     | Description                                      |
| ------------------ | ------------------------------ | --------------------------------------------------------------- | ------------------------------------------------ |
| game_id            | INT                            | PRIMARY KEY, AUTO_INCREMENT                                     | ID duy nhất của game                             |
| game_name          | VARCHAR(200)                   | NOT NULL                                                        | Tên trò chơi                                     |
| game_name_vi       | VARCHAR(200)                   | NULL                                                            | Tên trò chơi tiếng Việt                          |
| description        | TEXT                           | NULL                                                            | Mô tả nội dung và mục tiêu học tập của game      |
| image_url          | VARCHAR(500)                   | NULL                                                            | URL ảnh thumbnail của game (khuyến nghị 16:9)    |
| url_game           | VARCHAR(1000)                  | NOT NULL                                                        | URL để load game trong WebView (GDevelop export) |
| num_liked          | INT                            | NOT NULL, DEFAULT 0                                             | Tổng số lượt thích (sync từ user_game_liked)     |
| order              | INT                            | NOT NULL, DEFAULT 0                                             | Thứ tự hiển thị (số nhỏ hiển thị trước)          |
| is_active          | BOOLEAN                        | NOT NULL, DEFAULT TRUE                                          | Trạng thái kích hoạt                             |
| difficulty_level   | ENUM('easy', 'medium', 'hard') | NULL                                                            | Độ khó của game                                  |
| estimated_duration | INT                            | NULL                                                            | Thời gian chơi ước tính (phút)                   |
| created_by         | INT                            | NULL, FOREIGN KEY                                               | Admin user tạo game                              |
| created_at         | TIMESTAMP                      | NOT NULL, DEFAULT CURRENT_TIMESTAMP                             | Thời điểm tạo                                    |
| updated_at         | TIMESTAMP                      | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời điểm cập nhật                               |

**Indexes:**

```sql
PRIMARY KEY (game_id)
INDEX idx_game_active_order (is_active, order)
INDEX idx_game_name (game_name)
INDEX idx_game_numliked (num_liked DESC)
INDEX idx_game_difficulty (difficulty_level)
FOREIGN KEY fk_game_created_by (created_by) REFERENCES user(user_id) ON DELETE SET NULL
```

**Sample Data:**

```sql
INSERT INTO game (game_name, game_name_vi, description, image_url, url_game, order, difficulty_level, estimated_duration) VALUES
('Animal Match', 'Ghép đôi động vật', 'Tìm và ghép đôi các con vật giống nhau', '/images/animal-match.jpg', 'https://games.smartkids.com/animal-match', 1, 'easy', 5),
('Count the Stars', 'Đếm ngôi sao', 'Đếm số ngôi sao và chọn đáp án đúng', '/images/count-stars.jpg', 'https://games.smartkids.com/count-stars', 2, 'easy', 10);
```

---

#### 1.3. Table: `game_topic_link`

**Purpose:** Bảng liên kết Many-to-Many giữa game và topic

**Table Structure:**

| Column Name | Data Type | Constraints                         | Description          |
| ----------- | --------- | ----------------------------------- | -------------------- |
| gtl_id      | INT       | PRIMARY KEY, AUTO_INCREMENT         | ID duy nhất của link |
| game_id     | INT       | NOT NULL, FOREIGN KEY               | ID của game          |
| topic_id    | INT       | NOT NULL, FOREIGN KEY               | ID của topic         |
| created_at  | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm liên kết   |

**Constraints:**

```sql
FOREIGN KEY fk_gtl_game (game_id) REFERENCES game(game_id) ON DELETE CASCADE
FOREIGN KEY fk_gtl_topic (topic_id) REFERENCES game_topic(topic_id) ON DELETE CASCADE
UNIQUE KEY uk_game_topic (game_id, topic_id)
```

**Indexes:**

```sql
PRIMARY KEY (gtl_id)
INDEX idx_gtl_game (game_id)
INDEX idx_gtl_topic (topic_id)
```

**Business Rules:**

- Một game có thể thuộc nhiều topics (e.g., game về Animals and Numbers)
- Một topic có thể chứa nhiều games
- Khi xóa game hoặc topic, các link tương ứng sẽ tự động xóa (CASCADE)

---

#### 1.4. Table: `age`

**Purpose:** Quản lý các nhóm độ tuổi phù hợp cho trẻ mầm non

**Table Structure:**

| Column Name | Data Type   | Constraints                                                     | Description                                     |
| ----------- | ----------- | --------------------------------------------------------------- | ----------------------------------------------- |
| age_id      | INT         | PRIMARY KEY, AUTO_INCREMENT                                     | ID duy nhất của age group                       |
| age_name    | VARCHAR(50) | NOT NULL, UNIQUE                                                | Tên độ tuổi (e.g., "3-4 tuổi")                  |
| age_name_en | VARCHAR(50) | NULL                                                            | Tên độ tuổi tiếng Anh (e.g., "3-4 years old")   |
| description | TEXT        | NULL                                                            | Mô tả đặc điểm phát triển nhận thức của độ tuổi |
| min_age     | INT         | NOT NULL                                                        | Độ tuổi tối thiểu (năm)                         |
| max_age     | INT         | NOT NULL                                                        | Độ tuổi tối đa (năm)                            |
| order       | INT         | NOT NULL, DEFAULT 0                                             | Thứ tự hiển thị                                 |
| created_at  | TIMESTAMP   | NOT NULL, DEFAULT CURRENT_TIMESTAMP                             | Thời điểm tạo                                   |
| updated_at  | TIMESTAMP   | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời điểm cập nhật                              |

**Indexes:**

```sql
PRIMARY KEY (age_id)
INDEX idx_age_order (order)
UNIQUE INDEX uk_age_name (age_name)
INDEX idx_age_range (min_age, max_age)
```

**Sample Data:**

```sql
INSERT INTO age (age_name, age_name_en, description, min_age, max_age, order) VALUES
('3-4 tuổi', '3-4 years old', 'Giai đoạn phát triển nhận thức cơ bản, học qua hình ảnh và âm thanh', 3, 4, 1),
('4-5 tuổi', '4-5 years old', 'Bắt đầu phát triển tư duy logic đơn giản', 4, 5, 2),
('5-6 tuổi', '5-6 years old', 'Chuẩn bị vào lớp 1, có thể học nội dung phức tạp hơn', 5, 6, 3);
```

---

#### 1.5. Table: `game_age_link`

**Purpose:** Bảng liên kết Many-to-Many giữa game và age group

**Table Structure:**

| Column Name | Data Type | Constraints                         | Description          |
| ----------- | --------- | ----------------------------------- | -------------------- |
| gal_id      | INT       | PRIMARY KEY, AUTO_INCREMENT         | ID duy nhất của link |
| game_id     | INT       | NOT NULL, FOREIGN KEY               | ID của game          |
| age_id      | INT       | NOT NULL, FOREIGN KEY               | ID của age group     |
| created_at  | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm liên kết   |

**Constraints:**

```sql
FOREIGN KEY fk_gal_game (game_id) REFERENCES game(game_id) ON DELETE CASCADE
FOREIGN KEY fk_gal_age (age_id) REFERENCES age(age_id) ON DELETE CASCADE
UNIQUE KEY uk_game_age (game_id, age_id)
```

**Indexes:**

```sql
PRIMARY KEY (gal_id)
INDEX idx_gal_game (game_id)
INDEX idx_gal_age (age_id)
```

**Business Rules:**

- Một game có thể phù hợp với nhiều độ tuổi (e.g., 3-4 tuổi và 4-5 tuổi)
- Một độ tuổi có thể chứa nhiều games
- Khi xóa game hoặc age group, các link tương ứng sẽ tự động xóa (CASCADE)

---

#### 1.6. Table: `user_game_played`

**Purpose:** Theo dõi lịch sử chơi game của user (tracking engagement)

**Table Structure:**

| Column Name     | Data Type | Constraints                                                     | Description                |
| --------------- | --------- | --------------------------------------------------------------- | -------------------------- |
| user_id         | INT       | NOT NULL, FOREIGN KEY                                           | ID của user (học sinh)     |
| game_id         | INT       | NOT NULL, FOREIGN KEY                                           | ID của game                |
| first_played    | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP                             | Lần đầu tiên chơi game     |
| last_played     | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Thời điểm chơi gần nhất    |
| play_count      | INT       | NOT NULL, DEFAULT 1                                             | Tổng số lần đã chơi game   |
| total_play_time | INT       | NULL, DEFAULT 0                                                 | Tổng thời gian chơi (giây) |

**Constraints:**

```sql
PRIMARY KEY (user_id, game_id)
FOREIGN KEY fk_ugp_user (user_id) REFERENCES user(user_id) ON DELETE CASCADE
FOREIGN KEY fk_ugp_game (game_id) REFERENCES game(game_id) ON DELETE CASCADE
```

**Indexes:**

```sql
INDEX idx_ugp_user (user_id)
INDEX idx_ugp_game (game_id)
INDEX idx_ugp_last_played (last_played DESC)
INDEX idx_ugp_play_count (play_count DESC)
```

**Business Logic:**

- Khi user click vào game lần đầu → INSERT record mới với play_count = 1
- Khi user chơi lại game → UPDATE play_count += 1, last_played = NOW()
- Nếu không có record → user chưa từng chơi game này
- Dùng để tính progress: đã chơi X/Y games

---

#### 1.7. Table: `user_game_liked`

**Purpose:** Theo dõi các game mà user đã thích (favorite/like feature)

**Table Structure:**

| Column Name | Data Type | Constraints                         | Description          |
| ----------- | --------- | ----------------------------------- | -------------------- |
| user_id     | INT       | NOT NULL, FOREIGN KEY               | ID của user          |
| game_id     | INT       | NOT NULL, FOREIGN KEY               | ID của game          |
| liked_at    | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Thời điểm thích game |

**Constraints:**

```sql
PRIMARY KEY (user_id, game_id)
FOREIGN KEY fk_ugl_user (user_id) REFERENCES user(user_id) ON DELETE CASCADE
FOREIGN KEY fk_ugl_game (game_id) REFERENCES game(game_id) ON DELETE CASCADE
```

**Indexes:**

```sql
INDEX idx_ugl_user (user_id)
INDEX idx_ugl_game (game_id)
INDEX idx_ugl_liked_at (liked_at DESC)
```

**Business Logic:**

- Khi user click nút "Like" → INSERT record mới
- Khi user click nút "Unlike" → DELETE record
- Sau mỗi thao tác → UPDATE game.num_liked = COUNT(\*)
- Nếu không có record → user chưa thích game này
- Dùng để lọc "Favorite Games" của user

---

### Database Relationships Diagram

```
┌──────────────────┐
│   game_topic     │
│  - topic_id (PK) │
│  - topic_name    │
│  - description   │
│  - icon_url      │
│  - order         │
│  - is_active     │
└────────┬─────────┘
         │ 1
         │
         │ M
┌────────▼─────────┐         ┌──────────────────┐
│game_topic_link   │    M    │      game        │
│- gtl_id (PK)     │─────────│  - game_id (PK)  │
│- game_id (FK)    │    1    │  - game_name     │
│- topic_id (FK)   │         │  - description   │
└──────────────────┘         │  - image_url     │
                              │  - url_game      │
                              │  - num_liked     │
                              │  - order         │
                              │  - is_active     │
                              └────────┬─────────┘
                                       │ 1
                                       │
                                       │ M
         ┌─────────────────────────────┤
         │                             │
         │                             │
┌────────▼─────────┐         ┌────────▼─────────┐
│  game_age_link   │         │user_game_played  │
│- gal_id (PK)     │         │- user_id (PK,FK) │
│- game_id (FK)    │         │- game_id (PK,FK) │
│- age_id (FK)     │         │- first_played    │
└────────┬─────────┘         │- last_played     │
         │ M                 │- play_count      │
         │                   └──────────────────┘
         │ 1                            │ M
┌────────▼─────────┐                   │
│       age        │                   │ 1
│  - age_id (PK)   │         ┌─────────▼─────────┐
│  - age_name      │         │      user         │
│  - description   │         │  - user_id (PK)   │
│  - min_age       │    1    │  - username       │
│  - max_age       │─────────│  - role           │
│  - order         │    M    └─────────┬─────────┘
└──────────────────┘                   │ 1
                                       │
                                       │ M
                              ┌────────▼─────────┐
                              │ user_game_liked  │
                              │- user_id (PK,FK) │
                              │- game_id (PK,FK) │
                              │- liked_at        │
                              └──────────────────┘
```

---

### Database Migration Script

```sql
-- Migration: Create Game Library Module Tables
-- Version: 1.0
-- Date: 2025-10-18

-- 1. Create game_topic table
CREATE TABLE game_topic (
    topic_id INT PRIMARY KEY AUTO_INCREMENT,
    topic_name VARCHAR(100) NOT NULL UNIQUE,
    topic_name_vi VARCHAR(100),
    description TEXT,
    icon_url VARCHAR(500),
    `order` INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_topic_active_order (is_active, `order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create age table
CREATE TABLE age (
    age_id INT PRIMARY KEY AUTO_INCREMENT,
    age_name VARCHAR(50) NOT NULL UNIQUE,
    age_name_en VARCHAR(50),
    description TEXT,
    min_age INT NOT NULL,
    max_age INT NOT NULL,
    `order` INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_age_order (`order`),
    INDEX idx_age_range (min_age, max_age)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create game table
CREATE TABLE game (
    game_id INT PRIMARY KEY AUTO_INCREMENT,
    game_name VARCHAR(200) NOT NULL,
    game_name_vi VARCHAR(200),
    description TEXT,
    image_url VARCHAR(500),
    url_game VARCHAR(1000) NOT NULL,
    num_liked INT NOT NULL DEFAULT 0,
    `order` INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    difficulty_level ENUM('easy', 'medium', 'hard'),
    estimated_duration INT,
    created_by INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_game_active_order (is_active, `order`),
    INDEX idx_game_name (game_name),
    INDEX idx_game_numliked (num_liked DESC),
    INDEX idx_game_difficulty (difficulty_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create game_topic_link table
CREATE TABLE game_topic_link (
    gtl_id INT PRIMARY KEY AUTO_INCREMENT,
    game_id INT NOT NULL,
    topic_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_game_topic (game_id, topic_id),
    INDEX idx_gtl_game (game_id),
    INDEX idx_gtl_topic (topic_id),
    CONSTRAINT fk_gtl_game FOREIGN KEY (game_id) REFERENCES game(game_id) ON DELETE CASCADE,
    CONSTRAINT fk_gtl_topic FOREIGN KEY (topic_id) REFERENCES game_topic(topic_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Create game_age_link table
CREATE TABLE game_age_link (
    gal_id INT PRIMARY KEY AUTO_INCREMENT,
    game_id INT NOT NULL,
    age_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_game_age (game_id, age_id),
    INDEX idx_gal_game (game_id),
    INDEX idx_gal_age (age_id),
    CONSTRAINT fk_gal_game FOREIGN KEY (game_id) REFERENCES game(game_id) ON DELETE CASCADE,
    CONSTRAINT fk_gal_age FOREIGN KEY (age_id) REFERENCES age(age_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Create user_game_played table
CREATE TABLE user_game_played (
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    first_played TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_played TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    play_count INT NOT NULL DEFAULT 1,
    total_play_time INT DEFAULT 0,
    PRIMARY KEY (user_id, game_id),
    INDEX idx_ugp_user (user_id),
    INDEX idx_ugp_game (game_id),
    INDEX idx_ugp_last_played (last_played DESC),
    INDEX idx_ugp_play_count (play_count DESC),
    CONSTRAINT fk_ugp_user FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_ugp_game FOREIGN KEY (game_id) REFERENCES game(game_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Create user_game_liked table
CREATE TABLE user_game_liked (
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    liked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, game_id),
    INDEX idx_ugl_user (user_id),
    INDEX idx_ugl_game (game_id),
    INDEX idx_ugl_liked_at (liked_at DESC),
    CONSTRAINT fk_ugl_user FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_ugl_game FOREIGN KEY (game_id) REFERENCES game(game_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default data
INSERT INTO age (age_name, age_name_en, description, min_age, max_age, `order`) VALUES
('3-4 tuổi', '3-4 years old', 'Giai đoạn phát triển nhận thức cơ bản, học qua hình ảnh và âm thanh', 3, 4, 1),
('4-5 tuổi', '4-5 years old', 'Bắt đầu phát triển tư duy logic đơn giản', 4, 5, 2),
('5-6 tuổi', '5-6 years old', 'Chuẩn bị vào lớp 1, có thể học nội dung phức tạp hơn', 5, 6, 3);

INSERT INTO game_topic (topic_name, topic_name_vi, description, icon_url, `order`, is_active) VALUES
('Animals', 'Động vật', 'Học tên các con vật bằng tiếng Anh', '/icons/animals.png', 1, TRUE),
('Numbers', 'Số đếm', 'Học đếm số từ 1-10 bằng tiếng Anh', '/icons/numbers.png', 2, TRUE),
('Colors', 'Màu sắc', 'Nhận biết và học tên màu sắc', '/icons/colors.png', 3, TRUE),
('Alphabet', 'Bảng chữ cái', 'Học bảng chữ cái A-Z', '/icons/alphabet.png', 4, TRUE),
('Shapes', 'Hình khối', 'Nhận biết các hình cơ bản', '/icons/shapes.png', 5, TRUE);
```

---

## 📊 EPICS & USER STORIES

### Epic 1: Khám phá và chơi trò chơi

- **Epic ID:** EP-001
- **Epic Name:** Khám phá và chơi trò chơi (Game Discovery & Play)
- **Description:** Học sinh có thể khám phá, tìm kiếm, lọc và chơi các trò chơi giáo dục tiếng Anh phù hợp với độ tuổi của mình
- **As a** học sinh nhỏ tuổi sử dụng nền tảng SmartKids
- **I want** khám phá, tìm kiếm, lọc và chơi các trò chơi giáo dục
- **So that** tôi có thể vừa học vừa giải trí và theo dõi tiến trình chơi game của mình

**Business Value:**

- Tăng engagement của học sinh với nền tảng
- Cải thiện learning outcomes thông qua gamification
- Tăng thời gian sử dụng app (retention)

**Success Metrics/KPIs:**

- Số lượng games được chơi mỗi ngày: >= 5 games/user/day
- Tỷ lệ học sinh quay lại chơi: >= 70% daily active users
- Thời gian chơi trung bình: >= 15 phút/session
- Tỷ lệ hoàn thành game: >= 60%

**Stakeholders:**

- Product Owner: [Tên PO]
- Business Sponsor: BKT SmartKids Management
- Technical Lead: [Tên Tech Lead]
- End Users: Học sinh mầm non (3-6 tuổi), Phụ huynh

**Target Release:** Sprint 1 (Week 1)
**Budget & Resources:** 1 BA + 2 Developers + 1 QA x 1 sprint
**Dependencies:**

- User authentication system đã hoạt động
- GDevelop games đã được export và host

**Risks & Assumptions:**

- Risks: Games có thể không load được trên một số devices cũ
- Assumptions: WebView performance đủ tốt cho GDevelop games

**Compliance & Security Requirements:**

- COPPA compliance (Children's Online Privacy Protection Act)
- Không thu thập thông tin cá nhân của trẻ em
- Nội dung games phù hợp với độ tuổi

---

### User Stories của Epic 1

---

## 📝 USER STORY 1: Xem danh sách trò chơi

- **User Story ID:** US-001
- **Epic Link:** EP-001
- **Title:** Xem danh sách trò chơi (View Game List)

**User Story:**

- **As a** học sinh mầm non sử dụng ứng dụng BKT SmartKids
- **I want** xem danh sách tất cả các trò chơi có sẵn
- **So that** tôi có thể chọn game mà mình thích để chơi

**Description:**
Học sinh truy cập vào module Game Library và xem danh sách các trò chơi giáo dục. Mỗi game hiển thị với thumbnail, tên game, và các thông tin cơ bản. Danh sách hiển thị theo thứ tự được cấu hình bởi admin, chỉ hiển thị các games đang active.

**Business Context:**
Đây là tính năng cốt lõi để user khám phá các games có sẵn. Giao diện phải thân thiện với trẻ em, hình ảnh đẹp mắt, dễ click.

**Priority:** High (Must have)
**Story Points (Estimation):** 5 điểm
**Sprint:** Sprint 1
**Assigned To:** Frontend Developer + Backend Developer

**Definition of Ready (DoR):**

- [x] AC được định nghĩa rõ ràng
- [x] Design/Mockup đã được approve
- [x] Database schema đã sẵn sàng
- [x] API contract đã được define
- [x] Testable và có thể demo

**Definition of Done (DoD):**

- [ ] Code complete và pass code review
- [ ] Unit tests coverage >= 80%
- [ ] Integration tests passed
- [ ] All AC verified by QA
- [ ] Responsive trên web và mobile
- [ ] Documentation updated
- [ ] Demo được cho PO và approved

**Technical Requirements:**

**API Endpoints:**

```
GET /api/v1/games
Query Parameters:
  - page: int (default: 1)
  - pageSize: int (default: 20)
  - isActive: boolean (default: true)

Response 200:
{
  "success": true,
  "data": {
    "games": [
      {
        "gameId": 1,
        "gameName": "Animal Match",
        "gameNameVi": "Ghép đôi động vật",
        "description": "Tìm và ghép đôi các con vật giống nhau",
        "imageUrl": "/images/animal-match.jpg",
        "urlGame": "https://games.smartkids.com/animal-match",
        "numLiked": 120,
        "topics": ["Animals", "Memory"],
        "ageGroups": ["3-4 tuổi", "4-5 tuổi"],
        "difficultyLevel": "easy",
        "estimatedDuration": 5,
        "isLikedByUser": false,
        "isPlayedByUser": true
      }
    ],
    "totalCount": 50,
    "currentPage": 1,
    "pageSize": 20
  }
}
```

**Database Changes:** Sử dụng các bảng: game, game_topic_link, game_age_link, user_game_liked, user_game_played

**Performance:**

- Response time < 1s cho list với 20 items
- Lazy loading cho images
- Infinite scroll hoặc pagination

**Security:**

- Yêu cầu authentication
- Chỉ trả về games có is_active = true
- Filter theo age group nếu user có thông tin tuổi

**Browser/Device Support:** Chrome, Safari, Mobile responsive (iOS/Android)

**Dependencies:**

- Technical: ASP.NET API, Next.js/Flutter frontend, Image CDN
- Business: Game data đã được nhập vào database

**Assumptions & Constraints:**

- User đã đăng nhập vào hệ thống
- Có ít nhất 2 games trong database để hiển thị
- Images được host trên CDN với loading nhanh

**Out of Scope:**

- Filtering và searching (sẽ có ở US-002, US-003, US-004)
- Sorting options (sẽ có ở admin module)
- Game recommendations dựa trên AI

**Notes & References:**

- Design Figma: [Link to Figma]
- API Documentation: [Link to Swagger]

---

### Acceptance Criteria - US-001

#### 3.1. Happy Path (Main Flow)

**Scenario [HP-1]: User xem danh sách games thành công**

```
Given user đã đăng nhập vào ứng dụng BKT SmartKids
  And có ít nhất 5 games đang active trong database
When user truy cập vào màn hình "Game Library"
Then hệ thống hiển thị danh sách games
  And mỗi game card hiển thị:
    - Thumbnail image (16:9 ratio)
    - Tên game (tiếng Việt)
    - Icon các topics (e.g., Animals, Numbers)
    - Icon độ tuổi phù hợp
    - Icon số lượt thích
    - Badge "Đã chơi" nếu user đã chơi game này
    - Badge "Yêu thích" nếu user đã like game này
  And games được sắp xếp theo thứ tự order tăng dần
  And chỉ hiển thị các games có is_active = true
```

**Scenario [HP-2]: User scroll để xem thêm games (pagination)**

```
Given user đang ở màn hình Game Library
  And đã load page 1 với 20 games
  And tổng số có 50 games trong database
When user scroll xuống cuối danh sách
Then hệ thống tự động load thêm 20 games tiếp theo (page 2)
  And hiển thị loading indicator trong khi đang load
  And append games mới vào cuối danh sách hiện tại
  And không bị duplicate games
```

**Scenario [HP-3]: User click vào game card để xem chi tiết**

```
Given user đang xem danh sách games
When user click vào một game card bất kỳ
Then hệ thống chuyển sang màn hình chi tiết game
  And hiển thị thông tin đầy đủ của game đó
  And có nút "Chơi ngay" để start game
```

---

#### 3.2. Alternative Flow

**Scenario [AF-1]: Hiển thị danh sách games cho user lần đầu truy cập (chưa có lịch sử)**

```
Given user mới đăng ký và đăng nhập lần đầu
  And user chưa chơi game nào
  And user chưa like game nào
When user truy cập vào màn hình Game Library
Then hệ thống hiển thị danh sách games
  And tất cả games đều không có badge "Đã chơi"
  And tất cả games đều không có badge "Yêu thích"
  And hiển thị welcome message: "Chào bé, hãy chọn game để bắt đầu học tiếng Anh nhé!"
```

**Scenario [AF-2]: User có filter độ tuổi trong profile**

```
Given user có thông tin age = 4 tuổi trong profile
  And có 10 games phù hợp với "3-4 tuổi"
  And có 8 games phù hợp với "4-5 tuổi"
  And có 5 games phù hợp với "5-6 tuổi"
When user truy cập vào màn hình Game Library
Then hệ thống ưu tiên hiển thị games phù hợp với độ tuổi của user trước
  And các games khác vẫn hiển thị phía sau
  And có label "Phù hợp với bé" cho games match với age
```

---

#### 3.3. Exception Flow (Error Flow)

**Scenario [EX-1]: Không có games nào trong database**

```
Given database không có game nào hoặc tất cả games đều is_active = false
When user truy cập vào màn hình Game Library
Then hệ thống hiển thị empty state với message:
  "Chưa có trò chơi nào. Vui lòng quay lại sau nhé!"
  And hiển thị icon minh họa thân thiện
  And không hiển thị loading indicator
```

**Scenario [EX-2]: User chưa đăng nhập**

```
Given user chưa đăng nhập vào hệ thống
When user cố gắng truy cập vào màn hình Game Library
Then hệ thống redirect user đến màn hình Login
  And hiển thị message: "Vui lòng đăng nhập để chơi game"
  And sau khi login thành công, redirect về Game Library
```

**Scenario [EX-3]: API timeout hoặc server error**

```
Given user đã đăng nhập
When user truy cập Game Library
  But API /api/v1/games timeout hoặc trả về 500 error
Then hệ thống hiển thị error message:
  "Không thể tải danh sách game. Vui lòng thử lại"
  And hiển thị nút "Thử lại"
When user click "Thử lại"
Then hệ thống gọi lại API để load games
```

---

#### 3.4. Edge Case (Boundary Case)

**Scenario [EC-1]: Chỉ có 1 game trong database**

```
Given database chỉ có đúng 1 game active
When user truy cập Game Library
Then hệ thống hiển thị 1 game card
  And không hiển thị pagination
  And layout vẫn đẹp và centered
```

**Scenario [EC-2]: Có đúng 20 games (bằng pageSize)**

```
Given database có đúng 20 games active
When user load page 1
Then hệ thống hiển thị đầy đủ 20 games
  And không có pagination hoặc "Load more"
  And totalCount = 20, currentPage = 1
```

**Scenario [EC-3]: Game image bị broken hoặc không load được**

```
Given một game có imageUrl không hợp lệ hoặc image bị lỗi
When hệ thống hiển thị danh sách games
Then game đó hiển thị placeholder image mặc định
  And các thông tin khác (tên, topics, age) vẫn hiển thị bình thường
  And user vẫn có thể click vào game card
```

**Scenario [EC-4]: Game name quá dài**

```
Given một game có tên dài hơn 50 ký tự
When hiển thị game card
Then hệ thống truncate tên game với "..." ở cuối
  And tooltip hiển thị full name khi hover (web) hoặc long press (mobile)
```

---

#### 3.8. UI/UX Flow (Interaction)

**Scenario [UX-1]: Loading state khi đang fetch games**

```
Given user vừa truy cập màn hình Game Library
When API đang được gọi và chưa trả về response
Then hiển thị skeleton loading cho 6 game cards
  And hiển thị loading animation
  And disable user interaction trong khi đang load
```

**Scenario [UX-2]: Hover effect trên game card (Web)**

```
Given user đang ở màn hình Game Library trên web
When user hover mouse lên một game card
Then game card có scale animation (1.05x)
  And hiển thị shadow effect
  And cursor chuyển thành pointer
```

**Scenario [UX-3]: Pull-to-refresh (Mobile)**

```
Given user đang ở màn hình Game Library trên mobile
When user pull down từ đầu màn hình
Then hiển thị refresh indicator
  And reload lại danh sách games từ đầu
  And scroll về top sau khi reload xong
```

---

#### 3.9. Performance & Load Scenario

**Scenario [PF-1]: Load danh sách với 50 concurrent users**

```
Given hệ thống có 50 users đồng thời truy cập Game Library
When tất cả users load danh sách games
Then response time < 1 giây cho 95% requests
  And hệ thống không bị crash hoặc timeout
  And database queries được optimize với proper indexes
```

**Scenario [PF-2]: Image loading performance**

```
Given một game card có image 2MB
When user scroll đến vùng hiển thị game đó
Then image được lazy load
  And hiển thị placeholder trong khi đang load
  And image được optimize/compress về dưới 200KB
  And sử dụng progressive loading hoặc blur-up technique
```

---

#### 3.10. Security & Authorization Scenario

**Scenario [SEC-1]: User với expired token**

```
Given user có JWT token đã hết hạn
When user truy cập Game Library
Then hệ thống trả về 401 Unauthorized
  And redirect user về màn hình Login
  And hiển thị message: "Phiên đăng nhập đã hết hạn"
```

**Scenario [SEC-2]: User không có quyền truy cập (role restricted)**

```
Given user có role = "guest" (chưa kích hoạt tài khoản)
When user cố truy cập Game Library
Then hệ thống trả về 403 Forbidden
  And hiển thị message: "Vui lòng kích hoạt tài khoản để chơi game"
```

---

#### 3.15. Mobile & Responsive Scenario

**Scenario [MOB-1]: Hiển thị trên mobile (< 768px)**

```
Given user truy cập từ mobile device
When user mở màn hình Game Library
Then games hiển thị dạng grid 2 columns
  And game card có padding phù hợp cho touch
  And font size đủ lớn để đọc
  And touch target >= 44x44px (iOS guideline)
```

**Scenario [MOB-2]: Hiển thị trên tablet (768px - 1024px)**

```
Given user truy cập từ tablet
When user mở màn hình Game Library
Then games hiển thị dạng grid 3 columns
  And layout tận dụng không gian màn hình lớn hơn
```

**Scenario [MOB-3]: Hiển thị trên desktop (> 1024px)**

```
Given user truy cập từ desktop/laptop
When user mở màn hình Game Library
Then games hiển thị dạng grid 4 columns
  And có sidebar filters (nếu có)
  And layout centered với max-width phù hợp
```

---

## 📝 USER STORY 2: Tìm kiếm trò chơi theo tên

- **User Story ID:** US-002
- **Epic Link:** EP-001
- **Title:** Tìm kiếm trò chơi theo tên (Search Game by Name)

**User Story:**

- **As a** học sinh mầm non hoặc phụ huynh sử dụng ứng dụng
- **I want** tìm kiếm game bằng cách nhập tên game
- **So that** tôi có thể nhanh chóng tìm được game mà mình muốn chơi

**Description:**
User có thể nhập từ khóa vào search box để tìm kiếm games theo tên. Hệ thống tìm kiếm real-time (debounce 500ms), hỗ trợ cả tiếng Anh và tiếng Việt, không phân biệt hoa thường.

**Business Context:**
Với nhiều games trong thư viện, việc tìm kiếm giúp user nhanh chóng tìm được game yêu thích mà không cần scroll qua toàn bộ danh sách.

**Priority:** High (Must have)
**Story Points (Estimation):** 3 điểm
**Sprint:** Sprint 1
**Assigned To:** Frontend Developer + Backend Developer

**Definition of Ready (DoR):**

- [x] AC được định nghĩa rõ ràng
- [x] Design search UI đã được approve
- [x] API search endpoint đã được define
- [x] Database indexing cho search đã được plan

**Definition of Done (DoD):**

- [ ] Code complete và pass code review
- [ ] Search performance < 500ms
- [ ] Unit tests coverage >= 80%
- [ ] All AC verified by QA
- [ ] Documentation updated

**Technical Requirements:**

**API Endpoints:**

```
GET /api/v1/games/search
Query Parameters:
  - keyword: string (required, min: 1 char)
  - page: int (default: 1)
  - pageSize: int (default: 20)

Response 200:
{
  "success": true,
  "data": {
    "games": [...],
    "totalCount": 15,
    "keyword": "animal"
  }
}
```

**Database Changes:**

- Add fulltext index trên game_name và game_name_vi
- Query: `WHERE game_name LIKE '%keyword%' OR game_name_vi LIKE '%keyword%'`

**Performance:**

- Debounce 500ms trước khi gọi API
- Response time < 500ms
- Cache search results trong 5 phút

**Security:**

- Sanitize input để tránh SQL injection
- Limit keyword length <= 100 chars
- Rate limiting: 20 requests/minute/user

---

### Acceptance Criteria - US-002

#### 3.1. Happy Path (Main Flow)

**Scenario [HP-1]: Tìm kiếm game thành công**

```
Given user đang ở màn hình Game Library
  And có 5 games có tên chứa từ "animal"
When user nhập "animal" vào search box
  And đợi 500ms (debounce)
Then hệ thống gọi API /api/v1/games/search?keyword=animal
  And hiển thị 5 games matching với keyword
  And highlight từ khóa "animal" trong tên game
  And hiển thị "Tìm thấy 5 trò chơi"
```

**Scenario [HP-2]: Tìm kiếm với từ khóa tiếng Việt**

```
Given user đang ở màn hình Game Library
  And có game tên "Ghép đôi động vật"
When user nhập "động vật" vào search box
Then hệ thống tìm được game "Ghép đôi động vật"
  And hiển thị kết quả tìm kiếm
```

**Scenario [HP-3]: Clear search và quay về danh sách đầy đủ**

```
Given user đã search "animal" và có kết quả
When user click vào nút "X" trong search box hoặc xóa hết text
Then hệ thống clear search keyword
  And hiển thị lại toàn bộ danh sách games ban đầu
```

---

#### 3.2. Alternative Flow

**Scenario [AF-1]: Search với nhiều từ khóa**

```
Given user đang ở màn hình Game Library
When user nhập "animal count" (2 từ)
Then hệ thống tìm games có tên chứa "animal" HOẶC "count"
  And sắp xếp theo độ liên quan (relevance)
```

**Scenario [AF-2]: Search không phân biệt hoa thường**

```
Given có game tên "Animal Match"
When user nhập "ANIMAL" hoặc "animal" hoặc "AnImAl"
Then hệ thống đều tìm được game "Animal Match"
```

---

#### 3.3. Exception Flow

**Scenario [EX-1]: Không tìm thấy game nào**

```
Given user đang search
When user nhập keyword "xyzabc123" không match với game nào
Then hệ thống hiển thị empty state:
  "Không tìm thấy trò chơi nào với từ khóa 'xyzabc123'"
  And hiển thị gợi ý: "Hãy thử từ khóa khác"
  And không hiển thị game cards
```

**Scenario [EX-2]: User nhập keyword quá ngắn (< 1 ký tự)**

```
Given user đang ở search box
When user chưa nhập gì hoặc chỉ nhập space
Then hệ thống không gọi API
  And hiển thị placeholder: "Tìm kiếm game..."
```

**Scenario [EX-3]: API search bị lỗi**

```
Given user nhập keyword "animal"
When API /api/v1/games/search trả về 500 error
Then hiển thị error toast: "Không thể tìm kiếm. Vui lòng thử lại"
  And giữ nguyên danh sách games hiện tại (không clear)
```

---

#### 3.4. Edge Case

**Scenario [EC-1]: Search với special characters**

```
Given user nhập keyword chứa special chars: "animal & number!"
When hệ thống xử lý search
Then sanitize input để tránh SQL injection
  And tìm kiếm với text "animal number" (bỏ special chars)
```

**Scenario [EC-2]: Search với keyword dài**

```
Given user nhập keyword > 100 ký tự
When user submit search
Then hệ thống truncate về 100 ký tự
  And hiển thị warning: "Từ khóa quá dài, đã rút gọn"
```

---

#### 3.8. UI/UX Flow

**Scenario [UX-1]: Real-time search với debounce**

```
Given user đang ở search box
When user gõ "a", "n", "i", "m", "a", "l" liên tục
Then hệ thống chờ 500ms sau keystroke cuối cùng
  And mới gọi API search
  And không gọi API sau mỗi keystroke
```

**Scenario [UX-2]: Loading state khi đang search**

```
Given user vừa nhập keyword và API đang được gọi
When chờ response
Then hiển thị loading spinner trong search box
  And disable thêm input tạm thời
```

**Scenario [UX-3]: Highlight keyword trong kết quả**

```
Given user search "animal"
  And tìm được game "Animal Match"
When hiển thị kết quả
Then highlight "Animal" bằng bold hoặc background color
```

---

#### 3.9. Performance Scenario

**Scenario [PF-1]: Search performance với large dataset**

```
Given database có 1000 games
When user search với keyword bất kỳ
Then response time < 500ms
  And sử dụng database fulltext index
  And pagination vẫn hoạt động
```

---

## 📝 USER STORY 3: Lọc trò chơi theo chủ đề

- **User Story ID:** US-003
- **Epic Link:** EP-001
- **Title:** Lọc trò chơi theo chủ đề (Filter Games by Topic)

**User Story:**

- **As a** học sinh hoặc phụ huynh
- **I want** lọc games theo chủ đề (Animals, Numbers, Colors, etc.)
- **So that** tôi có thể tìm games liên quan đến topic mà con tôi đang muốn học

**Description:**
User có thể chọn một hoặc nhiều topics để lọc danh sách games. Hệ thống chỉ hiển thị các games thuộc topics được chọn. Filter có thể combine với search.

**Business Context:**
Giúp parents và students tìm games theo mục tiêu học tập cụ thể (e.g., muốn học về động vật → filter topic "Animals").

**Priority:** High (Must have)
**Story Points (Estimation):** 5 điểm
**Sprint:** Sprint 1
**Assigned To:** Frontend Developer + Backend Developer

**Definition of Ready (DoR):**

- [x] AC được định nghĩa rõ ràng
- [x] Design filter UI đã approve
- [x] API filter endpoint đã define
- [x] Topic data đã có trong database

**Definition of Done (DoD):**

- [ ] Code complete và pass code review
- [ ] Unit tests coverage >= 80%
- [ ] Integration tests passed
- [ ] All AC verified by QA
- [ ] Responsive UI

**Technical Requirements:**

**API Endpoints:**

```
GET /api/v1/games
Query Parameters:
  - topicIds: string (comma-separated, e.g., "1,2,3")
  - page: int
  - pageSize: int

Example: GET /api/v1/games?topicIds=1,2&page=1&pageSize=20

Response 200:
{
  "success": true,
  "data": {
    "games": [...],
    "totalCount": 25,
    "appliedFilters": {
      "topics": ["Animals", "Numbers"]
    }
  }
}
```

**Additional Endpoint - Get Topics List:**

```
GET /api/v1/topics
Response 200:
{
  "success": true,
  "data": {
    "topics": [
      {
        "topicId": 1,
        "topicName": "Animals",
        "topicNameVi": "Động vật",
        "iconUrl": "/icons/animals.png",
        "gameCount": 15
      }
    ]
  }
}
```

**Database Changes:**

- Query với JOIN game_topic_link
- WHERE game_id IN (SELECT game_id FROM game_topic_link WHERE topic_id IN (1,2,3))

**Performance:**

- Response time < 1s
- Cache topics list trong 1 giờ

---

### Acceptance Criteria - US-003

#### 3.1. Happy Path (Main Flow)

**Scenario [HP-1]: Lọc games theo 1 topic**

```
Given user đang ở màn hình Game Library
  And có 15 games thuộc topic "Animals"
When user click vào filter "Animals"
Then hệ thống gọi API /api/v1/games?topicIds=1
  And hiển thị 15 games thuộc topic "Animals"
  And hiển thị badge "Animals" ở filter bar
  And hiển thị "Hiển thị 15 trò chơi"
```

**Scenario [HP-2]: Lọc theo nhiều topics (Multi-select)**

```
Given user đang ở màn hình Game Library
  And có 10 games thuộc "Animals"
  And có 8 games thuộc "Numbers"
  And có 3 games thuộc cả "Animals" VÀ "Numbers"
When user chọn cả "Animals" và "Numbers"
Then hệ thống hiển thị 18 games (10 + 8 - 3 trùng lặp = 15 unique games)
  And các games trùng lặp chỉ hiển thị 1 lần
  And hiển thị cả 2 badges: "Animals", "Numbers"
```

**Scenario [HP-3]: Bỏ filter và quay về danh sách đầy đủ**

```
Given user đã filter theo "Animals"
When user click vào badge "Animals" để remove filter
  Or click nút "Clear all filters"
Then hệ thống bỏ filter
  And hiển thị lại toàn bộ games
```

---

#### 3.2. Alternative Flow

**Scenario [AF-1]: Filter topics hiển thị với số lượng games**

```
Given user mở filter dropdown
When hiển thị danh sách topics
Then mỗi topic hiển thị số lượng games bên cạnh:
  - Animals (15)
  - Numbers (12)
  - Colors (8)
  And topics được sắp xếp theo order từ database
```

**Scenario [AF-2]: Combine filter với search**

```
Given user đã filter theo topic "Animals"
  And có 15 games thuộc "Animals"
When user search keyword "match"
Then hệ thống filter theo CẢ topic "Animals" VÀ keyword "match"
  And chỉ hiển thị games thỏa cả 2 điều kiện
```

---

#### 3.3. Exception Flow

**Scenario [EX-1]: Không có game nào thuộc topic được chọn**

```
Given user chọn topic "Advanced Math"
  And topic này không có game nào
When filter được apply
Then hiển thị empty state:
  "Chưa có trò chơi nào trong chủ đề này"
  And gợi ý: "Hãy thử chủ đề khác"
```

**Scenario [EX-2]: API get topics bị lỗi**

```
Given user mở filter dropdown
When API /api/v1/topics trả về 500 error
Then hiển thị error message trong dropdown:
  "Không thể tải danh sách chủ đề"
  And có nút "Thử lại"
```

---

#### 3.4. Edge Case

**Scenario [EC-1]: Topic không có games active**

```
Given topic "Alphabet" có 5 games nhưng tất cả đều is_active = false
When user chọn filter "Alphabet"
Then hiển thị empty state vì không có game active nào
```

**Scenario [EC-2]: User chọn tất cả topics**

```
Given có 5 topics
When user chọn tất cả 5 topics
Then kết quả tương đương với không filter (hiển thị all games)
```

---

#### 3.8. UI/UX Flow

**Scenario [UX-1]: Filter dropdown UI (Desktop)**

```
Given user đang ở desktop
When user click vào nút "Lọc theo chủ đề"
Then hiển thị dropdown menu với:
  - Checkbox cho mỗi topic
  - Icon và tên topic
  - Số lượng games
  - Nút "Apply" và "Clear"
```

**Scenario [UX-2]: Filter bottom sheet (Mobile)**

```
Given user đang ở mobile
When user click vào nút filter
Then hiển thị bottom sheet với danh sách topics
  And user có thể chọn nhiều topics
  And click "Áp dụng" để apply filter
```

**Scenario [UX-3]: Active filter badges**

```
Given user đã chọn 2 topics: "Animals" và "Numbers"
When filter được apply
Then hiển thị 2 badges ở trên danh sách games:
  [Animals ✕] [Numbers ✕]
When user click vào ✕ trên badge "Animals"
Then remove filter "Animals"
  And chỉ giữ lại filter "Numbers"
```

---

#### 3.9. Performance Scenario

**Scenario [PF-1]: Filter với nhiều topics**

```
Given user chọn 5 topics cùng lúc
When hệ thống query database
Then sử dụng optimized query với IN clause
  And response time < 1 giây
  And database sử dụng index trên game_topic_link
```

---

#### 3.15. Mobile & Responsive

**Scenario [MOB-1]: Filter UI trên mobile**

```
Given user ở mobile device
When user mở filter
Then hiển thị fullscreen bottom sheet
  And các topic checkboxes đủ lớn để touch (>= 44px)
  And có nút "Đóng" rõ ràng
```

---

**🎯 KẾT THÚC PHẦN 1 - 3 USER STORIES ĐẦU TIÊN**

_Tiếp theo: Phần 1B sẽ bao gồm 4 user stories còn lại của Epic 1:_

- _US-004: Lọc trò chơi theo độ tuổi_
- _US-005: Chơi trò chơi_
- _US-006: Thích/Bỏ thích trò chơi_
- _US-007: Theo dõi tiến độ chơi game_

---

## 📝 USER STORY 4: Lọc trò chơi theo độ tuổi

- **User Story ID:** US-004
- **Epic Link:** EP-001
- **Title:** Lọc trò chơi theo độ tuổi (Filter Games by Age Group)

**User Story:**

- **As a** học sinh mầm non hoặc phụ huynh sử dụng ứng dụng
- **I want** lọc games theo độ tuổi phù hợp (e.g., 3-4 tuổi, 4-5 tuổi)
- **So that** tôi có thể tìm games phù hợp với độ tuổi của con mình, tránh nội dung quá dễ hoặc quá khó

**Description:**
User có thể chọn một hoặc nhiều nhóm độ tuổi để lọc danh sách games. Hệ thống chỉ hiển thị các games phù hợp với nhóm tuổi được chọn, dựa trên liên kết trong bảng game_age_link. Filter có thể kết hợp với search và filter topic.

**Business Context:**
Đảm bảo nội dung phù hợp với sự phát triển nhận thức của trẻ, tăng tính an toàn và hiệu quả học tập. Parents có thể dễ dàng chọn games phù hợp với độ tuổi con cái.

**Priority:** High (Must have)
**Story Points (Estimation):** 5 điểm
**Sprint:** Sprint 1
**Assigned To:** Frontend Developer + Backend Developer

**Definition of Ready (DoR):**

- [x] AC được định nghĩa rõ ràng
- [x] Design filter UI cho age đã được approve
- [x] API filter endpoint cho age đã được define
- [x] Age data đã có trong database

**Definition of Done (DoD):**

- [ ] Code complete và pass code review
- [ ] Unit tests coverage >= 80%
- [ ] Integration tests passed
- [ ] All AC verified by QA
- [ ] Responsive UI

**Technical Requirements:**

**API Endpoints:**

```
GET /api/v1/games
Query Parameters:
  - ageIds: string (comma-separated, e.g., "1,2,3")
  - page: int
  - pageSize: int

Example: GET /api/v1/games?ageIds=1,2&page=1&pageSize=20

Response 200:
{
  "success": true,
  "data": {
    "games": [...],
    "totalCount": 20,
    "appliedFilters": {
      "ages": ["3-4 tuổi", "4-5 tuổi"]
    }
  }
}
```

**Additional Endpoint - Get Ages List:**

```
GET /api/v1/ages
Response 200:
{
  "success": true,
  "data": {
    "ages": [
      {
        "ageId": 1,
        "ageName": "3-4 tuổi",
        "ageNameEn": "3-4 years old",
        "gameCount": 20
      }
    ]
  }
}
```

**Database Changes:**

- Query với JOIN game_age_link
- WHERE game_id IN (SELECT game_id FROM game_age_link WHERE age_id IN (1,2,3))

**Performance:**

- Response time < 1s
- Cache ages list trong 1 giờ

**Security:**

- Sanitize input
- Rate limiting: 20 requests/minute/user

---

### Acceptance Criteria - US-004

#### 3.1. Happy Path (Main Flow)

**Scenario [HP-1]: Lọc games theo 1 nhóm tuổi**

```
Given user đang ở màn hình Game Library
  And có 20 games phù hợp với "3-4 tuổi"
When user click vào filter "3-4 tuổi"
Then hệ thống gọi API /api/v1/games?ageIds=1
  And hiển thị 20 games phù hợp với "3-4 tuổi"
  And hiển thị badge "3-4 tuổi" ở filter bar
  And hiển thị "Hiển thị 20 trò chơi"
```

**Scenario [HP-2]: Lọc theo nhiều nhóm tuổi (Multi-select)**

```
Given user đang ở màn hình Game Library
  And có 20 games thuộc "3-4 tuổi"
  And có 15 games thuộc "4-5 tuổi"
  And có 5 games thuộc cả hai nhóm
When user chọn cả "3-4 tuổi" và "4-5 tuổi"
Then hệ thống hiển thị 30 games (20 + 15 - 5 = 30 unique games)
  And các games trùng lặp chỉ hiển thị 1 lần
  And hiển thị cả 2 badges: "3-4 tuổi", "4-5 tuổi"
```

**Scenario [HP-3]: Bỏ filter và quay về danh sách đầy đủ**

```
Given user đã filter theo "3-4 tuổi"
When user click vào badge "3-4 tuổi" để remove filter
  Or click nút "Clear all filters"
Then hệ thống bỏ filter
  And hiển thị lại toàn bộ games
```

---

#### 3.2. Alternative Flow

**Scenario [AF-1]: Filter ages hiển thị với số lượng games**

```
Given user mở filter dropdown
When hiển thị danh sách ages
Then mỗi age hiển thị số lượng games bên cạnh:
  - 3-4 tuổi (20)
  - 4-5 tuổi (15)
  And ages được sắp xếp theo order từ database
```

**Scenario [AF-2]: Combine filter với search và topic**

```
Given user đã filter theo age "3-4 tuổi"
  And đã filter topic "Animals"
When user search keyword "match"
Then hệ thống filter theo CẢ age, topic, và keyword
  And chỉ hiển thị games thỏa tất cả điều kiện
```

---

#### 3.3. Exception Flow

**Scenario [EX-1]: Không có game nào thuộc nhóm tuổi được chọn**

```
Given user chọn age "7-8 tuổi" (không tồn tại hoặc không có game)
When filter được apply
Then hiển thị empty state:
  "Chưa có trò chơi nào phù hợp với độ tuổi này"
  And gợi ý: "Hãy thử độ tuổi khác"
```

**Scenario [EX-2]: API get ages bị lỗi**

```
Given user mở filter dropdown
When API /api/v1/ages trả về 500 error
Then hiển thị error message trong dropdown:
  "Không thể tải danh sách độ tuổi"
  And có nút "Thử lại"
```

---

#### 3.4. Edge Case

**Scenario [EC-1]: Age không có games active**

```
Given age "5-6 tuổi" có 10 games nhưng tất cả is_active = false
When user chọn filter "5-6 tuổi"
Then hiển thị empty state vì không có game active nào
```

**Scenario [EC-2]: User chọn tất cả ages**

```
Given có 3 ages
When user chọn tất cả 3 ages
Then kết quả tương đương với không filter (hiển thị all games)
```

---

#### 3.8. UI/UX Flow

**Scenario [UX-1]: Filter dropdown UI (Desktop)**

```
Given user đang ở desktop
When user click vào nút "Lọc theo độ tuổi"
Then hiển thị dropdown menu với:
  - Checkbox cho mỗi age
  - Tên age
  - Số lượng games
  - Nút "Apply" và "Clear"
```

**Scenario [UX-2]: Filter bottom sheet (Mobile)**

```
Given user đang ở mobile
When user click vào nút filter
Then hiển thị bottom sheet với danh sách ages
  And user có thể chọn nhiều ages
  And click "Áp dụng" để apply filter
```

**Scenario [UX-3]: Active filter badges**

```
Given user đã chọn 2 ages: "3-4 tuổi" và "4-5 tuổi"
When filter được apply
Then hiển thị 2 badges ở trên danh sách games:
  [3-4 tuổi ✕] [4-5 tuổi ✕]
When user click vào ✕ trên badge "3-4 tuổi"
Then remove filter "3-4 tuổi"
  And chỉ giữ lại filter "4-5 tuổi"
```

---

#### 3.9. Performance Scenario

**Scenario [PF-1]: Filter với nhiều ages**

```
Given user chọn 3 ages cùng lúc
When hệ thống query database
Then sử dụng optimized query với IN clause
  And response time < 1 giây
  And database sử dụng index trên game_age_link
```

---

#### 3.15. Mobile & Responsive

**Scenario [MOB-1]: Filter UI trên mobile**

```
Given user ở mobile device
When user mở filter
Then hiển thị fullscreen bottom sheet
  And các age checkboxes đủ lớn để touch (>= 44px)
  And có nút "Đóng" rõ ràng
```

---

## 📝 USER STORY 5: Chơi trò chơi

- **User Story ID:** US-005
- **Epic Link:** EP-001
- **Title:** Chơi trò chơi (Play Game)

**User Story:**

- **As a** học sinh mầm non sử dụng ứng dụng
- **I want** chơi trò chơi bằng cách click vào game
- **So that** tôi có thể tương tác với nội dung giáo dục và học tiếng Anh qua game

**Description:**
User click vào game card hoặc nút "Chơi ngay" để load game trong WebView. Hệ thống ghi nhận lần chơi vào bảng user_game_played (tăng play_count nếu đã chơi trước). WebView hỗ trợ full-screen, và game từ GDevelop được embed.

**Business Context:**
Tính năng cốt lõi để thực hiện mục tiêu gamification, tăng engagement và learning outcomes.

**Priority:** Critical (Must have)
**Story Points (Estimation):** 8 điểm
**Sprint:** Sprint 1
**Assigned To:** Frontend Developer + Backend Developer

**Definition of Ready (DoR):**

- [x] AC được định nghĩa rõ ràng
- [x] Design WebView UI đã được approve
- [x] API update play record đã define
- [x] Games đã được host và test load

**Definition of Done (DoD):**

- [ ] Code complete và pass code review
- [ ] Unit tests coverage >= 80%
- [ ] Integration tests passed
- [ ] All AC verified by QA
- [ ] Performance WebView checked trên nhiều devices

**Technical Requirements:**

**API Endpoints:**

```
POST /api/v1/games/{gameId}/play
Body: {} (empty, chỉ cần auth token)

Response 200:
{
  "success": true,
  "data": {
    "playCount": 2,  // sau khi update
    "firstPlayed": "2025-10-20T10:00:00Z"
  }
}
```

**Frontend:**

- Sử dụng WebView trong Flutter (mobile) và iframe trong Next.js (web)
- Track thời gian chơi (total_play_time) bằng cách gửi update khi exit game

**Database Changes:**

- INSERT/UPDATE user_game_played: IF EXISTS UPDATE play_count +=1, last_played=NOW(), ELSE INSERT

**Performance:**

- Load game < 3s
- WebView không lag trên low-end devices

**Security:**

- Validate url_game từ database (tránh arbitrary URL)
- No cross-site scripting in WebView

---

### Acceptance Criteria - US-005

#### 3.1. Happy Path (Main Flow)

**Scenario [HP-1]: User chơi game lần đầu**

```
Given user chưa từng chơi game ID=1
When user click "Chơi ngay" cho game ID=1
Then hệ thống gọi POST /api/v1/games/1/play → INSERT record với play_count=1
  And load url_game trong WebView full-screen
  And hiển thị loading indicator trong khi load
```

**Scenario [HP-2]: User chơi lại game**

```
Given user đã chơi game ID=1 (play_count=1)
When user chơi lại game ID=1
Then UPDATE play_count=2, last_played=NOW()
  And load game bình thường
```

**Scenario [HP-3]: Exit game và update thời gian chơi**

```
Given user đang chơi game
When user exit WebView (back button hoặc close)
Then gửi PUT /api/v1/games/{gameId}/update-play-time với thời gian chơi (seconds)
  And update total_play_time += seconds
```

---

#### 3.2. Alternative Flow

**Scenario [AF-1]: Chơi game từ chi tiết screen**

```
Given user đang ở màn hình chi tiết game
When user click "Chơi ngay"
Then load WebView và ghi nhận play giống như từ list
```

**Scenario [AF-2]: Game load với orientation lock (mobile)**

```
Given user trên mobile
When load game
Then WebView lock ở landscape mode nếu game yêu cầu
```

---

#### 3.3. Exception Flow

**Scenario [EX-1]: Game URL không load được**

```
Given url_game bị lỗi hoặc không tồn tại
When user cố chơi
Then hiển thị error: "Không thể tải trò chơi. Vui lòng thử lại sau"
  And không update play record
  And có nút "Thử lại"
```

**Scenario [EX-2]: User chưa đăng nhập**

```
Given user chưa login
When user cố chơi game
Then redirect đến login
  And sau login, quay lại và chơi game
```

---

#### 3.4. Edge Case

**Scenario [EC-1]: Chơi game với play_count cao**

```
Given play_count = 999
When chơi lại
Then update play_count = 1000 (no overflow)
```

**Scenario [EC-2]: WebView crash**

```
Given WebView crash do device low memory
Then catch error và hiển thị message thân thiện
```

---

#### 3.8. UI/UX Flow

**Scenario [UX-1]: Loading game**

```
Given user click chơi
When đang load url_game
Then hiển thị progress bar hoặc spinner với message "Đang tải trò chơi..."
```

**Scenario [UX-2]: Full-screen mode**

```
Given user trên mobile
When game load xong
Then WebView full-screen, ẩn navigation bar
```

**Scenario [UX-3]: Back button handling**

```
Given user đang chơi
When press back
Then exit WebView và update play time
```

---

#### 3.9. Performance Scenario

**Scenario [PF-1]: Load game trên low-end device**

```
Given device RAM 2GB
When load game
Then load time < 5s, no crash
```

---

#### 3.10. Security & Authorization Scenario

**Scenario [SEC-1]: Validate game ownership**

```
Given game is_active = false
When user cố chơi
Then trả về 404, không load
```

---

#### 3.15. Mobile & Responsive Scenario

**Scenario [MOB-1]: WebView trên iOS/Android**

```
Given user trên iOS
When load game
Then sử dụng WKWebView (iOS) hoặc Android WebView
  And hỗ trợ JavaScript, media playback
```

---

## 📝 USER STORY 6: Thích/Bỏ thích trò chơi

- **User Story ID:** US-006
- **Epic Link:** EP-001
- **Title:** Thích/Bỏ thích trò chơi (Like/Unlike Game)

**User Story:**

- **As a** học sinh mầm non sử dụng ứng dụng
- **I want** thích hoặc bỏ thích một trò chơi
- **So that** tôi có thể đánh dấu các game yêu thích để dễ tìm lại sau

**Description:**
User click nút heart icon trên game card để like/unlike. Hệ thống update bảng user_game_liked và sync num_liked trong bảng game. Hỗ trợ hiển thị danh sách "Yêu thích" riêng.

**Business Context:**
Tăng engagement bằng cách cho user personalize thư viện game, khuyến khích quay lại chơi các game yêu thích.

**Priority:** Medium (Should have)
**Story Points (Estimation):** 4 điểm
**Sprint:** Sprint 1
**Assigned To:** Frontend Developer + Backend Developer

**Definition of Ready (DoR):**

- [x] AC được định nghĩa rõ ràng
- [x] Design like button UI đã approve
- [x] API like/unlike đã define

**Definition of Done (DoD):**

- [ ] Code complete và pass code review
- [ ] Unit tests coverage >= 80%
- [ ] All AC verified by QA
- [ ] Real-time update UI

**Technical Requirements:**

**API Endpoints:**

```
POST /api/v1/games/{gameId}/like  // to like
DELETE /api/v1/games/{gameId}/like  // to unlike

Response 200 (like):
{
  "success": true,
  "data": {
    "numLiked": 121,  // after update
    "isLiked": true
  }
}
```

**Database Changes:**

- INSERT/DELETE user_game_liked
- UPDATE game.num_liked = COUNT(\*) từ user_game_liked

**Performance:**

- Response time < 500ms
- Use optimistic UI update (update UI trước, rollback nếu fail)

**Security:**

- Chỉ user authenticated mới like
- Prevent duplicate likes (unique key)

---

### Acceptance Criteria - US-006

#### 3.1. Happy Path (Main Flow)

**Scenario [HP-1]: User like game lần đầu**

```
Given user chưa like game ID=1
When user click heart icon
Then gọi POST /api/v1/games/1/like → INSERT record, UPDATE num_liked +=1
  And icon chuyển sang filled heart
  And hiển thị animation like (e.g., heart pop)
```

**Scenario [HP-2]: User unlike game**

```
Given user đã like game ID=1
When user click filled heart
Then gọi DELETE /api/v1/games/1/like → DELETE record, UPDATE num_liked -=1
  And icon chuyển về empty heart
```

**Scenario [HP-3]: Xem danh sách yêu thích**

```
Given user đã like 5 games
When user click tab "Yêu thích"
Then hiển thị list 5 games liked
  And gọi API /api/v1/games?filter=liked
```

---

#### 3.2. Alternative Flow

**Scenario [AF-1]: Like từ chi tiết screen**

```
Given user ở màn hình chi tiết game
When click like
Then update giống như từ list
  And sync num_liked real-time
```

---

#### 3.3. Exception Flow

**Scenario [EX-1]: Like fail do network error**

```
Given network error khi gọi API
When user click like
Then rollback UI (từ filled về empty)
  And hiển thị toast: "Không thể thích game. Thử lại"
```

**Scenario [EX-2]: User chưa login**

```
Given chưa login
When click like
Then prompt login
  And sau login, thực hiện like
```

---

#### 3.4. Edge Case

**Scenario [EC-1]: Like game đã deactivate**

```
Given game is_active = false
When user cố like
Then API trả 404, không cho like
```

**Scenario [EC-2]: Multiple likes nhanh chóng**

```
Given user click like nhiều lần nhanh
Then chỉ gọi API 1 lần (debounce)
```

---

#### 3.8. UI/UX Flow

**Scenario [UX-1]: Optimistic update**

```
Given user click like
Then ngay lập tức update UI (filled heart, num_liked +=1)
  And gọi API async
  If fail, rollback UI
```

**Scenario [UX-2]: Animation**

```
Given click like
Then heart icon animate scale up/down
```

---

#### 3.9. Performance Scenario

**Scenario [PF-1]: High concurrency likes**

```
Given 100 users like cùng game
Then update num_liked chính xác (use transaction)
```

---

#### 3.10. Security & Authorization Scenario

**Scenario [SEC-1]: Prevent spam like**

```
Given user cố like/unlike >10 lần/phút
Then rate limit, trả 429 Too Many Requests
```

---

#### 3.15. Mobile & Responsive Scenario

**Scenario [MOB-1]: Touch target for heart icon**

```
Given mobile
Then heart icon >= 44px để dễ touch
```

---

## 📝 USER STORY 7: Theo dõi tiến độ chơi game

- **User Story ID:** US-007
- **Epic Link:** EP-001
- **Title:** Theo dõi tiến độ chơi game (Track Game Progress)

**User Story:**

- **As a** học sinh mầm non hoặc phụ huynh
- **I want** xem tiến độ chơi game tổng thể (e.g., đã chơi 3/10 games)
- **So that** tôi có thể biết mình đã khám phá bao nhiêu phần trăm thư viện game và được khuyến khích chơi thêm

**Description:**
Hiển thị progress bar hoặc counter ở đầu màn hình Game Library, tính dựa trên số games đã chơi (từ user_game_played) so với tổng số games active. Cập nhật real-time khi chơi game mới.

**Business Context:**
Khuyến khích user hoàn thành tất cả games, tăng retention và completion rate.

**Priority:** Medium (Should have)
**Story Points (Estimation):** 5 điểm
**Sprint:** Sprint 1
**Assigned To:** Frontend Developer + Backend Developer

**Definition of Ready (DoR):**

- [x] AC được định nghĩa rõ ràng
- [x] Design progress UI đã approve
- [x] API get progress đã define

**Definition of Done (DoD):**

- [ ] Code complete và pass code review
- [ ] Unit tests coverage >= 80%
- [ ] All AC verified by QA
- [ ] Responsive progress bar

**Technical Requirements:**

**API Endpoints:**

```
GET /api/v1/games/progress
Response 200:
{
  "success": true,
  "data": {
    "playedCount": 3,
    "totalCount": 10,
    "percentage": 30,
    "lastPlayedGame": "Animal Match"
  }
}
```

**Frontend:**

- Progress bar với animation
- Update khi quay lại từ chơi game

**Database Changes:**

- Query COUNT DISTINCT game_id FROM user_game_played WHERE user_id = ?
- Total: COUNT FROM game WHERE is_active = true

**Performance:**

- Response time < 500ms
- Cache progress trong 5 phút

**Security:**

- Chỉ trả progress của user hiện tại

---

### Acceptance Criteria - US-007

#### 3.1. Happy Path (Main Flow)

**Scenario [HP-1]: Xem progress ban đầu**

```
Given user đã chơi 3/10 games
When user mở Game Library
Then gọi GET /api/v1/games/progress
  And hiển thị progress bar 30% với text "Bạn đã chơi 3/10 trò chơi"
```

**Scenario [HP-2]: Update progress sau khi chơi game mới**

```
Given progress 3/10
When user chơi một game mới
Then update progress to 4/10
  And animate progress bar tăng lên
```

**Scenario [HP-3]: Hoàn thành 100%**

```
Given user đã chơi tất cả games
When xem progress
Then hiển thị 100% với message "Chúc mừng! Bạn đã hoàn thành tất cả trò chơi"
  And badge achievement
```

---

#### 3.2. Alternative Flow

**Scenario [AF-1]: Progress với filter áp dụng**

```
Given user áp dụng filter topic "Animals" (có 5 games)
  And user đã chơi 2/5 trong topic đó
When xem progress
Then hiển thị progress lọc: "2/5 trong chủ đề Animals"
  And progress tổng vẫn hiển thị riêng
```

---

#### 3.3. Exception Flow

**Scenario [EX-1]: Không có games nào**

```
Given total games = 0
When xem progress
Then hiển thị "Chưa có trò chơi nào để theo dõi"
```

**Scenario [EX-2]: API progress error**

```
Given API error
Then hiển thị default progress 0%
  And toast error
```

---

#### 3.4. Edge Case

**Scenario [EC-1]: Total games thay đổi (admin add new)**

```
Given progress 10/10
When admin add new game
Then progress update to 10/11 khi reload
```

**Scenario [EC-2]: User chưa chơi game nào**

```
Given playedCount = 0
When xem progress
Then 0% với message "Hãy bắt đầu chơi game nhé!"
```

---

#### 3.8. UI/UX Flow

**Scenario [UX-1]: Progress bar animation**

```
Given progress thay đổi
Then animate bar fill từ left to right
```

**Scenario [UX-2]: Tooltip on progress**

```
Given hover progress bar
Then tooltip: "Đã chơi X/Y games"
```

---

#### 3.9. Performance Scenario

**Scenario [PF-1]: Large total games**

```
Given 1000 games
When query progress
Then use efficient COUNT query
  < 500ms
```

---
