# Student Violation Management System - Project Documentation

## Overview

The Student Violation Management System is a comprehensive web application designed to streamline the process of managing student disciplinary violations in an educational institution. The system provides role-based access control, document generation, QR code scanning for student identification, and data visualization capabilities.

## Project Structure

```
ViolationWebReactApp/
├── public/
│   ├── documents/              # Template documents for violation forms
│   │   ├── Call-Slip.docx
│   │   ├── Formal-Complaint-Letter.doc
│   │   ├── Letter-Of-Suspension.docx
│   │   ├── Notice-Of-Case-Dismissal.docx
│   │   ├── Request-For-Non-Wearing-Of-Uniform.docx
│   │   ├── Student-Incident-Report.docx
│   │   ├── Temporary-Gate-Pass.doc
│   │   ├── Written-Reprimand-For-Violation-Of-Norms-Conduct.doc
│   │   └── Written-Warning-For-Violation-Of-Norms-Conduct.doc
│   └── images/
├── src/
│   ├── auth/                   # Authentication components
│   │   ├── AuthProvider.jsx    # Authentication context provider
│   │   └── ProtectedRoute.jsx  # Route protection wrapper
│   ├── components/             # Reusable UI components
│   │   ├── Coordinator/        # Coordinator-specific components
│   │   ├── Dean/              # Dean-specific components
│   │   ├── Department_Head/   # Department Head components
│   │   ├── Professor/         # Professor components
│   │   ├── forms/             # Violation form components
│   │   └── ...                # Other shared components
│   ├── layouts/               # Layout components for different roles
│   │   ├── layout.jsx         # Main layout
│   │   ├── Dean_layout.jsx
│   │   ├── DepartmentHead_layout.jsx
│   │   ├── Professor_layout.jsx
│   │   └── Coordinator_Layout.jsx
│   ├── routes/                # Page components
│   │   ├── Coordinator/
│   │   ├── Dean/
│   │   ├── Department_head/
│   │   ├── Professor/
│   │   └── ...                # Other route components
│   └── utils/                 # Utility functions
├── package.json
├── vite.config.js
├── tailwind.config.js
└── eslint.config.js
```

## Technology Stack

### Frontend Framework
- **React 18.3.1** - Core JavaScript library for building user interfaces
- **Vite 6.2.1** - Build tool and development server
- **React Router DOM 6.26.2** - Client-side routing

### UI Framework & Styling
- **Material-UI (MUI) 6.1.2** - React component library with Material Design
- **MUI X-Charts 7.18.0** - Data visualization components
- **Tailwind CSS 3.4.13** - Utility-first CSS framework
- **Framer Motion 12.4.2** - Animation library
- **Emotion 11.13.3** - CSS-in-JS library (used by MUI)

### State Management & Data Handling
- **Axios 1.8.3** - HTTP client for API requests
- **React Context API** - Authentication state management

### Additional Libraries
- **Moment.js 2.30.1** - Date and time manipulation
- **React Dropzone 14.3.5** - File upload functionality
- **React Spinners 0.17.0** - Loading indicators
- **HTML5-QRCode 2.3.8** - QR code scanning functionality
- **dotenv 16.4.5** - Environment variable management

### Development Tools
- **ESLint 9.9.0** - Code linting and formatting
- **PostCSS 8.4.47** - CSS processing
- **Autoprefixer 10.4.20** - CSS vendor prefixing

## Key Features

### 1. Role-Based Access Control
The system supports multiple user roles with different permissions:
- **Dean** - Overall system administration
- **Department Head** - Department-level oversight and analytics
- **Professor** - Student violation reporting
- **Coordinator** - Form management and student coordination

### 2. Authentication & Authorization
- JWT-based authentication with access tokens
- Protected routes for different user roles
- Automatic token management and refresh
- Session persistence using localStorage

