-- Add user_id column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id UUID;

-- Optionally, update existing tasks to assign to a default user if needed
-- UPDATE tasks SET user_id = (SELECT id FROM users LIMIT 1) WHERE user_id IS NULL;

-- Create foreign key constraint
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);