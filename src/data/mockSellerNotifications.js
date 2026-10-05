export const initialSellerNotifications = [
  {
    id: "notif-01",
    sellerId: "usr-seller-02", // Green Valley
    title: "Product Approved & Published",
    message: "Your product 'A2 Kangayam Cow Fresh Milk' has been approved by MilkMart Admin and is now live on the marketplace!",
    type: "success",
    timestamp: "10 mins ago",
    read: false,
    link: "/seller/products"
  },
  {
    id: "notif-02",
    sellerId: "usr-seller-02",
    title: "New Sunrise Order Received",
    message: "New order #MM-98245 for 2L A2 Cow Milk received for tomorrow morning's sunrise delivery slot.",
    type: "order",
    timestamp: "25 mins ago",
    read: false,
    link: "/seller/orders"
  },
  {
    id: "notif-03",
    sellerId: "usr-seller-02",
    title: "Inventory Alert: Low Stock",
    message: "Your available inventory for 'Farm Fresh Paneer (200g)' has dropped to 8 units. Consider updating stock.",
    type: "warning",
    timestamp: "2 hours ago",
    read: true,
    link: "/seller/inventory"
  },
  {
    id: "notif-04",
    sellerId: "usr-seller-02",
    title: "Farm Profile Verified ✓",
    message: "Green Valley Dairy Farm has been officially verified with FSSAI accreditation #12421003000542.",
    type: "verified",
    timestamp: "Yesterday",
    read: true,
    link: "/seller/farm"
  },
  {
    id: "notif-05",
    sellerId: "usr-seller-01", // Gir Amrit
    title: "Morning Procurement Dispatched",
    message: "Batch #BATCH-GIR-9042 (320 Liters) was picked up by Fleet Van KA01-EK-4501.",
    type: "success",
    timestamp: "3 hours ago",
    read: false,
    link: "/seller/orders"
  },
  {
    id: "notif-06",
    sellerId: "usr-seller-03", // Sri Lakshmi
    title: "New Order for Country Eggs",
    message: "Order #MM-98110 for 2 packs of Country Free-Range Eggs confirmed.",
    type: "order",
    timestamp: "1 hour ago",
    read: false,
    link: "/seller/orders"
  }
];
