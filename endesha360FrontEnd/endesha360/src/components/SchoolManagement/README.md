# SchoolManagement Components

This folder contains all components specifically related to the SchoolManagement page functionality.

## 📁 **Components Included:**

### **Core Components:**
- `SchoolTable.jsx` - Main table displaying schools data
- `SchoolTableHeader.jsx` - Table header with sorting functionality  
- `SchoolTableRow.jsx` - Individual table row component
- `SchoolFilters.jsx` - Search and filter controls
- `SchoolStatistics.jsx` - Statistics cards display
- `SchoolActions.jsx` - Action buttons for school operations
- `SchoolView.jsx` - Detailed school information display
- `SchoolFormComponent.jsx` - Form for creating/editing schools

### **UI Components:**
- `StatisticCard.jsx` - Individual statistic card component
- `Pagination.jsx` - Pagination controls for the table
- `DeleteConfirmationModal.jsx` - Confirmation modal for deletions

## 🔗 **Import Usage:**

All components use direct imports in the SchoolManagement page:

```jsx
import SchoolView from '../components/SchoolManagement/SchoolView';
import SchoolStatistics from '../components/SchoolManagement/SchoolStatistics';
import SchoolFilters from '../components/SchoolManagement/SchoolFilters';
import SchoolTable from '../components/SchoolManagement/SchoolTable';
import Pagination from '../components/SchoolManagement/Pagination';
import DeleteConfirmationModal from '../components/SchoolManagement/DeleteConfirmationModal';
import SchoolFormComponent from '../components/SchoolManagement/SchoolFormComponent';
```

## 🚫 **Components NOT Moved:**

The following components remain in the main `/components` folder as they are shared across multiple pages:

- `Modal.jsx` - Used by multiple pages for general modal functionality
- `SchoolOwnerProtectedRoute.jsx` - Route protection component used in App.jsx
- `SchoolRegistration.jsx` - Separate registration page component
- `ApprovedSchools.jsx` - Public-facing approved schools display

## 🧩 **Related Files:**

- **Hook**: `../hooks/useSchoolManagement.js` - Custom hook for SchoolManagement logic
- **Main Page**: `../pages/SchoolManagement.jsx` - Main page component

## 📱 **Mobile Responsive:**

All components in this folder are fully responsive and optimized for mobile devices with:
- Adaptive layouts and spacing
- Touch-friendly interactions  
- Responsive typography and sizing
- Mobile-first design approach
