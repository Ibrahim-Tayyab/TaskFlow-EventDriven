# Quickstart Guide: Interactive Inline Editing & Skeleton Loading

## Development Setup

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- npm/yarn package manager
- Access to Neon PostgreSQL database

### Environment Setup
```bash
# Clone the repository
git clone <repo-url>
cd todo-hackathon

# Install frontend dependencies
cd web-app
npm install

# Install backend dependencies
cd ../api
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Configure DATABASE_URL in .env
```

## Running the Application

### Start Backend Server
```bash
cd api
python -m uvicorn main:app --reload --port 8000
```

### Start Frontend Server
```bash
cd web-app
npm run dev
```

## Key Files to Modify

### Frontend Components
- `web-app/src/components/TaskItem.tsx`: Add inline editing for category/priority tags
- `web-app/src/app/page.tsx`: Add skeleton loading components

### Backend (Reference Only)
- `api/main.py`: Existing API endpoints (no changes needed for this feature)

## Feature Implementation Steps

### 1. TaskItem Component Enhancement
```typescript
// Add edit mode state
const [editingField, setEditingField] = useState<'category' | 'priority' | null>(null);

// Create edit mode UI for category and priority
const renderEditableTag = (field: 'category' | 'priority', value: string) => {
  if (editingField === field) {
    return (
      <select
        value={value}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        onBlur={() => setEditingField(null)}
        autoFocus
      >
        {/* Options based on field type */}
      </select>
    );
  }
  return (
    <span onClick={() => setEditingField(field)}>{value}</span>
  );
};
```

### 2. Skeleton Loading Implementation
```typescript
// Create skeleton component in page.tsx
const SkeletonTask = () => (
  <div className="animate-pulse p-4 flex items-center gap-4 bg-slate-800">
    <div className="w-6 h-6 rounded border border-slate-600"></div>
    <div className="flex-grow h-4 bg-slate-600 rounded"></div>
    <div className="flex gap-2">
      <div className="w-16 h-6 bg-slate-600 rounded"></div>
      <div className="w-16 h-6 bg-slate-600 rounded"></div>
    </div>
  </div>
);
```

## Testing the Feature

### Visual Loading Test
1. Navigate to the application
2. Refresh the page or trigger a search/filter
3. Verify skeleton components appear instead of "Loading..." text

### Inline Editing Test
1. Click on a category tag in any task
2. Verify dropdown appears with category options
3. Select a new category
4. Verify tag updates immediately with optimistic UI
5. Repeat for priority tag

## Troubleshooting

### Common Issues
- If skeleton animations don't appear, ensure Tailwind CSS is properly configured
- If inline editing doesn't work, verify the onClick handlers are correctly attached
- If optimistic updates fail, check that the existing updateTask function is properly called

### Performance Considerations
- Skeleton components should be lightweight to avoid performance impact
- Optimize re-renders during editing mode to prevent UI jank
- Ensure accessibility attributes are maintained during edit mode