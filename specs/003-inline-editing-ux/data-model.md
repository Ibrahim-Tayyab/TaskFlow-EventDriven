# Data Model: Interactive Inline Editing & Skeleton Loading

## Key Entities

### Task Entity
- **id**: Unique identifier for the task
- **description**: Text content of the task
- **completed**: Boolean indicating completion status
- **category**: String representing task category (e.g., "Work", "Personal", "Shopping")
- **priority**: String representing task priority level ("Low", "Medium", "High")
- **created_at**: Timestamp when task was created
- **updated_at**: Timestamp when task was last updated

### TaskTag Entity (Virtual - UI Layer Only)
- **type**: Tag type ("category" or "priority")
- **value**: Current tag value
- **options**: Array of available options for selection
- **isEditing**: Boolean state indicating if tag is in edit mode

### SkeletonTask Entity (UI Component)
- **isLoading**: Boolean indicating loading state
- **animationType**: Type of animation ("pulse", "fade", etc.)
- **dimensions**: Size specifications for skeleton elements

## Validation Rules

### Task Validation
- Category must be one of: "Work", "Personal", "Shopping", "General" (extendable)
- Priority must be one of: "Low", "Medium", "High"
- Description cannot be empty or whitespace-only

### TaskTag Validation
- Only one tag type can be in edit mode at a time per task
- Invalid values should be rejected or reverted to previous value
- Empty values should be treated as cancellation

## State Transitions

### Task Tag States
1. **Display Mode** → **Edit Mode**: User clicks on category or priority tag
2. **Edit Mode** → **Display Mode**: User selects a value from dropdown
3. **Edit Mode** → **Display Mode** (cancel): User clicks outside or presses Escape
4. **Display Mode** → **Display Mode** (updated): Value changes after successful API call

### Skeleton Loading States
1. **Loaded State** → **Skeleton State**: When fetching data
2. **Skeleton State** → **Loaded State**: When data arrives
3. **Skeleton State** → **Empty State**: When no data is available after loading