"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Eye, Trash2, X } from "lucide-react";

const UsersPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [statusNotif, setStatusNotif] = useState(null); // null atau string
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const usersPerPage = 50;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/rx78gpo1p6/users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        const result = await res.json();

        if (Array.isArray(result)) {
          setAllUsers(result);
          setFilteredUsers(result);
        } else {
          console.error("⚠️ Data bukan array:", result);
          setAllUsers([]);
          setFilteredUsers([]);
        }
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = allUsers;

    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter !== "all") {
      filtered = filtered.filter((u) => u.accountType === filter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [search, filter, allUsers]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = Array.isArray(filteredUsers)
    ? filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
    : [];

  const totalPages = Array.isArray(filteredUsers)
    ? Math.ceil(filteredUsers.length / usersPerPage)
    : 1;

  const toggleStatus = async (id, status) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/rx78gpo1p6/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ isActive: status }),
        }
      );

      if (res.ok) {
        setAllUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, isActive: status } : user
          )
        );
        setSelectedUser(null);
        setPopup({
          show: true,
          message: `Akun berhasil ${status ? "diaktifkan" : "dinonaktifkan"}`,
          type: "success",
        });
        setTimeout(
          () => setPopup({ show: false, message: "", type: "success" }),
          4000
        );
      } else {
        setPopup({
          show: true,
          message: "Gagal mengubah status user",
          type: "error",
        });
        setTimeout(
          () => setPopup({ show: false, message: "", type: "error" }),
          4000
        );
      }
    } catch (err) {
      console.error("Error toggle status:", err);
      setPopup({
        show: true,
        message: "Terjadi kesalahan jaringan.",
        type: "error",
      });
      setTimeout(
        () => setPopup({ show: false, message: "", type: "error" }),
        4000
      );
    }
  };
  const handleUpdateUser = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/rx78gpo1p6/users/${selectedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({
            name: selectedUser.name,
            email: selectedUser.email,
            type: selectedUser.accountType,
            mockupQuota: selectedUser.mockupQuota,
            address: selectedUser.address,
            birthdate: selectedUser.birthdate,
            phone: selectedUser.phone,
            gender: selectedUser.gender,
            languageLevel: selectedUser.languageLevel,
            isActive: selectedUser.isActive,
          }),
        }
      );

      if (res.ok) {
        setAllUsers((prev) =>
          prev.map((user) =>
            user._id === selectedUser._id ? selectedUser : user
          )
        );
        setSelectedUser(null);
      } else {
        alert("Gagal menyimpan perubahan");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) {
      console.error("User tidak ditemukan saat konfirmasi hapus.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/rx78gpo1p6/users/${selectedUser._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (res.ok) {
        setAllUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
        setSelectedUser(null);
      } else {
        const msg = await res.text();
        console.error("Gagal hapus:", msg);
        alert("Gagal menghapus akun");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleDeleteUser = async () => {
    if (confirmDelete !== selectedUser.email) {
      alert("Email yang diketik tidak sesuai.");
      return;
    }

    if (!selectedUser) {
      alert("Pengguna yang akan dihapus tidak ditemukan.");
      return;
    }

    setShowConfirmDeleteModal(true);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <main className="ml-64 w-full p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Kelola Pengguna
        </h1>

        {/* Filter dan Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Cari nama atau email..."
            className="border border-gray-900 rounded-md px-4 py-2 w-full md:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border border-gray-900 rounded-md px-4 py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Semua Akun</option>
            <option value="free">Free</option>
            <option value="kouhai">Kouhai</option>
            <option value="senpai">Senpai</option>
            <option value="sensei">Sensei</option>
          </select>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Nama</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Tipe Akun</th>
                <th className="px-6 py-3 text-center">Kuota</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4 capitalize">{user.accountType}</td>
                    <td className="px-6 py-4 text-center">
                      {user.mockupQuota}
                    </td>
                    <td className="px-6 py-4 text-center flex justify-center gap-3">
                      <button
                        className="text-blue-600 hover:underline flex items-center gap-1"
                        onClick={() => {
                          setSelectedUser({ ...user });
                          setConfirmDelete("");
                        }}
                      >
                        <Eye size={16} /> Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Modal Detail */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-3 right-3 text-gray-900 hover:text-red-500"
              >
                <X />
              </button>
              <h2 className="text-xl font-semibold mb-4">Detail Pengguna</h2>
              <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                <div>
                  <label className="block font-semibold text-gray-800">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={selectedUser.name || ""}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, name: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded text-gray-900"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-semibold text-gray-800">
                    Email
                  </label>
                  <input
                    type="email"
                    value={selectedUser.email || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                    className="w-full border px-3 py-2 rounded text-gray-900"
                  />
                </div>

                {/* Tipe Akun */}
                <div>
                  <label className="block font-semibold text-gray-800">
                    Tipe Akun
                  </label>
                  <select
                    value={selectedUser.accountType || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        accountType: e.target.value,
                      })
                    }
                    className="w-full border px-3 py-2 rounded text-gray-900"
                  >
                    <option value="">-- Pilih --</option>
                    <option value="free">Free</option>
                    <option value="kouhai">Kouhai</option>
                    <option value="senpai">Senpai</option>
                    <option value="sensei">Sensei</option>
                  </select>
                </div>

                {/* Kuota */}
                <div>
                  <label className="block font-semibold text-gray-800">
                    Kuota
                  </label>
                  <input
                    type="number"
                    value={selectedUser.mockupQuota || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        mockupQuota: Number(e.target.value),
                      })
                    }
                    className="w-full border px-3 py-2 rounded text-gray-900"
                  />
                </div>

                {/* Alamat */}
                <div>
                  <label className="block font-semibold text-gray-800">
                    Alamat
                  </label>
                  <textarea
                    rows={3}
                    value={selectedUser.address || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        address: e.target.value,
                      })
                    }
                    className="w-full border px-3 py-2 rounded text-gray-900"
                  />
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <label className="block font-semibold text-gray-800">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={selectedUser.birthdate || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        birthdate: e.target.value,
                      })
                    }
                    className="w-full border px-3 py-2 rounded text-gray-900"
                  />
                </div>

                {/* No. Telepon */}
                <div>
                  <label className="block font-semibold text-gray-800">
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    value={selectedUser.phone || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        phone: e.target.value,
                      })
                    }
                    className="w-full border px-3 py-2 rounded text-gray-900"
                  />
                </div>

                {/* Jenis Kelamin */}
                <div>
                  <label className="block font-semibold text-gray-800">
                    Jenis Kelamin
                  </label>
                  <select
                    value={selectedUser.gender || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        gender: e.target.value,
                      })
                    }
                    className="w-full border px-3 py-2 rounded text-gray-900"
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Laki-Laki">Laki-Laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                {/* Level Bahasa Jepang */}
                <div>
                  <label className="block font-semibold text-gray-800">
                    Level Bahasa Jepang
                  </label>
                  <select
                    value={selectedUser.languageLevel || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        languageLevel: e.target.value,
                      })
                    }
                    className="w-full border px-3 py-2 rounded text-gray-900"
                  >
                    <option value="">-- Pilih --</option>
                    <option value="JLPT N1">JLPT N1</option>
                    <option value="JLPT N2">JLPT N2</option>
                    <option value="JLPT N3">JLPT N3</option>
                    <option value="JLPT N4">JLPT N4</option>
                    <option value="JLPT N5">JLPT N5</option>
                    <option value="JFT Basic A2">JFT Basic A2</option>
                  </select>
                </div>
                {/* Tombol */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    className={`flex-1 py-2 px-4 rounded text-white font-semibold ${
                      selectedUser.isActive
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                    onClick={() =>
                      toggleStatus(selectedUser._id, !selectedUser.isActive)
                    }
                  >
                    {selectedUser.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>

                  <button
                    onClick={handleUpdateUser}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                  >
                    Simpan Perubahan
                  </button>
                </div>

                {/* Hapus akun */}
                <div className="pt-4">
                  <label className="block font-semibold text-gray-800 mb-1">
                    Tulis email pengguna untuk konfirmasi hapus:
                  </label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded text-gray-900"
                    value={confirmDelete}
                    onChange={(e) => setConfirmDelete(e.target.value)}
                  />
                  <button
                    onClick={handleDeleteUser}
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded font-semibold"
                  >
                    Hapus Akun
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showConfirmDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Konfirmasi Hapus Akun
            </h3>
            <p className="text-gray-700 mb-6">
              Apakah kamu yakin ingin menghapus akun{" "}
              <span className="font-bold">{selectedUser.email}</span>? Tindakan
              ini tidak bisa dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={() => setShowConfirmDeleteModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
                onClick={() => {
                  setShowConfirmDeleteModal(false);
                  handleConfirmDelete();
                }}
              >
                Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}

      {popup.show && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg z-50 transition-all duration-500 ${
            popup.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {popup.message}
        </div>
      )}
    </div>
  );
};

export default UsersPage;
