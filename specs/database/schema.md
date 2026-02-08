# Database Schema

> Source of truth for all database tables in the Todo Hackathon application.

## Table: `tasks`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | |
| description | TEXT | NOT NULL | Task description/title |
| completed | BOOLEAN | DEFAULT FALSE | |
| category | VARCHAR(100) | DEFAULT 'General' | Work, Personal, Health, etc. |
| priority | VARCHAR(20) | DEFAULT 'Medium' | High, Medium, Low |
| tags | JSON | DEFAULT '[]' | Array of strings |
| due_date | TIMESTAMP | NULLABLE | ISO8601 format |
| is_recurring | BOOLEAN | DEFAULT FALSE | |
| recurrence_pattern | VARCHAR(50) | NULLABLE | daily, weekly, monthly, cron:... |
| next_occurrence | TIMESTAMP | NULLABLE | For recurring task scheduling |
| notification_sent | BOOLEAN | DEFAULT FALSE | Prevents duplicate reminders |
| user_id | VARCHAR(255) | NULLABLE, FK -> users.id | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

## Table: `users` (Managed by Better Auth)

| Column | Type | Constraints |
|--------|------|-------------|
| id | VARCHAR(255) | PRIMARY KEY |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| name | VARCHAR(255) | |
| password_hash | TEXT | |
| created_at | TIMESTAMP | |

## Table: `conversations`

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| user_id | VARCHAR(255) | FK -> users.id |
| created_at | TIMESTAMP | |

## Table: `chat_messages`

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| conversation_id | INTEGER | FK -> conversations.id |
| role | VARCHAR(20) | 'user' or 'assistant' |
| content | TEXT | |
| created_at | TIMESTAMP | |

## Indexes

- `tasks.user_id` - For filtering tasks by user
- `tasks.completed` - For status filtering
- `tasks.due_date` - For reminder queries
- `tasks.notification_sent` - For cron job filtering
