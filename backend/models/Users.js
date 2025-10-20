import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    accountType: {
      type: String,
      enum: ["free", "kouhai", "senpai", "sensei"],
      default: "free", // Menambahkan default untuk accountType
    },
    mockupQuota: {
      type: Number,
      default: 0, // free = 0 atau unlimited tergantung sistem
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    currentSimulation: {
      startedAt: { type: Date },
      questions: {
        S1: [{ type: mongoose.Schema.Types.ObjectId, ref: "JFTQuestion" }],
        S2: [{ type: mongoose.Schema.Types.ObjectId, ref: "JFTQuestion" }],
        S3: [{ type: mongoose.Schema.Types.ObjectId, ref: "JFTQuestion" }],
        S4: [{ type: mongoose.Schema.Types.ObjectId, ref: "JFTQuestion" }],
      },
    },
    testHistory: [
      {
        score: Number,
        date: Date,
        questionIds: [ObjectId],
        // bisa tambah lainnya nanti (jawaban, durasi, dll)
      },
    ],
    lastResultSeen: { type: Boolean, default: false },

    subscription: {
      isActive: { type: Boolean, default: false },
      expiresAt: { type: Date, default: null },
    },

    languageLevel: {
      type: String,
      enum: [
        "JLPT N1",
        "JLPT N2",
        "JLPT N3",
        "JLPT N4",
        "JLPT N5",
        "JFT Basic A2",
      ],
    },
    phone: { type: String }, // Menambahkan nomor telepon
    address: { type: String }, // Menambahkan alamat
    birthdate: { type: String }, // Menambahkan tanggal lahir
    gender: { type: String }, // Menambahkan jenis kelamin
  },
  {
    timestamps: true, // Menyimpan informasi waktu pembuatan dan update
  }
);

const User = mongoose.model("User", userSchema);
export default User;