### 3. Violation Management
- Complete CRUD operations for student violations
- Multiple violation form types:
  - Student Incident Report
  - Formal Complaint Letter
  - Letter of Suspension
  - Written Warning/Reprimand
  - Temporary Gate Pass
  - Non-Wearing of Uniform Request
  - Notice of Case Dismissal
  - Call Slip

### 4. QR Code Scanning
- Real-time QR code scanning for student identification
- Integration with student database for quick data retrieval
- HTML5-QRCode library for cross-platform compatibility

### 5. Data Visualization
- Monthly violation trends using MUI X-Charts
- Department-wise violation analytics
- Interactive bar charts and statistical reports

### 6. Document Generation
- Template-based document generation
- Integration with Word document templates
- Automated form filling with student data

### 7. Notification System
- Real-time notifications for violation updates
- Role-specific notification feeds
- Alert messaging system

## API Integration

### Backend Connection
- **Base URL**: `https://fastapi-student-discipline-api.onrender.com`
- RESTful API architecture
- JWT authentication headers
- CORS configuration for cross-origin requests

### Key API Endpoints
- `/auth/login` - User authentication
- `/students` - Student data management
- `/violations` - Violation records CRUD
- `/notifications` - Notification management
- `/reports` - Report generation

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation Commands
```bash
# Clone the repository
git clone https://github.com/shiinaneet/ViolationWebReactApp.git
cd ViolationWebReactApp

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Configuration

### Vite Configuration
- Path aliases for cleaner imports (`@components`, `@src`)
- Console and debugger statements removed in production builds
- React plugin integration

### Tailwind CSS Configuration
- Custom screen sizes (ss: 320px for small screens)
- Custom shadow utilities (huge shadow variant)
- Responsive design utilities

### ESLint Configuration
- React 18.3 compatibility
- Hooks and refresh plugins
- Recommended JavaScript and React rules

## Security Features

### Authentication Security
- JWT token-based authentication
- Protected route implementation
- Token storage in localStorage
- Automatic token injection in API requests

### CORS Configuration
- Cross-origin resource sharing setup
- Header-based security measures
- API request interception

## Performance Optimizations

### Build Optimizations
- Vite's fast HMR (Hot Module Replacement)
- ESBuild for rapid bundling
- Console statement removal in production
- Tree shaking for unused code elimination

### Code Splitting
- Route-based code splitting
- Lazy loading of components
- Optimized bundle sizes

## Responsive Design

### Mobile-First Approach
- Tailwind CSS responsive utilities
- Custom breakpoints for different screen sizes
- Touch-friendly interface components
- Optimized layouts for mobile devices

### Cross-Browser Compatibility
- Modern browser support
- Progressive enhancement approach
- Fallback mechanisms for older browsers

## Deployment

### Production Build
- Optimized asset bundling
- Environment-specific configurations
- Static asset optimization

### Live Deployment
- **Website**: https://react.shiinaneet.site/
- **Deployment Platform**: Nginx on Ubuntu
- **API Backend**: FastAPI on Render.com

## Future Enhancements

### Planned Features
- Real-time chat functionality
- Advanced analytics dashboard
- Mobile application development
- Integration with student information systems
- Automated email notifications
- Document e-signature capabilities

### Technical Improvements
- TypeScript migration
- Advanced state management (Redux/Zustand)
- Progressive Web App (PWA) features
- Offline functionality
- Enhanced security measures

## Contributing Guidelines

### Code Standards
- ESLint configuration for code quality
- React best practices adherence
- Component-based architecture
- Proper error handling and logging

### Git Workflow
- Feature branch development
- Pull request reviews
- Automated testing integration
- Semantic versioning

## Contact Information

- **Developer**: Gene Paolo Dayandayan
- **Email**: dayandayangenepaolo@gmail.com
- **GitHub**: https://github.com/ShiinaNeet
- **Project Repository**: https://github.com/shiinaneet/ViolationWebReactApp

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Last Updated: October 2025*