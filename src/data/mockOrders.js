export const initialOrders = [
  {
    id: "MM-98241",
    date: "2026-09-18",
    status: "Out for Delivery",
    estimatedDelivery: "Today, 6:45 AM",
    timeSlot: "Morning Run: 5:30 AM – 7:30 AM",
    items: [
      {
        id: "milk-01",
        name: "Farm Fresh A2 Gir Cow Raw Milk",
        size: "1 L",
        price: 85,
        quantity: 2,
        image: "/images/products/milk-a2.jpg"
      },
      {
        id: "curd-01",
        name: "Artisanal Clay-Pot Set Dahi",
        size: "500 g",
        price: 75,
        quantity: 1,
        image: "/images/products/curd-clay.jpg"
      }
    ],
    deliveryAddress: {
      tag: "Home",
      name: "Surya Prakash",
      phone: "+91 98450 12345",
      house: "Flat 402, Green Meadows",
      street: "14th Main, 4th Sector, HSR Layout",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560102",
      dropInstruction: "Leave inside insulated doorstep pouch. Ring bell once softly."
    },
    paymentMethod: "MilkMart Wallet",
    paymentStatus: "Paid",
    subtotal: 245,
    discount: 25,
    deliveryFee: 0,
    bottleDeposit: 0,
    total: 220,
    deliveryPartner: {
      name: "Ramesh Kumar",
      phone: "+91 98765 43210",
      route: "Route 4B - HSR & Koramangala",
      vehicle: "EV Chilled Delivery Van #KA01-EK-4501"
    },
    timeline: [
      { title: "Order Placed", time: "Sep 17, 9:15 PM", completed: true },
      { title: "Confirmed & Batch Allocated", time: "Sep 17, 9:30 PM", completed: true },
      { title: "Milked & Chilled at 3.8°C", time: "Sep 18, 4:45 AM", completed: true },
      { title: "Packed in Insulated Bag", time: "Sep 18, 5:15 AM", completed: true },
      { title: "Out for Morning Delivery", time: "Sep 18, 5:40 AM", completed: true, active: true },
      { title: "Delivered to Doorstep Pouch", time: "Expected 6:45 AM", completed: false }
    ],
    bottlesReturned: 2,
    walletCreditPending: 20
  },
  {
    id: "MM-97910",
    date: "2026-09-15",
    status: "Delivered",
    estimatedDelivery: "Sep 16, 6:15 AM",
    timeSlot: "Morning Run: 5:30 AM – 7:30 AM",
    items: [
      {
        id: "ghee-01",
        name: "Vedic A2 Gir Cow Bilona Cultured Ghee",
        size: "500 ml",
        price: 1450,
        quantity: 1,
        image: "/images/products/ghee-bilona.jpg"
      },
      {
        id: "paneer-01",
        name: "Artisanal Fresh Malai Paneer (Cow Milk)",
        size: "500 g",
        price: 230,
        quantity: 1,
        image: "/images/products/paneer-malai.jpg"
      }
    ],
    deliveryAddress: {
      tag: "Home",
      name: "Surya Prakash",
      phone: "+91 98450 12345",
      house: "Flat 402, Green Meadows",
      street: "14th Main, 4th Sector, HSR Layout",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560102",
      dropInstruction: "Doorstep drop box."
    },
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "Paid",
    subtotal: 1680,
    discount: 150,
    deliveryFee: 0,
    bottleDeposit: 0,
    total: 1530,
    deliveryPartner: {
      name: "Ramesh Kumar",
      phone: "+91 98765 43210",
      route: "Route 4B",
      vehicle: "KA01-EK-4501"
    },
    timeline: [
      { title: "Order Placed", time: "Sep 15, 6:10 PM", completed: true },
      { title: "Confirmed", time: "Sep 15, 6:30 PM", completed: true },
      { title: "Chilled & Packed", time: "Sep 16, 4:50 AM", completed: true },
      { title: "Out for Delivery", time: "Sep 16, 5:35 AM", completed: true },
      { title: "Delivered to Doorstep", time: "Sep 16, 6:12 AM", completed: true }
    ],
    bottlesReturned: 1,
    walletCreditPending: 0
  }
];
