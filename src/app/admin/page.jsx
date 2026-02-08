"use client";
import { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPost: 0,
    totalUser: 0,
    teams: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch(
    //       "http://localhost:5501/api/admin/dashboard/statistics"
    //     );
    //     if (!response.ok) {
    //       throw new Error("Error in fetching data");
    //     }
    //     const result = await response.json();
    //     setStats(result.data);
    //   } catch (error) {
    //     console.error(error.message);
    //   }
    // };
    // fetchData();
  }, []);

  // console.log(stats);

  const data = [
    { name: "Posts", value: stats.totalPost },
    { name: "Users", value: stats.totalUser },
    { name: "Teams", value: stats.teams },
    { name: "Products", value: stats.totalProducts },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b-2 w-full h-20 bg-white">
        <div className=" px-4 py-4 ">
          <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
            <SidebarTrigger />
            <h1 className="text-xl font-bold solway-text">Dashoard</h1>
          </div>
        </div>
      </header>
      <div className="w-full min-h-screen bg-gray-100 p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-6 uppercase">
          Welcome To Admin Dashboard
        </h1>
        {/* 
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-2xl font-bold">{stats.totalPost}</p>
            <h2 className="text-lg font-medium text-gray-600">Total Posts</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-2xl font-bold">{stats.totalUser}</p>
            <h2 className="text-lg font-medium text-gray-600">Total Users</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
            <h2 className="text-lg font-medium text-gray-600">
              Total Products
            </h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-2xl font-bold">{stats.teams}</p>
            <h2 className="text-lg font-medium text-gray-600">Total Teams</h2>
          </CardContent>
        </Card>
      </div> */}

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Overview</h2>
          {/* <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer> */}
        </div>
      </div>
    </>
  );
}
