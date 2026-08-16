// server/server.js
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your React app's address
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// --- SIMULATED USER DATABASE (Auth) ---
const usersDB = {
  "251FA04I95": {
    role: "student",
    phone: "+917989429253",
    email: "251fa04i95@vignan.ac.in",
  },
  DRV001: {
    role: "driver",
    phone: "+919876543210",
    email: "driver1@vignan.ac.in",
  },
  DRV002: {
    role: "driver",
    phone: "+919876543211",
    email: "driver2@vignan.ac.in",
  },
  DRV003: {
    role: "driver",
    phone: "+919876543212",
    email: "driver3@vignan.ac.in",
  },
};

// --- SIMULATED FLEET DATABASE (Real-time telemetry & metadata) ---
const fleetDB = {
  "AP-16-TZ-9921": {
    busNumber: "AP-16-TZ-9921",
    routeName: "Campus To TRR Hostel",
    fromLocation: "Campus Depot (N-Block)",
    toLocation: "TRR Hostel",
    driverName: "K. Ramesh Babu",
    driverId: "DRV001",
    driverStatus: "idle",
    currentNextStop: "--",
    etaMinutes: 0,
    coordinates: { lat: 16.2345, lng: 80.5512 }, // Vignan University area coordinates
  },
  "AP-16-TZ-8832": {
    busNumber: "AP-16-TZ-8832",
    routeName: "Engineering Loop",
    fromLocation: "Main Gate",
    toLocation: "Engineering Block B",
    driverName: "M. Suresh Kumar",
    driverId: "DRV002",
    driverStatus: "idle",
    currentNextStop: "--",
    etaMinutes: 0,
    coordinates: { lat: 16.236, lng: 80.553 },
  },
  "AP-16-TZ-1104": {
    busNumber: "AP-16-TZ-1104",
    routeName: "Science Express",
    fromLocation: "Science Library",
    toLocation: "Hostel Alpha",
    driverName: "Ch. Venkat Rao",
    driverId: "DRV003",
    driverStatus: "idle",
    currentNextStop: "--",
    etaMinutes: 0,
    coordinates: { lat: 16.232, lng: 80.549 },
  },
};

// Memory store for active OTPs (ID -> { otp, expiresAt })
const activeOTPs = new Map();

// --- API ENDPOINTS: AUTHENTICATION ---

app.post("/api/auth/request-otp", async (req, res) => {
  const { idNumber, method, role } = req.body;

  if (!idNumber) {
    return res.status(400).json({ error: "ID is required" });
  }

  const normalizedId = idNumber.trim().toUpperCase();
  const user = usersDB[normalizedId];

  if (!user) {
    return res.status(404).json({ error: "User not found in the database." });
  }
  if (user.role !== role) {
    return res
      .status(403)
      .json({ error: `This ID is not registered as a ${role}.` });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  activeOTPs.set(normalizedId, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  try {
    if (method === "whatsapp") {
      console.log(
        `[WhatsApp API Simulated] Sending OTP ${otp} to ${user.phone}`,
      );
    } else if (method === "email") {
      console.log(`[Email API Simulated] Sending OTP ${otp} to ${user.email}`);
    }

    return res.status(200).json({
      message: "OTP sent successfully",
      maskedContact: method === "whatsapp" ? user.phone.slice(-4) : user.email,
    });
  } catch (error) {
    console.error("Failed to send OTP:", error);
    return res
      .status(500)
      .json({ error: "Failed to dispatch OTP via the selected method." });
  }
});

app.post("/api/auth/verify-otp", (req, res) => {
  const { idNumber, otp } = req.body;
  const normalizedId = idNumber.trim().toUpperCase();

  const record = activeOTPs.get(normalizedId);

  if (!record) {
    return res
      .status(400)
      .json({ error: "No active OTP found. Please request a new one." });
  }

  if (Date.now() > record.expiresAt) {
    activeOTPs.delete(normalizedId);
    return res.status(400).json({ error: "OTP has expired." });
  }

  if (record.otp !== otp) {
    return res.status(401).json({ error: "Invalid OTP entered." });
  }

  activeOTPs.delete(normalizedId);
  const user = usersDB[normalizedId];

  console.log(`[LOGIN SUCCESS] ${normalizedId} authorized successfully.`);

  return res.status(200).json({
    message: "Login authorized",
    user: { id: normalizedId, role: user.role },
  });
});

// --- API ENDPOINTS: FLEET & TRANSPORT DATA ---

// GET: Fetch all vehicles for the Admin dashboard overview
app.get("/api/fleet", (req, res) => {
  return res.status(200).json(Object.values(fleetDB));
});

// GET: Fetch details for a specific bus
app.get("/api/bus/:busNumber", (req, res) => {
  const busKey = req.params.busNumber.toUpperCase();
  const bus = fleetDB[busKey];
  if (!bus) {
    return res.status(404).json({ error: "Bus not found" });
  }
  return res.status(200).json(bus);
});

// --- REAL-TIME WEBSOCKET DISPATCHER ---
io.on("connection", (socket) => {
  console.log(`🟢 Phone/Browser Connected: ${socket.id}`);

  // When a driver broadcasts an update, save it in fleetDB and broadcast to everyone
  socket.on("driver_update", (data) => {
    console.log(`🚌 Driver Update Received for Bus [${data.busNumber}]`);

    // Update the server-side database state in memory
    if (fleetDB[data.busNumber]) {
      fleetDB[data.busNumber] = { ...fleetDB[data.busNumber], ...data };
    }

    // Shout it out to all connected students and admins
    socket.broadcast.emit("bus_location_update", data);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Phone/Browser Disconnected: ${socket.id}`);
  });
});

const PORT = 5000;
server.listen(PORT, () =>
  console.log(`Backend server running on http://localhost:${PORT}`),
);