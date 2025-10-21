# Educational Passport System

A comprehensive blockchain-based educational passport system that provides secure, verifiable, and permanent records for academic excellence, athletic achievement, and comprehensive student profiles.

## 🎯 Features

### Core Functionality
- **Blockchain Integration**: All records are cryptographically secured and stored on a custom blockchain
- **Academic Records Management**: Add, verify, and manage academic achievements
- **Athletic Records Tracking**: Track sports achievements and athletic participation
- **Certificate Management**: Store and verify official certificates and credentials
- **Real-time Verification**: Instant verification of any record using blockchain hash or transaction ID
- **Student Profiles**: Comprehensive student profiles with verification scores

### Security Features
- **Cryptographic Hashing**: SHA-256 hashing for all records
- **Immutable Storage**: Once recorded, data cannot be altered
- **Digital Signatures**: Institution verification and endorsement
- **Merkle Tree Verification**: Efficient and secure verification process

## 🏗️ Architecture

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** icons

### Backend
- **Next.js API Routes** for server-side logic
- **Prisma ORM** with SQLite database
- **Custom Blockchain Service** for record verification
- **Cryptographic Security** with Node.js crypto module

### Database Schema
- **Students**: Core student information and blockchain addresses
- **Academic Records**: Degrees, certifications, and academic achievements
- **Athletic Records**: Sports achievements and participation
- **Certificates**: Official certificates and credentials
- **Institutions**: Educational and sports organizations
- **Verifications**: Verification history and status

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd educational-passport
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Main Dashboard
- View comprehensive student profile with verification score
- Navigate between Academic, Athletic, and Certificates tabs
- Add new academic records with blockchain verification
- Monitor verification status of all records

### Adding Academic Records
1. Navigate to the "Academic" tab
2. Click "Add Academic Record"
3. Fill in the required information:
   - Program Title
   - Degree Type
   - Field of Study
   - Institution
   - Duration
   - Grade/GPA
4. Submit to automatically create blockchain record

### Verification System
1. Navigate to [http://localhost:3000/verify](http://localhost:3000/verify)
2. Enter a blockchain hash or transaction ID
3. Click "Verify Record" to see:
   - Record validity status
   - Blockchain integrity
   - Complete record details
   - Student information

## 🔧 API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students?studentId=xxx` - Get specific student
- `POST /api/students` - Create new student

### Academic Records
- `GET /api/academic-records` - Get academic records
- `POST /api/academic-records` - Create academic record

### Athletic Records
- `GET /api/athletic-records` - Get athletic records
- `POST /api/athletic-records` - Create athletic record

### Certificates
- `GET /api/certificates` - Get certificates
- `POST /api/certificates` - Create certificate

### Verification
- `GET /api/verify?hash=xxx` - Verify by hash
- `GET /api/verify?tx=xxx` - Verify by transaction
- `POST /api/verify` - Verify record

## 🔒 Blockchain Integration

### Hash Generation
Each record type has a specific hash generation method:
- **Academic Records**: `createAcademicHash(record)`
- **Athletic Records**: `createAthleticHash(record)`
- **Certificates**: `createCertificateHash(record)`

### Verification Process
1. Calculate hash from record data
2. Compare with stored blockchain hash
3. Verify blockchain integrity
4. Return verification status

### Mining Process
- Proof-of-work system with adjustable difficulty
- Each block contains previous hash for chain integrity
- Nonce calculation for valid hash generation

## 🎨 UI Components

### Main Components
- `EducationalPassport` - Main dashboard component
- `AcademicRecordForm` - Form for adding academic records
- `RecordVerifier` - Verification interface
- `StatusBadge` - Status indication badges

### Styling
- Responsive design with mobile-first approach
- Consistent color scheme (blue, green, purple)
- Smooth transitions and hover effects
- Loading states and error handling

## 🧪 Testing

### Code Quality
```bash
npm run lint
```

### Database Operations
```bash
npm run db:push  # Push schema changes
npm run db:studio  # Open Prisma Studio
```

## 🔮 Future Enhancements

### Planned Features
- [ ] Athletic records management
- [ ] Certificate generation and PDF export
- [ ] Institution verification system
- [ ] Multi-language support
- [ ] Mobile app integration
- [ ] Advanced analytics dashboard
- [ ] Integration with external verification services

### Technical Improvements
- [ ] Real blockchain integration (Ethereum/Polygon)
- [ ] IPFS integration for document storage
- [ ] Advanced cryptographic features
- [ ] Performance optimization
- [ ] Caching layer

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ using Next.js, TypeScript, and Blockchain Technology**