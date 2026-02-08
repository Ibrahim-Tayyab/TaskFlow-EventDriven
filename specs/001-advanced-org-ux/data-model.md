# Data Model: Advanced Organization & UX for the Todo App

## Entity Definitions

### Task Entity
The primary entity representing a user task with enhanced organizational features.

**Fields:**
- `id`: SERIAL (Primary Key) - Auto-incrementing unique identifier
- `description`: TEXT (NOT NULL) - The task description text
- `completed`: BOOLEAN (DEFAULT FALSE) - Completion status of the task
- `category`: TEXT (DEFAULT 'General') - Category/organizational grouping for the task
- `priority`: TEXT (DEFAULT 'Medium') - Priority level of the task (Low, Medium, High)

**Validation Rules:**
- `description` must not be empty
- `priority` must be one of: 'Low', 'Medium', 'High'
- `category` can be any text value, with predefined suggestions: 'General', 'Work', 'Personal', 'Shopping', 'Health'

**State Transitions:**
- `completed` can transition from FALSE to TRUE or TRUE to FALSE
- `category` and `priority` can be updated at any time
- `description` can be updated at any time

### Category Entity (Implicit)
Represents organizational groupings for tasks. Stored as text values in the Task entity.

**Attributes:**
- `name`: TEXT - The category name (stored in task.category field)
- `display_name`: TEXT - User-friendly display name for the category

**Predefined Categories:**
- 'General' - Default category for uncategorized tasks
- 'Work' - Tasks related to work or professional activities
- 'Personal' - Personal or private tasks
- 'Shopping' - Shopping lists or purchase-related tasks
- 'Health' - Health and wellness related tasks

### Priority Entity (Implicit)
Represents priority levels for tasks. Stored as text values in the Task entity.

**Attributes:**
- `level`: TEXT - The priority level (stored in task.priority field)
- `display_color`: TEXT - CSS class or color for UI representation
- `sort_order`: INTEGER - Numeric order for sorting (1=Low, 2=Medium, 3=High)

**Priority Levels:**
- 'Low' - Tasks with lower importance
- 'Medium' - Tasks with standard importance (default)
- 'High' - Tasks with high importance or urgency

## Database Schema

### Tasks Table
```sql
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    category TEXT DEFAULT 'General',
    priority TEXT DEFAULT 'Medium'
);
```

### Schema Evolution
```sql
-- Add category column if not exists
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';

-- Add priority column if not exists
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium';
```

## Relationships

### Task to Category
- **Type**: Belongs To (Implicit)
- **Cardinality**: Each task belongs to one category
- **Implementation**: category field in tasks table references category name

### Task to Priority
- **Type**: Belongs To (Implicit)
- **Cardinality**: Each task has one priority level
- **Implementation**: priority field in tasks table references priority level

## Data Validation

### Server-Side Validation
- Ensure priority values are restricted to 'Low', 'Medium', 'High'
- Validate that description is not empty or only whitespace
- Apply default values for category ('General') and priority ('Medium') if not provided

### Client-Side Validation
- Input sanitization for description field
- Dropdown selection for category and priority to ensure valid values
- Prevent submission of empty descriptions

## Indexing Strategy

### Recommended Indexes
```sql
-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);

-- Index for priority filtering
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Composite index for category and priority filtering
CREATE INDEX IF NOT EXISTS idx_tasks_category_priority ON tasks(category, priority);

-- Index for search functionality
CREATE INDEX IF NOT EXISTS idx_tasks_description_gin ON tasks USING gin(description gin_trgm_ops);
```

## Data Migration

### Migration Steps
1. Add category column with default 'General'
2. Add priority column with default 'Medium'
3. Update existing records to maintain their current state
4. Verify data integrity after migration
5. Update all API endpoints to handle new fields

### Backward Compatibility
- Existing tasks will automatically get default category and priority values
- API endpoints maintain compatibility by providing default values
- No data loss during migration process
- All existing functionality continues to work as before