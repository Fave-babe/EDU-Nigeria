import React from "react";
import {
  Users,
  UserCheck,
  Wallet,
  AlertTriangle,
  GraduationCap,
  Bell,
  FileText,
  CreditCard,
} from "lucide-react";

export default function OwnerDashboard() {
  const activities = [
    "New student registered.",
    "Teacher added to Mathematics Department.",
    "School fees payment received.",
    "Third Term Result published.",
    "Parent meeting scheduled.",
  ];

  const quickActions = [
    {
      title: "Register Student",
      icon: <GraduationCap size={20} />,
    },
    {
      title: "Add Staff",
      icon: <UserCheck size={20} />,
    },
    {
      title: "Generate Report",
      icon: <FileText size={20} />,
    },
    {
      title: "Receive Payments",
      icon: <CreditCard size={20} />,
    },
    {
      title: "Send Announcement",
      icon: <Bell size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white shadow px-8 py-5 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            School Owner Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Welcome back! Here's today's overview.
          </p>
        </div>

        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
          View Reports
        </button>
      </div>

      <div className="p-8">

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <div className="bg-white rounded-xl shadow p-6">
            <Users className="text-blue-600 mb-3" size={35} />
            <h2 className="text-gray-500">Total Students</h2>
            <p className="text-3xl font-bold mt-2">1,245</p>
            <span className="text-green-600 text-sm">
              +15 this week
            </span>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <UserCheck className="text-green-600 mb-3" size={35} />
            <h2 className="text-gray-500">Staff</h2>
            <p className="text-3xl font-bold mt-2">86</p>
            <span className="text-green-600 text-sm">
              +2 new staff
            </span>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <Wallet className="text-yellow-500 mb-3" size={35} />
            <h2 className="text-gray-500">Revenue</h2>
            <p className="text-3xl font-bold mt-2">
              ₦14,500,000
            </p>
            <span className="text-green-600 text-sm">
              +8% this month
            </span>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <AlertTriangle className="text-red-500 mb-3" size={35} />
            <h2 className="text-gray-500">
              Outstanding Fees
            </h2>
            <p className="text-3xl font-bold mt-2">
              ₦2,150,000
            </p>
            <span className="text-red-500 text-sm">
              146 Students Owing
            </span>
          </div>

        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Revenue Overview
            </h2>

            <div className="space-y-4">
              {[
                ["Jan", 70],
                ["Feb", 55],
                ["Mar", 90],
                ["Apr", 65],
                ["May", 85],
                ["Jun", 95],
              ].map(([month, width]) => (
                <div key={month}>
                  <div className="flex justify-between mb-1">
                    <span>{month}</span>
                    <span>{width}%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Attendance Summary
            </h2>

            <div className="space-y-5">

              <div>
                <div className="flex justify-between">
                  <span>Present</span>
                  <span>92%</span>
                </div>

                <div className="w-full bg-gray-200 h-3 rounded-full">
                  <div className="bg-green-600 h-3 rounded-full w-[92%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span>Absent</span>
                  <span>6%</span>
                </div>

                <div className="w-full bg-gray-200 h-3 rounded-full">
                  <div className="bg-red-500 h-3 rounded-full w-[6%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span>Late</span>
                  <span>2%</span>
                </div>

                <div className="w-full bg-gray-200 h-3 rounded-full">
                  <div className="bg-yellow-500 h-3 rounded-full w-[2%]"></div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
              Recent Activities
            </h2>

            <ul className="space-y-4">
              {activities.map((activity, index) => (
                <li
                  key={index}
                  className="border-b pb-2 text-gray-700"
                >
                  • {activity}
                </li>
              ))}
            </ul>

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-4">

              {quickActions.map((item, index) => (
                <button
                  key={index}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4"
                >
                  {item.icon}
                  {item.title}
                </button>
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}