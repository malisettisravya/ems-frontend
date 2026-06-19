"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { toast } from "sonner";

const BASE_URL = "http://localhost:5000/admin";

/* ---------------- AUTH ---------------- */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* ---------------- TYPE ---------------- */
type Employee = {
  _id: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  status: "active" | "inactive";
  profilePicture?: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  /* FETCH */
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/employees`,
        getAuthHeader()
      );

      setEmployees(res.data.employees);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* DELETE */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      await axios.delete(
        `${BASE_URL}/delete-employee/${id}`,
        getAuthHeader()
      );

      setEmployees((prev) =>
        prev.filter((emp) => emp._id !== id)
      );

      toast.success("Employee deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  /* FILTER */
  const filtered = employees.filter((emp) =>
    `${emp.fullName} ${emp.email} ${emp.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* IMAGE HELPER */
  const getImageUrl = (path?: string) => {
    if (!path) {
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }

    return `http://localhost:5000${path}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Employees</h1>

        <button
          onClick={() => router.push("/employees/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Employee
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="w-full md:w-1/3 p-2 border rounded mb-4"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Employee</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((emp) => (
              <tr key={emp._id} className="border-t">

                {/* NAME + IMAGE */}
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={getImageUrl(emp.profilePicture)}
                    className="w-8 h-8 rounded-full object-cover"
                  />

                  <span className="font-medium">
                    {emp.fullName}
                  </span>
                </td>

                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>{emp.role}</td>

                {/* STATUS */}
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      emp.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="flex gap-2 p-3">
                  <button
                    onClick={() =>
                      router.push(`/employees/${emp._id}`)
                    }
                    className="text-green-600"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="text-red-600"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}