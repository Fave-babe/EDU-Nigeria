import React from "react";
import {
  Wallet,
  CreditCard,
  Receipt,
  AlertCircle,
  FileText,
  Printer,
  DollarSign,
  BarChart3,
} from "lucide-react";

export default function BursarDashboard() {
  const transactions = [
    "John Doe paid ₦150,000 School Fees",
    "Receipt #10021 generated",
    "Invoice sent to Mary Johnson",
    "Outstanding fee reminder sent",
    "Transport fee payment received",
  ];

  const actions = [
    { title: "Record Payment", icon: <DollarSign size={20} /> },
    { title: "Generate Invoice", icon: <FileText size={20} /> },
    { title: "Print Receipt", icon: <Printer size={20} /> },
    { title: "Financial Report", icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}

      <div className="bg-white shadow px-8 py-5 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Bursar Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Monitor school finances and fee collections.
          </p>
        </div>

        <button className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700">
          Finance Report
        </button>
      </div>

      <div className="p-8">

        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <div className="bg-white rounded-xl shadow p-6">
            <Wallet className="text-green-600 mb-3" size={35}/>
            <h2 className="text-gray-500">Total Revenue</h2>
            <p className="text-3xl font-bold">₦14.5M</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <CreditCard className="text-blue-600 mb-3" size={35}/>
            <h2 className="text-gray-500">Payments Today</h2>
            <p className="text-3xl font-bold">42</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <Receipt className="text-orange-500 mb-3" size={35}/>
            <h2 className="text-gray-500">Invoices Issued</h2>
            <p className="text-3xl font-bold">315</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <AlertCircle className="text-red-600 mb-3" size={35}/>
            <h2 className="text-gray-500">Outstanding Fees</h2>
            <p className="text-3xl font-bold">₦2.1M</p>
          </div>

        </div>

        {/* Fee Collection Progress */}

        <div className="bg-white rounded-xl shadow p-6 mt-8">

          <h2 className="text-xl font-semibold mb-6">
            Fee Collection Progress
          </h2>

          <div className="space-y-5">

            <div>
              <div className="flex justify-between mb-2">
                <span>School Fees</span>
                <span>85%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full w-[85%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Transport Fees</span>
                <span>70%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full w-[70%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Uniform Fees</span>
                <span>60%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-yellow-500 h-3 rounded-full w-[60%]"></div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Section */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          {/* Transactions */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
              Recent Transactions
            </h2>

            <ul className="space-y-3">

              {transactions.map((item, index) => (
                <li
                  key={index}
                  className="border-b pb-2 text-gray-700"
                >
                  • {item}
                </li>
              ))}

            </ul>

          </div>

          {/* Quick Actions */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-4">

              {actions.map((action, index) => (
                <button
                  key={index}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg p-4"
                >
                  {action.icon}
                  {action.title}
                </button>
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}