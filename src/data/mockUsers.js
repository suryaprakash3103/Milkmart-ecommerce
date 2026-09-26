import { initialAddresses } from './mockAddresses';

export const mockUsers = [
  {
    id: "usr-admin-01",
    email: "admin@milkmart.farm",
    password: "admin123",
    role: "admin",
    name: "Aditi Rao (Operations Master)",
    phone: "+91 98450 00001",
    avatar: "/images/users/avatar.jpg",
    department: "Central Dairy Processing & Cold Chain Fleet",
    assignedHub: "Kengeri Chiller & Pasteurization Facility"
  },
  {
    id: "usr-del-01",
    email: "ramesh.delivery@milkmart.farm",
    password: "partner123",
    role: "delivery",
    name: "Ramesh Kumar",
    phone: "+91 98765 43210",
    avatar: "/images/users/avatar.jpg",
    vehicleType: "Electric Chilled Van (KA01-EK-4501)",
    route: "Route 4B - HSR Layout & Koramangala",
    rating: 4.92,
    shift: "Sunrise Run (5:30 AM – 7:30 AM)",
    completedDeliveries: 1240,
    bottlesCollectedCount: 382
  },
  {
    id: "usr-del-02",
    email: "suresh.delivery@milkmart.farm",
    password: "partner123",
    role: "delivery",
    name: "Suresh Patil",
    phone: "+91 98112 34567",
    avatar: "/images/users/avatar.jpg",
    vehicleType: "Chilled Loader 3-Wheeler (KA05-EV-8822)",
    route: "Route 2A - Indiranagar & Domlur",
    rating: 4.88,
    shift: "Sunrise Run (5:30 AM – 7:30 AM)",
    completedDeliveries: 890,
    bottlesCollectedCount: 245
  },
  {
    id: "usr-cust-01",
    email: "surya.prakash@example.com",
    password: "password123",
    role: "customer",
    name: "Surya Prakash",
    phone: "+91 98450 12345",
    avatar: "/images/users/avatar.jpg",
    walletBalance: 1250,
    bottlesReturnedTotal: 18,
    savedAddresses: initialAddresses
  },
  {
    id: "usr-cust-02",
    email: "priya.sharma@example.com",
    password: "password123",
    role: "customer",
    name: "Priya Sharma",
    phone: "+91 98200 54321",
    avatar: "/images/users/avatar.jpg",
    walletBalance: 840,
    bottlesReturnedTotal: 12,
    savedAddresses: [
      {
        id: "addr-02",
        tag: "Home",
        name: "Priya Sharma",
        phone: "+91 98200 54321",
        house: "Flat 402, Green Glen Palms",
        street: "Bellandur Outer Ring Road",
        area: "Bellandur",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560103",
        isDefault: true,
        instructions: "Leave in insulated doorstep pouch hanging on outer latch. Please do not ring bell before 7 AM."
      }
    ]
  }
];
