# 🚀 CodeGuard - Code Quality Platform

એક AI-Powered Code Quality Analysis Platform જે તમારા React project ની files ને analyze કરે છે, errors શોધે છે, અને optimized code suggestions આપે છે.

## ✨ Features

### 🔍 Deep Code Analysis
- **Comprehensive File Scanning**: બધી JavaScript, TypeScript, React, CSS files ને scan કરે છે
- **Error Detection**: Syntax errors, missing imports, અને common mistakes શોધે છે
- **Code Quality Score**: દરેક file માટે 0-100 quality score આપે છે

### ⚡ Smart Error Detection
- Missing React imports
- Console.log statements in production
- Usage of `var` instead of `const/let`
- Missing `key` prop in list items
- TODO/FIXME comments
- Class components detection

### ✨ Optimization Suggestions
- **Auto-Fix Available**: કેટલાક errors automatic fix થઈ શકે છે
- **Modernization Tips**: Class components ને functional components માં convert કરવા
- **Performance Improvements**: Inline styles ને CSS modules માં move કરવા
- **Best Practices**: React અને JavaScript best practices follow કરવા

### 🛠️ Auto-Fix Capability
- Console.log statements remove કરવા
- `var` ને `const/let` માં replace કરવા
- Missing imports add કરવા

## 🎨 UI Features

### Glassmorphism Design
- Modern, premium glassmorphic UI
- Vibrant color gradients
- Smooth animations and transitions
- Responsive design

### Interactive Elements
- Drag-and-drop file upload
- Expandable analysis sections
- Real-time analysis progress
- Color-coded issue indicators

## 🚀 Getting Started

### Installation

```bash
# Dependencies install કરો
npm install

# Development server start કરો
npm run dev
```

### Usage

1. **Upload Files**: 
   - Drag and drop your project files
   - અથવા "Choose Files" button ક્લિક કરો
   - Supported formats: `.js`, `.jsx`, `.ts`, `.tsx`, `.css`, `.html`, `.json`

2. **Analyze**:
   - "Analyze Code Quality" button ક્લિક કરો
   - Platform તમારી બધી files ને analyze કરશે

3. **Review Results**:
   - Overall quality score જુઓ
   - Detailed file-by-file analysis review કરો
   - Issues અને suggestions વાંચો
   - Auto-fix suggestions implement કરો

## 📊 Analysis Report Includes

### Summary Section
- Total files analyzed
- Average quality score
- Total errors count
- Total warnings count
- Total lines of code
- Overall status (Passed/Failed)

### Per-File Analysis
- Quality score (0-100)
- Line count
- Error count with details
- Warning count with details
- Optimization suggestions
- Auto-fix recommendations

### Issue Types
- 🔴 **Errors**: Critical issues that need immediate attention
- 🟡 **Warnings**: Issues that should be reviewed
- 🔵 **Info**: Informational notices

### Suggestion Categories
- **Optimization**: Performance improvements
- **Modernization**: Modern JavaScript/React patterns
- **Maintainability**: Code organization improvements
- **Performance**: Runtime performance tips

## 🎯 Supported File Types

- **JavaScript**: `.js`
- **React**: `.jsx`
- **TypeScript**: `.ts`
- **TSX**: `.tsx`
- **CSS**: `.css`
- **HTML**: `.html`
- **JSON**: `.json`

## 🔧 Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Vanilla CSS with Glassmorphism
- **Build Tool**: Vite (SWC)
- **Code Analysis**: Custom JavaScript parser

## 📝 Development

### Project Structure

```
code-quality-platform/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Header with navigation
│   │   ├── FileUploader.jsx        # File upload and analysis logic
│   │   ├── AnalysisResults.jsx     # Results display component
│   │   └── *.css                   # Component styles
│   ├── App.jsx                     # Main app component
│   ├── App.css                     # App styles
│   ├── index.css                   # Global styles and design system
│   └── main.jsx                    # Entry point
├── public/                         # Static assets
├── index.html                      # HTML template
├── package.json                    # Dependencies
└── vite.config.js                  # Vite configuration
```

### Build for Production

```bash
npm run build
```

આ `dist/` folder માં production-ready files બનાવશે.

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (#667eea → #764ba2)
- **Secondary**: Pink gradient (#f093fb → #f5576c)
- **Success**: Blue gradient (#4facfe → #00f2fe)
- **Warning**: Yellow gradient (#fa709a → #fee140)
- **Error**: Red gradient (#ff6b6b → #ee5a6f)

### Glassmorphism Effects
- Backdrop blur: 20px
- Background: Semi-transparent white
- Border: Subtle white borders
- Shadows: Layered depth shadows

## 🌟 Future Enhancements

- [ ] Backend API integration for more complex analysis
- [ ] Support for more file types
- [ ] Git integration for commit analysis
- [ ] AI-powered code suggestions
- [ ] Export analysis reports (PDF/JSON)
- [ ] Project history tracking
- [ ] Team collaboration features
- [ ] Custom rule configuration
- [ ] Integration with CI/CD pipelines

## 📄 License

MIT License - Feel free to use this project!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

---

Made with ❤️ using React and Glassmorphism Design
