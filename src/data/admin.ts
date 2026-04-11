import type { Order } from "@/types/order";
import type { DashboardStats, ChartDataPoint } from "@/types/admin";

export const mockOrders: Order[] = [
  {
    id: "INK-001",
    customerName: "Ahmed Khan",
    customerEmail: "ahmed@email.com",
    shippingAddress: "123 Main St, Lahore",
    items: [
      {
        productId: "INK-BLK-001",
        name: "Black Sneaker — Classic",
        image: "/shoe_black_01.jpeg",
        quantity: 1,
        price: 3500,
        size: 38,
      },
    ],
    total: 3500,
    status: "Delivered",
    date: "2025-01-15",
  },
  {
    id: "INK-002",
    customerName: "Sara Ali",
    customerEmail: "sara@email.com",
    shippingAddress: "456 Park Ave, Karachi",
    items: [
      {
        productId: "INK-BLU-001",
        name: "Blue Sneaker — Classic",
        image: "/shoe_blue_01.jpeg",
        quantity: 2,
        price: 3200,        size: 37,
      },
    ],
    total: 6400,
    status: "Shipped",
    date: "2025-01-16",
  },
  {
    id: "INK-003",
    customerName: "Usman Malik",
    customerEmail: "usman@email.com",
    shippingAddress: "789 Road, Islamabad",
    items: [
      {
        productId: "INK-BLK-003",
        name: "Black Sneaker — Side View",
        image: "/shoe_black_03.jpeg",
        quantity: 1,
        price: 3500,        size: 40,
      },
    ],
    total: 3500,
    status: "Processing",
    date: "2025-01-17",
  },
  {
    id: "INK-004",
    customerName: "Fatima Noor",
    customerEmail: "fatima@email.com",
    shippingAddress: "321 Blvd, Rawalpindi",
    items: [
      {
        productId: "INK-BLU-004",
        name: "Blue Sneaker — Style",
        image: "/shoe_blue_04.jpeg",
        quantity: 1,
        price: 3200,        size: 36,
      },
    ],
    total: 3200,
    status: "Pending",
    date: "2025-01-18",
  },
  {
    id: "INK-005",
    customerName: "Hassan Raza",
    customerEmail: "hassan@email.com",
    shippingAddress: "654 St, Faisalabad",
    items: [
      {
        productId: "INK-BLK-001",
        name: "Black Sneaker — Classic",
        image: "/shoe_black_01.jpeg",
        quantity: 3,
        price: 3500,        size: 39,
      },
    ],
    total: 10500,
    status: "Delivered",
    date: "2025-01-19",
  },
  {
    id: "INK-006",
    customerName: "Ayesha Siddiqui",
    customerEmail: "ayesha@email.com",
    shippingAddress: "987 Lane, Multan",
    items: [
      {
        productId: "INK-BLK-005",
        name: "Black Runner",
        image: "/shoe_black_05.jpeg",
        quantity: 1,
        price: 3500,
        size: 38,
      },
      {
        productId: "INK-BLU-001",
        name: "Blue Sneaker — Classic",
        image: "/shoe_blue_01.jpeg",
        quantity: 1,
        price: 3200,        size: 37,
      },
    ],
    total: 6700,
    status: "Shipped",
    date: "2025-01-20",
  },
  {
    id: "INK-007",
    customerName: "Bilal Ahmed",
    customerEmail: "bilal@email.com",
    shippingAddress: "111 Ave, Peshawar",
    items: [
      {
        productId: "INK-BLK-002",
        name: "Black Sneaker — Alt",
        image: "/shoe_black_02.jpeg",
        quantity: 2,
        price: 3500,        size: 40,
      },
    ],
    total: 7000,
    status: "Delivered",
    date: "2025-01-21",
  },
  {
    id: "INK-008",
    customerName: "Zainab Hussain",
    customerEmail: "zainab@email.com",
    shippingAddress: "222 Dr, Quetta",
    items: [
      {
        productId: "INK-BLU-002",
        name: "Blue Sneaker — Alt",
        image: "/shoe_blue_02.jpeg",
        quantity: 1,
        price: 3200,        size: 35,
      },
    ],
    total: 3200,
    status: "Processing",
    date: "2025-01-22",
  },
  {
    id: "INK-009",
    customerName: "Omar Farooq",
    customerEmail: "omar@email.com",
    shippingAddress: "333 Ct, Sialkot",
    items: [
      {
        productId: "INK-BLK-006",
        name: "Black Street",
        image: "/shoe_black_06.png",
        quantity: 1,
        price: 3500,        size: 39,
      },
    ],
    total: 3500,
    status: "Pending",
    date: "2025-01-23",
  },
  {
    id: "INK-010",
    customerName: "Maryam Nawaz",
    customerEmail: "maryam@email.com",
    shippingAddress: "444 Pl, Gujranwala",
    items: [
      {
        productId: "INK-BLK-004",
        name: "Black Sneaker — Detail",
        image: "/shoe_black_04.jpeg",
        quantity: 2,
        price: 3500,
        size: 38,
      },
    ],
    total: 7000,
    status: "Delivered",
    date: "2025-01-24",
  },
  {
    id: "INK-011",
    customerName: "Ali Shah",
    customerEmail: "ali@email.com",
    shippingAddress: "555 Rd, Abbottabad",
    items: [
      {
        productId: "INK-BLU-003",
        name: "Blue Sneaker — Light",
        image: "/shoe_blue_03.jpeg",
        quantity: 1,
        price: 3200,        size: 36,
      },
    ],
    total: 3200,
    status: "Shipped",
    date: "2025-01-25",
  },
  {
    id: "INK-012",
    customerName: "Hira Mani",
    customerEmail: "hira@email.com",
    shippingAddress: "666 St, Bahawalpur",
    items: [
      {
        productId: "INK-BLK-001",
        name: "Black Sneaker — Classic",
        image: "/shoe_black_01.jpeg",
        quantity: 1,
        price: 3500,
        size: 38,
      },
    ],
    total: 3500,
    status: "Processing",
    date: "2025-01-26",
  },
  {
    id: "INK-013",
    customerName: "Tariq Jameel",
    customerEmail: "tariq@email.com",
    shippingAddress: "777 Ave, Sargodha",
    items: [
      {
        productId: "INK-BLK-005",
        name: "Black Runner",
        image: "/shoe_black_05.jpeg",
        quantity: 2,
        price: 3500,
        size: 38,
      },
    ],
    total: 7000,
    status: "Pending",
    date: "2025-01-27",
  },
  {
    id: "INK-014",
    customerName: "Nadia Khan",
    customerEmail: "nadia@email.com",
    shippingAddress: "888 Blvd, Sahiwal",
    items: [
      {
        productId: "INK-BLU-001",
        name: "Blue Sneaker — Classic",
        image: "/shoe_blue_01.jpeg",
        quantity: 1,
        price: 3200,
        size: 38,
      },
      {
        productId: "INK-BLK-003",
        name: "Black Sneaker — Side View",
        image: "/shoe_black_03.jpeg",
        quantity: 1,
        price: 3500,
        size: 38,
      },
    ],
    total: 6700,
    status: "Delivered",
    date: "2025-01-28",
  },
  {
    id: "INK-015",
    customerName: "Kamran Akmal",
    customerEmail: "kamran@email.com",
    shippingAddress: "999 Ln, Hyderabad",
    items: [
      {
        productId: "INK-BLK-006",
        name: "Black Street",
        image: "/shoe_black_06.png",
        quantity: 3,
        price: 3500,
        size: 38,
      },
    ],
    total: 10500,
    status: "Shipped",
    date: "2025-01-29",
  },
];

export const dashboardStats: DashboardStats = {
  revenue: { value: 847500, change: 18, period: "vs last month" },
  orders: { value: 243, change: 12, period: "vs last month" },
  productsSold: { value: 412, change: 8, period: "vs last month" },
  activeCustomers: { value: 189, change: 5, period: "vs last month" },
};

export const weeklyRevenue: ChartDataPoint[] = [
  { day: "Mon", revenue: 95000 },
  { day: "Tue", revenue: 112000 },
  { day: "Wed", revenue: 88000 },
  { day: "Thu", revenue: 134000 },
  { day: "Fri", revenue: 121000 },
  { day: "Sat", revenue: 156000 },
  { day: "Sun", revenue: 141500 },
];

export const monthlyRevenue: ChartDataPoint[] = Array.from(
  { length: 30 },
  (_, i) => ({
    day: `Day ${i + 1}`,
    revenue: Math.floor(80000 + Math.random() * 80000),
  }),
);

export const quarterlyRevenue: ChartDataPoint[] = Array.from(
  { length: 90 },
  (_, i) => ({
    day: `Day ${i + 1}`,
    revenue: Math.floor(60000 + Math.random() * 100000),
  }),
);
