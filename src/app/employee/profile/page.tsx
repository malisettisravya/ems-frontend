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
  BadgeIndianRupee,
  UserCheck,
} from "lucide-react";

type Employee = {
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  address?: string;
  gender?: string;
  profilePicture?: string;
  status?: string;
  salary?: number;
  dateOfBirth?: string;
};

export default function EmployeeProfile() {
  const [data, setData] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const res = await axios.get("http://localhost:5000/employee/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("PROFILE DATA:", res.data.employee);

    setData(res.data.employee);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchProfile();
  }, []);

  /* ---------------- UPLOAD IMAGE ---------------- */
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

    setData((prev) =>
      prev
        ? {
            ...prev,
            profilePicture: res.data.profilePicture,
          }
        : prev
    );

      setData((prev) =>
        prev
          ? { ...prev, profilePicture: `${newPath}?t=${Date.now()}` }
          : prev
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6">No data found</div>;

  /* ---------------- IMAGE URL ---------------- */
  const imageUrl = data.profilePicture || null;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ===== HEADER CARD ===== */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">

          <div className="relative">
            {imageUrl ? (
              <img
                src={imageUrl}
                className="w-28 h-28 rounded-full object-cover border-4 border-indigo-100"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center">
                <UserCircle2 size={70} className="text-slate-400" />
              </div>
            )}

            <label className="absolute bottom-0 right-0 bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-full cursor-pointer">
              +
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) uploadImage(e.target.files[0]);
                }}
              />
            </label>

            {uploading && (
              <p className="text-xs text-indigo-500 mt-2">Uploading...</p>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">
              {data.fullName}
            </h1>

            <p className="text-slate-500">{data.designation}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600">
                {data.department}
              </span>

              <span className="px-3 py-1 text-xs rounded-full bg-green-50 text-green-600">
                {data.status || "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* ===== INFO GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Contact */}
          <Section title="Contact Information">
            <Info icon={<Mail size={16} />} label="Email" value={data.email} />
            <Info icon={<Phone size={16} />} label="Phone" value={data.phoneNumber} />
            <Info icon={<MapPin size={16} />} label="Address" value={data.address} />
          </Section>

          {/* Work */}
          <Section title="Work Details">
            <Info icon={<Building2 size={16} />} label="Department" value={data.department} />
            <Info icon={<Briefcase size={16} />} label="Designation" value={data.designation} />
            <Info icon={<CalendarDays size={16} />} label="Joining Date" value={data.dateOfJoining} />
          </Section>

        <ProfileRow icon={<Mail size={16} />} label="Email" value={data.email} />
        <ProfileRow icon={<Phone size={16} />} label="Phone" value={data.phoneNumber} />
        <ProfileRow icon={<Building2 size={16} />} label="Department" value={data.department} />
        <ProfileRow icon={<Briefcase size={16} />} label="Designation" value={data.designation} />
        <ProfileRow icon={<CalendarDays size={16} />} label="Joining Date" value={data.dateOfJoining} />
        <ProfileRow icon={<MapPin size={16} />} label="Address" value={data.address} />
        <ProfileRow icon={<Users size={16} />} label="Gender" value={data.gender} />
        <ProfileRow icon={<Briefcase size={16} />} label="Status" value={data.status} />
        <ProfileRow icon={<Briefcase size={16} />} label="Salary" value={data.salary?.toString()} />
        <ProfileRow icon={<CalendarDays size={16} />} label="Date of Birth" value={data.dateOfBirth} />

      </div>
    </div>
  );
}

/* ===== SECTION CARD ===== */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/* ===== INFO ROW ===== */
function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-slate-800 font-medium">
        {value || "-"}
      </span>
    </div>
  );
}