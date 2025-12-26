# Property Booking System - TDD Project

A property booking system built with **Test-Driven Development (TDD)** practices, implementing Clean Architecture patterns with TypeScript, Express, and TypeORM.

## Project Background

This project was developed as part of the **Full Cycle** course's TDD module. The base implementation includes domain entities, repositories, and basic CRUD operations. I completed the technical challenge and added significant refactoring improvements to demonstrate professional software engineering practices.

### Course Repository
Original course repository: [https://github.com/devfullcycle/fc4-tdd](https://github.com/devfullcycle/fc4-tdd)

---

## Technical Challenge - Requirements ✅

The course's final technical challenge required implementing the following tests and features using TDD:

### 1. ✅ Unit Tests for Mappers
- [x] `propertyMapper.test.ts` - Property entity/persistence conversion tests
- [x] `bookingMapper.test.ts` - Booking entity/persistence conversion tests
- [x] Validation for missing required fields
- [x] Bidirectional mapping tests (domain ↔ persistence)

### 2. ✅ E2E Tests for User Creation
- [x] `userController.test.ts` - User creation endpoint tests
- [x] Success scenario (201 Created)
- [x] Validation error scenarios (400 Bad Request)
- [x] Implemented `UserService.createUser()` method

### 3. ✅ E2E Tests for Property Creation
- [x] `propertyControllerE2E.test.ts` - Property creation endpoint tests
- [x] Success scenario (201 Created)
- [x] Validation for empty title, invalid price, and zero max guests
- [x] Implemented `PropertyService.createProperty()` method
- [x] Added `basePricePerNight` validation in Property entity

### 4. ✅ Refund Policy Tests
- [x] `refund_rule.factory.test.ts` - Refund policy factory tests
- [x] Full refund (>7 days before check-in)
- [x] Partial refund (1-7 days before check-in)
- [x] No refund (<1 day before check-in)

### 5. ✅ Booking Cancellation Tests
- [x] Test for canceling non-existent booking
- [x] Error message: "Booking not found"

**Challenge Status:** ✅ **100% Complete**

---

## My Contributions & Improvements

Beyond the course material and technical challenge, I made the following professional refactoring improvements:

### Architecture Refactoring
- **Mapper Pattern**: Refactored all mappers from static classes to pure functions (functional programming approach)
- **Factory Pattern**: Implemented context-aware factory pattern with `isTesting` flag for all test utilities
- **Dependency Injection**: Built comprehensive Test Container pattern for E2E test setup
- **Circular Dependency Resolution**: Fixed circular dependencies in mapper layer

### Bug Fixes
- Fixed factory pattern providing test defaults in production code
- Fixed FakeBookingRepository creating duplicates on update operations
- Resolved SQLite database handle closure issues in E2E tests

### Test Infrastructure
- Created test seeder utilities for database fixtures
- Configured Jest for sequential E2E execution (preventing database conflicts)
- Implemented proper unit test mocking with real domain objects
- Added comprehensive test coverage across all layers (Unit, Integration, E2E)

### Code Quality
- Applied clean code principles and separation of concerns
- Improved type safety (removed `as any` type assertions)
- Enhanced test clarity with Arrange-Act-Assert pattern
- Added descriptive comments explaining business logic

---

This project follows **Clean Architecture** principles with clear layer separation:

```
src/
├── domain/                      # Business Logic Layer
│   ├── entities/               # Domain entities (Property, User, Booking)
│   ├── value_objects/          # Value objects (DateRange)
│   ├── repositories/           # Repository interfaces
│   └── cancelation/            # Refund policy domain logic
│
├── application/                 # Application Layer
│   ├── services/               # Use cases and business orchestration
│   └── dtos/                   # Data Transfer Objects
│
├── infrastructure/              # Infrastructure Layer
│   ├── persistence/
│   │   ├── entities/          # TypeORM entities
│   │   └── mappers/           # Domain ↔ Persistence mapping
│   ├── repositories/          # TypeORM repository implementations
│   └── web/                   # Express controllers and HTTP layer
│
└── utils/                      # Shared utilities and test helpers
    └── tests/                 # Test infrastructure (containers, seeders)
```

---

## Testing Strategy

This project demonstrates a comprehensive testing approach with **87 tests** across three levels:

### Test Pyramid

```
         /\
        /  \  E2E Tests (3 files)
       /____\  ← HTTP + Database + Full Stack
      /      \
     / Integ. \ Integration Tests (6 files)
    /__________\ ← Real services + In-memory repositories
   /            \
  /  Unit Tests  \ Unit Tests (9 files)
 /________________\ ← Isolated with mocks
```

### Test Coverage by Layer

| Layer | Test Type | Count | Purpose |
|-------|-----------|-------|---------|
| **Domain Entities** | Unit | 4 | Business logic validation |
| **Mappers** | Unit | 3 | Bidirectional conversion |
| **Services** | Unit | 3 | Service orchestration with mocks |
| **Repositories** | Integration | 3 | Database operations |
| **Controllers** | E2E | 3 | Full HTTP request/response cycle |
| **Refund Policies** | Unit | 2 | Cancellation business rules |

**Total:** 18 test suites, 87 tests

---

## Tech Stack

- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** SQLite (with TypeORM ORM)
- **Testing:** Jest + Supertest
- **Code Quality:** Biome (linter + formatter)
- **Architecture:** Clean Architecture + DDD patterns

---

## Installation & Setup

### Prerequisites
- Node.js >= 18.x
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- userService.test.ts

# Watch mode
npm test -- --watch
```
```

---

## 🎓 Key Learnings & Patterns Demonstrated

### Test-Driven Development (TDD)
- Red-Green-Refactor cycle
- Writing tests before implementation
- Using tests as design documentation

### Design Patterns
- **Repository Pattern**: Abstract data access layer
- **Factory Pattern**: Context-aware object creation
- **Mapper Pattern**: Separate domain from persistence concerns
- **Dependency Injection**: Loosely coupled components
- **Test Container Pattern**: Reusable test infrastructure

### Clean Code Principles
- Single Responsibility Principle
- Dependency Inversion Principle
- Pure functions over stateful classes
- Explicit over implicit behavior

### Testing Best Practices
- Arrange-Act-Assert pattern
- Test isolation and independence
- Mocking dependencies correctly (mock services, not domain objects)
- Realistic test data with factories
- Comprehensive edge case coverage

---

## Test Results

```
Test Suites: 18 passed, 18 total
Tests:       87 passed, 87 total
Snapshots:   0 total
Time:        2.418s
```

### Coverage Highlights
- ✅ Domain entities: 100% coverage
- ✅ Mappers: 100% coverage
- ✅ Service layer: Comprehensive unit + integration tests
- ✅ E2E tests: Critical user journeys covered
- ✅ Business rules: All refund policies tested

---

## Recent Improvements (Changelog)

### Testing Improvements
- Refactored service layer tests to use proper mocking with real domain objects
- Fixed `FakeBookingRepository` bug where updates created duplicates
- Added edge case tests for guest count validation and double-cancellation
- Improved test clarity with descriptive comments and AAA pattern

### Architecture Refactoring
- Converted all mappers from static classes to pure functions
- Implemented `isTesting` flag pattern across all factory utilities
- Created comprehensive test infrastructure (TestContainer, seeders)
- Fixed circular dependencies in mapper layer

### Bug Fixes
- Fixed factory pattern providing test defaults in production code
- Configured Jest for sequential E2E execution (preventing SQLite conflicts)
- Fixed database handle closure issues in E2E tests

---

## Acknowledgments

- **Full Cycle** course for the TDD module and technical challenge
- Course repository: [https://github.com/devfullcycle/fc4-tdd](https://github.com/devfullcycle/fc4-tdd)

---

## Contact

Feel free to reach out if you have questions about the implementation or testing strategies used in this project.

---

**Note:** This project demonstrates professional software engineering practices through Test-Driven Development, Clean Architecture, and comprehensive testing strategies. While the base implementation came from the Full Cycle course, the refactoring improvements and testing enhancements showcase independent problem-solving and software craftsmanship skills.
