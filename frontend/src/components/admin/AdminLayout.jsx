import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProfessionalLayout from "../layout/ProfessionalLayout";
import AdminOverview from "./AdminOverview";
import StaffManagement from "./StaffManagement";
import AttendanceReports from "./AttendanceReports";
import AddEmployee from "./AddEmployee";
import WhatsAppManagement from "./WhatsAppManagement";
import Breadcrumb from "./Breadcrumb";

const AdminLayout = () => {
  return (
    <ProfessionalLayout>
      {/* Page Header with Breadcrumb */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <Breadcrumb />
        </div>
      </div>

      {/* Page Content */}
      <div className="space-y-6">
        <Routes>
          <Route path="/overview" element={<AdminOverview />} />
          <Route path="/staff" element={<StaffManagement />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/attendance" element={<AttendanceReports />} />
          <Route path="/whatsapp" element={<WhatsAppManagement />} />
          <Route path="/" element={<Navigate to="/admin/overview" replace />} />
        </Routes>
      </div>
    </ProfessionalLayout>
  );
};

export default AdminLayout;
