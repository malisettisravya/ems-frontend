"use client";

import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { toast } from "sonner";

/* ---------------- ENUM TYPES (MATCH BACKEND) ---------------- */
type EmploymentType = "FULL_TIME" | "PART_TIME" | "INTERN";
type Department = "HR" | "ENGINEERING" | "SALES";
type Designation = "MANAGER" | "DEVELOPER" | "HR";
type Status = "ACTIVE" | "INACTIVE";
type Gender = "MALE" | "FEMALE" | "OTHER";

/* ---------------- EMPLOYEE TYPE ---------------- */
interface Employee {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfJoining: string;
  employmentType: EmploymentType;
  department: Department;
  designation: Designation;
  role: string;
  status: Status;
  salary: number;
  dateOfBirth: string;
  address: string;
  gender: Gender;
}

/* ---------------- CONSTANT ---------------- */
const EMPLOYEE_ID = "6a2a851a1736fbdbfce7a0df";

export default function EmployeeProfile() {
  const [employee, setEmployee] = useState<Employee>({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfJoining: "",
    employmentType: "FULL_TIME",
    department: "ENGINEERING",
    designation: "DEVELOPER",
    role: "employee",
    status: "ACTIVE",
    salary: 0,
    dateOfBirth: "",
    address: "",
    gender: "MALE",
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ---------------- */
  const fetchEmployee = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/admin/employee/${EMPLOYEE_ID}`
      );
      setEmployee(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setEmployee((prev) => ({
      ...prev,
      [name]: name === "salary" ? Number(value) : value,
    }));
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    try {
      setLoading(true);

      await axios.put(
        `http://localhost:5000/admin/employee/${EMPLOYEE_ID}`,
        employee
      );

      setEditMode(false);
      toast.success("Updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FIELD ---------------- */
  const renderField = (
    label: string,
    name: keyof Employee,
    type: string = "text"
  ) => (
    <div className="flex flex-col">
      <label className="text-sm text-gray-500">{label}</label>

      {editMode ? (
        <input
          type={type}
          name={name}
          value={employee[name] as any}
          onChange={handleChange}
          className="border p-2 rounded mt-1"
        />
      ) : (
        <p className="mt-1 font-medium">{employee[name] || "-"}</p>
      )}
    </div>
  );

  /* ---------------- SELECT ---------------- */
  const renderSelect = (
    label: string,
    name: keyof Employee,
    options: string[]
  ) => (
    <div className="flex flex-col">
      <label className="text-sm text-gray-500">{label}</label>

      {editMode ? (
        <select
          name={name}
          value={employee[name]}
          onChange={handleChange}
          className="border p-2 rounded mt-1"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <p className="mt-1 font-medium">{employee[name] || "-"}</p>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded shadow max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">My Profile</h2>

          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* LEFT CARD */}
          <div className="bg-gray-50 p-4 rounded text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-purple-200 flex items-center justify-center text-3xl">
              👤
            </div>

            <h3 className="mt-4 font-bold">{employee.fullName}</h3>
            <p className="text-sm text-gray-500">{employee.designation}</p>

            {/* ✅ ADDED ROLE */}
            <p className="text-xs text-gray-400 mt-1">
              Role: {employee.role || "-"}
            </p>
          </div>

          {/* RIGHT FORM */}
          <div className="col-span-2 grid grid-cols-2 gap-4">

            {renderField("Full Name", "fullName")}
            {renderField("Email", "email")}
            {renderField("Phone", "phoneNumber")}
            {renderField("Date of Joining", "dateOfJoining", "date")}

            {renderSelect("Employment Type", "employmentType", [
              "FULL_TIME",
              "PART_TIME",
              "INTERN",
            ])}

            {renderSelect("Department", "department", [
              "HR",
              "ENGINEERING",
              "SALES",
            ])}

            {renderSelect("Designation", "designation", [
              "MANAGER",
              "DEVELOPER",
              "HR",
            ])}

            {/* STATUS */}
            {renderSelect("Status", "status", ["ACTIVE", "INACTIVE"])}

            {/* SALARY */}
            {renderField("Salary", "salary", "number")}

            {renderField("Date of Birth", "dateOfBirth", "date")}
            {renderField("Address", "address")}

            {renderSelect("Gender", "gender", [
              "MALE",
              "FEMALE",
              "OTHER",
            ])}
          </div>
        </div>

        {/* SAVE BUTTON */}
        {editMode && (
          <div className="mt-6 text-right">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}