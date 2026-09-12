require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

// ======================================================
// SEED / UPDATE ADMIN
// ======================================================

async function seed() {
  try {
    // --------------------------------------------------
    // 1. Check required environment variables
    // --------------------------------------------------

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env");
    }

    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL is missing from .env");
    }

    if (!process.env.ADMIN_PASSWORD) {
      throw new Error("ADMIN_PASSWORD is missing from .env");
    }

    const adminUsername =
      process.env.ADMIN_USERNAME?.trim() || "admin";

    const adminEmail =
      process.env.ADMIN_EMAIL.trim().toLowerCase();

    const adminPassword =
      process.env.ADMIN_PASSWORD;

    // --------------------------------------------------
    // 2. Connect to MongoDB
    // --------------------------------------------------

    await mongoose.connect(process.env.MONGO_URI);

    console.log("======================================");
    console.log("MongoDB connected successfully");
    console.log("Database:", mongoose.connection.name);
    console.log("Admin username:", adminUsername);
    console.log("Admin email from .env:", adminEmail);
    console.log("======================================");

    // --------------------------------------------------
    // 3. Hash the new admin password
    // --------------------------------------------------

    const passwordHash = await bcrypt.hash(
      adminPassword,
      12
    );

    // --------------------------------------------------
    // 4. Find existing admin
    // --------------------------------------------------

    let admin = await User.findOne({
      username: "admin",
    });

    // Also try finding through email if username wasn't found
    if (!admin) {
      admin = await User.findOne({
        email: adminEmail,
      });
    }

    // --------------------------------------------------
    // 5. Update existing admin
    // --------------------------------------------------

    if (admin) {
      console.log("Existing admin found.");
      console.log("Old username:", admin.username);
      console.log("Old email:", admin.email);

      admin.username = adminUsername;
      admin.email = adminEmail;
      admin.passwordHash = passwordHash;
      admin.role = "admin";

      await admin.save();

      console.log("======================================");
      console.log("✅ Admin account updated successfully");
      console.log("Username:", admin.username);
      console.log("Email:", admin.email);
      console.log("Role:", admin.role);
      console.log("Password: updated and hashed");
      console.log("======================================");
    }

    // --------------------------------------------------
    // 6. Create admin if one doesn't exist
    // --------------------------------------------------

    else {
      admin = await User.create({
        username: adminUsername,
        email: adminEmail,
        passwordHash,
        role: "admin",
      });

      console.log("======================================");
      console.log("✅ New admin account created");
      console.log("Username:", admin.username);
      console.log("Email:", admin.email);
      console.log("Role:", admin.role);
      console.log("======================================");
    }

    // --------------------------------------------------
    // 7. Verify saved admin directly from MongoDB
    // --------------------------------------------------

    const savedAdmin = await User.findById(admin._id);

    console.log("");
    console.log("Admin currently saved in MongoDB:");
    console.log({
      id: savedAdmin._id.toString(),
      username: savedAdmin.username,
      email: savedAdmin.email,
      role: savedAdmin.role,
      updatedAt: savedAdmin.updatedAt,
    });

    // --------------------------------------------------
    // 8. Verify password
    // --------------------------------------------------

    const passwordIsCorrect = await bcrypt.compare(
      adminPassword,
      savedAdmin.passwordHash
    );

    console.log(
      "Password verification:",
      passwordIsCorrect ? "✅ PASSED" : "❌ FAILED"
    );

    if (!passwordIsCorrect) {
      throw new Error(
        "Password was saved but bcrypt verification failed."
      );
    }

    console.log("");
    console.log("✅ Seeding complete.");

    // --------------------------------------------------
    // 9. Close MongoDB connection
    // --------------------------------------------------

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("❌ Seed failed:");
    console.error(error);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

seed();