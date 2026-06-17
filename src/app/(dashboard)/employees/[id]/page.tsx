"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import {toast} from "sonner";

type EmployeeForm = {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfJoining: string;
  employmentType: string;
  department: string;
  designation: string;
  role: string;
  status: string;
  salary: string;
  dateOfBirth: string;
  address: string;
  gender: string;
};

export default function EditEmployeePage() {
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState<EmployeeForm | null>(null);
  const [originalForm, setOriginalForm] = useState<EmployeeForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/admin/employee/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const emp = res.data?.data || res.data?.employee || res.data;

        const formatDate = (date: any) =>
          date ? new Date(date).toISOString().split("T")[0] : "";

        const mappedData: EmployeeForm = {
          fullName: emp.fullName || "",
          email: emp.email || "",
          phoneNumber: String(emp.phoneNumber || ""),
          dateOfJoining: formatDate(emp.dateOfJoining),
          employmentType: emp.employmentType || "full_time",
          department: emp.department || "development",
          designation: emp.designation || "frontend_developer",
          role: emp.role || "employee",
          status: emp.status || "active",
          salary: String(emp.salary || ""),
          dateOfBirth: formatDate(emp.dateOfBirth),
          address: emp.address || "",
          gender: emp.gender || "MALE",
        };

        setForm(mappedData);
        setOriginalForm(mappedData);
      } catch (err) {
        console.error("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e: any) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SAVE (PUT) ================= */
  const handleSave = async () => {
    if (!form) return;

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...form,
        salary: Number(form.salary),
        dateOfJoining: new Date(form.dateOfJoining),
        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth) : null,
      };

      await axios.put(
        `http://localhost:5000/admin/employee/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Employee updated successfully");

      setOriginalForm(form);
      setIsEditing(false);
    } catch (err: any) {
      console.error("UPDATE ERROR:", err.response?.data || err.message);
      toast.error("❌ Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= CANCEL ================= */
  const handleCancel = () => {
    setForm(originalForm);
    setIsEditing(false);
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!form) return <p className="p-6">No employee data</p>;

  /* ================= FIELD RENDER ================= */
  const renderField = (label: string, name: keyof EmployeeForm) => (
    <div>
      <p className="text-gray-500 text-sm">{label}</p>

      {isEditing ? (
        name === "dateOfBirth" ? (
          /* 📅 CALENDAR */
          <input
            type="date"
            name={name}
            value={form[name]}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        ) : name === "gender" ? (
          /* 🔘 RADIO BUTTONS */
          <div className="flex gap-4 mt-1">
            {["MALE", "FEMALE", "OTHER"].map((g) => (
              <label key={g} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={form.gender === g}
                  onChange={handleChange}
                />
                {g}
              </label>
            ))}
          </div>
        ) : (
          <input
            name={name}
            value={form[name]}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        )
      ) : (
        <p className="font-medium">{form[name]}</p>
      )}
    </div>
  );

  /* ================= UI ================= */
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">My Profile</h2>
            <p className="text-gray-500 text-sm">
              View and update your personal details.
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={handleCancel}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* LEFT PROFILE */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-purple-200 flex items-center justify-center text-4xl">
              👤
            </div>

            <h3 className="mt-4 font-semibold text-lg">
              {form.fullName}
            </h3>

            <p className="text-gray-500 text-sm">
              {form.designation}
            </p>

            <div className="mt-3 inline-block bg-purple-100 text-purple-700 px-3 py-1 text-xs rounded">
              {form.role?.toUpperCase()}
            </div>
          </div>

          {/* RIGHT DETAILS */}
          <div className="col-span-2 grid grid-cols-2 gap-6">

            {renderField("Full Name", "fullName")}
            {renderField("Email", "email")}
            {renderField("Phone", "phoneNumber")}
            {renderField("Department", "department")}
            {renderField("Designation", "designation")}
            {renderField("Date of Joining", "dateOfJoining")}
            {renderField("Salary", "salary")}
            {renderField("Date of Birth", "dateOfBirth")}

            <div className="col-span-2">
              {renderField("Address", "address")}
            </div>

            {renderField("Gender", "gender")}
            {renderField("Status", "status")}

          </div>
        </div>
      </div>
    </div>
  );
}