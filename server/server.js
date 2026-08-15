import express from "express";
import cors from "cors";

const app = express();
app.use(cors()); // Allows your React app to communicate with this API
app.use(express.json());

// --- SIMULATED DATABASE ---
// In a real app, you would query MongoDB, MySQL, or PostgreSQL here.
const usersDB = {
  "251FA04I95": {
    role: "student",
    phone: "+917989429253",
    email: "251fa04i95@vignan.ac.in", // Added a dummy email
  },
  DRV001: {
    role: "driver",
    phone: "+919876543210",
    email: "driver1@vignan.ac.in",
  },
};

// Memory store for active OTPs (ID -> { otp, expiresAt })
const activeOTPs = new Map();

// POST: Request OTP
app.post("/api/auth/request-otp", async (req, res) => {
  const { idNumber, method, role } = req.body;

  if (!idNumber) {
    return res.status(400).json({ error: "ID is required" });
  }

  // 1. Validate & Normalize Data (Handle case-insensitivity)
  const normalizedId = idNumber.trim().toUpperCase();
  const user = usersDB[normalizedId];

  // 2. Check if user exists in the database and matches the requested role
  if (!user) {
    return res.status(404).json({ error: "User not found in the database." });
  }
  if (user.role !== role) {
    return res
      .status(403)
      .json({ error: `This ID is not registered as a ${role}.` });
  }

  // 3. Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP for 5 minutes
  activeOTPs.set(normalizedId, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  // 4. "Send" the OTP
  try {
    if (method === "whatsapp") {
      // TODO: Call Meta WhatsApp API here
      console.log(
        `[WhatsApp API Simulated] Sending OTP ${otp} to ${user.phone}`,
      );
    } else if (method === "email") {
      // TODO: Call Nodemailer/Resend API here
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

// POST: Verify OTP
app.post("/api/auth/verify-otp", (req, res) => {
  const { idNumber, otp } = req.body;
  const normalizedId = idNumber.trim().toUpperCase();

  const record = activeOTPs.get(normalizedId);

  // 1. Check if an OTP was ever requested
  if (!record) {
    return res
      .status(400)
      .json({ error: "No active OTP found. Please request a new one." });
  }

  // 2. Check for expiration
  if (Date.now() > record.expiresAt) {
    activeOTPs.delete(normalizedId);
    return res.status(400).json({ error: "OTP has expired." });
  }

  // 3. Authorize the OTP
  if (record.otp !== otp) {
    return res.status(401).json({ error: "Invalid OTP entered." });
  }

  // 4. Success! Clear the OTP and log the user in
  activeOTPs.delete(normalizedId);
  const user = usersDB[normalizedId];

  console.log(`[LOGIN SUCCESS] ${normalizedId} authorized successfully.`);

  return res.status(200).json({
    message: "Login authorized",
    user: { id: normalizedId, role: user.role },
    // Note: In production, you would send a JWT token back here.
  });
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Backend server running on http://localhost:${PORT}`),
);