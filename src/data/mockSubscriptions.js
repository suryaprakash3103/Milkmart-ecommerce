export const initialSubscriptions = [
  {
    id: "SUB-8812",
    productId: "milk-01",
    productName: "Farm Fresh A2 Gir Cow Raw Milk",
    brand: "MilkMart Pure Farm",
    image: "/images/products/milk-a2.jpg",
    size: "1 L",
    quantity: 1,
    frequency: "Daily", // Daily, Alternate Day, Weekly, Custom
    pricePerDay: 76.5, // 10% subscription discount applied!
    originalPricePerDay: 85,
    status: "Active", // Active, Paused, Cancelled
    nextDeliveryDate: "Tomorrow (Sep 19)",
    timeSlot: "Morning Run (5:30 AM – 7:30 AM)",
    deliveryAddress: "Flat 402, Green Meadows, HSR Layout, Bengaluru",
    startDate: "2026-08-01",
    totalDeliveriesDone: 48,
    bottlesPendingReturn: 2,
    customSchedule: {
      mon: 1, tue: 1, wed: 1, thu: 1, fri: 1, sat: 2, sun: 2
    },
    doorstepInstructions: "Leave inside insulated pouch"
  },
  {
    id: "SUB-8845",
    productId: "curd-01",
    productName: "Artisanal Clay-Pot Set Dahi",
    brand: "MilkMart Pure Farm",
    image: "/images/products/curd-clay.jpg",
    size: "500 g",
    quantity: 1,
    frequency: "Alternate Day",
    pricePerDay: 67.5,
    originalPricePerDay: 75,
    status: "Active",
    nextDeliveryDate: "Sep 20",
    timeSlot: "Morning Run (5:30 AM – 7:30 AM)",
    deliveryAddress: "Flat 402, Green Meadows, HSR Layout, Bengaluru",
    startDate: "2026-08-15",
    totalDeliveriesDone: 18,
    bottlesPendingReturn: 0,
    customSchedule: null,
    doorstepInstructions: "Ring bell softly"
  }
];
