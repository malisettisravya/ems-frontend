"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import {toast} from "sonner";

/* ---------------- BASE CONFIG ---------------- */
const BASE_URL = "http://localhost:5000/admin";

/* ---------------- AUTH HEADER ---------------- */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* ---------------- API FUNCTIONS ---------------- */
const getEmployees = async () => {
  const res = await axios.get(`${BASE_URL}/employees`, getAuthHeader());
  return res.data.employees;
};

const deleteEmployee = async (id: string) => {
  return await axios.delete(
    `${BASE_URL}/delete-employee/${id}`,
    getAuthHeader()
  );
};

/* ---------------- TYPE ---------------- */
type Employee = {
  _id: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  status: "active" | "inactive";
};

/* ---------------- PAGE ---------------- */
export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  /* FETCH */
  const fetchData = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* DELETE */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete employee");
    }
  };

  /* FILTER */
  const filtered = employees.filter((emp) =>
    `${emp.fullName} ${emp.email} ${emp.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
        placeholder="Search by name, email or department..."
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
                <td className="p-3 font-medium">{emp.fullName}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>{emp.role}</td>

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

                <td className="flex gap-2 p-3">
                  {/* EDIT */}
                 <button
  onClick={() => router.push(`/employees/${emp._id}`)}
  className="text-green-600 hover:text-green-800"
>
  <Eye size={20} />
  </button>


                  {/* DELETE */}
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