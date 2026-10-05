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
  },
  {
    id: "usr-seller-01",
    email: "farmer.patel@milkmart.farm",
    password: "farmer123",
    role: "seller",
    name: "Devendra Patel",
    farmName: "Gir Amrit Organic Gaushala",
    phone: "+91 97123 45678",
    avatar: "/images/users/avatar.jpg",
    location: "Kengeri Valley Dairy Pastures, Bengaluru West",
    fssaiLicense: "11223344556677",
    cattleCount: 48,
    cattleBreed: "Purebred Gir Cows & Murrah Buffaloes",
    dailyCapacityLiters: 350,
    walletBalance: 24500, // Accumulated procurement payout
    rating: 4.95,
    certifications: ["FSSAI Organic Certified", "A2 Genetic Purity Lab Verified", "Zero Antibiotic Residue"],
    bankAccount: {
      accountNumber: "XXXX-XXXX-8921",
      ifsc: "HDFC0001244",
      bankName: "HDFC Bank (Kengeri Branch)"
    }
  },
  {
    id: "usr-seller-02",
    email: "murugan.farm@milkmart.farm",
    password: "farmer123",
    role: "seller",
    name: "K. Murugan",
    farmName: "Green Valley Dairy Farm",
    farmId: "farm-green-valley",
    phone: "+91 94432 10987",
    avatar: "/images/users/avatar.jpg",
    location: "Pollachi Road, Coimbatore, Tamil Nadu",
    district: "Coimbatore",
    state: "Tamil Nadu",
    pincode: "641109",
    fssaiLicense: "12421003000542",
    sellerType: "Dairy Farmer",
    cattleCount: 60,
    dailyCapacityLiters: 420,
    walletBalance: 38200,
    rating: 4.9,
    bankAccount: {
      accountNumber: "XXXX-XXXX-4412",
      ifsc: "SBIN0001822",
      bankName: "State Bank of India (Coimbatore Main)"
    }
  },
  {
    id: "usr-seller-03",
    email: "lakshmi.farm@milkmart.farm",
    password: "farmer123",
    role: "seller",
    name: "Lakshmi Narayanan",
    farmName: "Sri Lakshmi Organic Farm",
    farmId: "farm-sri-lakshmi",
    phone: "+91 98421 87654",
    avatar: "/images/users/avatar.jpg",
    location: "Alagar Kovil Valley, Madurai, Tamil Nadu",
    district: "Madurai",
    state: "Tamil Nadu",
    pincode: "625301",
    fssaiLicense: "12418002000891",
    sellerType: "Organic Farm",
    cattleCount: 45,
    dailyCapacityLiters: 310,
    walletBalance: 21400,
    rating: 4.85,
    bankAccount: {
      accountNumber: "XXXX-XXXX-7709",
      ifsc: "IOBA0000412",
      bankName: "Indian Overseas Bank (Madurai Branch)"
    }
  }
];

