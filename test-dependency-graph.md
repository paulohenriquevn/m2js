# 📊 Dependency Analysis - ./examples/ecommerce-api/src

## 🔗 Module Dependencies
### Internal Dependencies
- **UserController.ts** → `../models/User` (3x), `../services/OrderService`, `../utils/validators` (3x)
- **Product.ts** → `./User`
- **OrderService.ts** → `../models/User`, `../models/Product`, `./PaymentService`, `../utils/validators`


## 📈 Dependency Metrics
- **Total Modules**: 6
- **Total Dependencies**: 12
- **Internal Dependencies**: 12
- **External Dependencies**: 0
- **Average Dependencies per Module**: 2
- **Most Connected Module**: UserController.ts
- **Circular Dependencies**: ❌ None detected

## 🏗️ Architecture Layers
### Core Logic
- **UserController.ts** - Core functionality
- **Product.ts** - Core functionality
- **User.ts** - Core functionality
- **OrderService.ts** - Core functionality
- **PaymentService.ts** - Core functionality
- **validators.ts** - Core functionality


## 🗺️ Visual Dependency Map
```mermaid
graph TD
    UserContro0[UserController.ts]
    Product1[Product.ts]
    User2[User.ts]
    OrderServi3[OrderService.ts]
    PaymentSer4[PaymentService.ts]
    validators5[validators.ts]
    UserContro0 --> User2
    UserContro0 --> OrderServi3
    UserContro0 --> validators5
    Product1 --> User2
    OrderServi3 --> User2
    OrderServi3 --> Product1
    OrderServi3 --> PaymentSer4
    OrderServi3 --> validators5
```