"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  UserCircle2,
  Mail,
  Phone,
  Building2,
  Briefcase,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";

/* ---------------- TYPE ---------------- */
type Employee = {
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  address?: string;
  gender?: string;
  employeeId?: string;
  profilePicture?: string;

  // ✅ ADDED FIELDS
  status?: string;
  salary?: number;
  dateOfBirth?: string;
};

export default function EmployeeProfile() {
  const [data, setData] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/employee/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setData(res.data.employee);
    setLoading(false);
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("profilePicture", file);

      const res = await axios.post(
        "http://localhost:5000/employee/upload-profile-picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newPath = res.data.profilePicture;

      setData((prev) =>
        prev
          ? {
              ...prev,
              profilePicture: `${newPath}?t=${Date.now()}`,
            }
          : prev
      );
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6">No data found</div>;

  const imageUrl = data.profilePicture
    ? `http://localhost:5000${data.profilePicture}`
    : "";

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* LEFT CARD */}
      <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center">

        <div className="relative w-32 h-32">

          {data.profilePicture ? (
            <img
              src={imageUrl}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <UserCircle2 size={80} className="text-gray-400" />
            </div>
          )}

          {/* UPLOAD BUTTON */}
          <label className="absolute bottom-1 right-1 bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full cursor-pointer">
            +
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  uploadImage(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>

        {uploading && (
          <p className="text-blue-500 text-sm mt-2">Uploading...</p>
        )}

        <h2 className="mt-4 font-bold text-xl">{data.fullName}</h2>
        <p className="text-gray-500">{data.designation}</p>
      </div>

      {/* RIGHT CARD */}
      <div className="md:col-span-2 bg-white shadow rounded-xl p-6">

        <ProfileRow icon={<Mail size={16} />} label="Email" value={data.email} />
        <ProfileRow icon={<Phone size={16} />} label="Phone" value={data.phoneNumber} />
        <ProfileRow icon={<Building2 size={16} />} label="Department" value={data.department} />
        <ProfileRow icon={<Briefcase size={16} />} label="Designation" value={data.designation} />
        <ProfileRow icon={<CalendarDays size={16} />} label="Joining Date" value={data.dateOfJoining} />
        <ProfileRow icon={<MapPin size={16} />} label="Address" value={data.address} />
        <ProfileRow icon={<Users size={16} />} label="Gender" value={data.gender} />

        {/* ✅ ADDED FIELDS */}
        <ProfileRow icon={<Briefcase size={16} />} label="Status" value={data.status} />
        <ProfileRow icon={<Briefcase size={16} />} label="Salary" value={data.salary?.toString()} />
        <ProfileRow icon={<CalendarDays size={16} />} label="Date of Birth" value={data.dateOfBirth} />
      </div>
    </div>
  );
}

/* ---------------- ROW COMPONENT ---------------- */
function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex justify-between py-3 border-b">
      <div className="flex items-center gap-2 text-gray-600">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}