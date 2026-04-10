"use client";

import {
  TrendingUp,
  Calendar,
  Users,
  Clock,
  MoreHorizontal,
  Plus,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/* ================= STATUS CONFIG ================= */

const statusMap: any = {
  BOOKED: {
    label: "Pending",
    class:
      "bg-amber-50 text-amber-700 border-amber-100",
  },
  ACCEPTED: {
    label: "Confirmed",
    class:
      "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  COMPLETED: {
    label: "Completed",
    class:
      "bg-blue-50 text-blue-700 border-blue-100",
  },
  CANCELLED: {
    label: "Cancelled",
    class:
      "bg-red-50 text-red-600 border-red-100",
  },
};

interface DashboardUIProps {
  totalRevenue: number;
  appointments: any[];
  customersCount: number;
  followUpsCount: number;
  todaysAppointments: any[];
  search: string;
  setSearch: (val: string) => void;
}

export default function DashboardUI({
  totalRevenue,
  appointments,
  customersCount,
  followUpsCount,
  todaysAppointments,
}: DashboardUIProps) {
  return (
    <div className="flex flex-col gap-10 p-2">

      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif tracking-tight text-[#111827]">
            Overview
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Manage your salon operations and track growth metrics.
          </p>
        </div>

        <Button className="w-full md:w-auto bg-[#111111] text-white hover:bg-[#111827] shadow-sm rounded-lg px-6">
          <Plus className="mr-2 h-4 w-4" /> New Appointment
        </Button>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          description="From completed bookings"
          icon={<TrendingUp className="h-5 w-5 text-[#6b7280]" />}
          trend="up"
        />
        <StatCard
          label="Total Bookings"
          value={appointments.length.toString()}
          description="All appointments"
          icon={<Calendar className="h-5 w-5 text-[#6b7280]" />}
        />
        <StatCard
          label="Active Clients"
          value={customersCount.toString()}
          description="Customer database"
          icon={<Users className="h-5 w-5 text-[#6b7280]" />}
        />
        <StatCard
          label="Action Required"
          value={followUpsCount.toString()}
          description="Pending follow-ups"
          icon={<Clock className="h-5 w-5 text-[#6b7280]" />}
          highlight={followUpsCount > 0}
        />
      </div>

      {/* TODAY'S SCHEDULE */}
      <Card className="border-[#e5e7eb] bg-white shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-[#f8f6f2]/50 pb-4">
          <div>
            <CardTitle className="text-lg font-serif">
              Today's Schedule
            </CardTitle>
            <CardDescription>
              Appointments for today
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Calendar</DropdownMenuItem>
              <DropdownMenuItem>Export CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="p-0">
          {todaysAppointments.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              No bookings today
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {todaysAppointments.map((appt: any) => {
                  const status =
                    statusMap[appt.status] ||
                    statusMap["BOOKED"];

                  return (
                    <TableRow key={appt.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarFallback>
                              {appt.name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          {appt.name}
                        </div>
                      </TableCell>

                      <TableCell>
                        {appt.serviceName || appt.service}
                      </TableCell>

                      <TableCell>
                        {appt.startTime || appt.time}
                      </TableCell>

                      <TableCell>
                        <Badge className={status.class}>
                          {status.label}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        ₹{appt.price || 0}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  label,
  value,
  description,
  icon,
  highlight,
  trend,
}: any) {
  return (
    <Card
      className={`${
        highlight ? "ring-2 ring-gray-200" : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-gray-500">
              {label}
            </p>
            <h3 className="text-2xl font-bold">
              {value}
            </h3>
            <p className="text-xs text-gray-400">
              {description}
            </p>
          </div>
          <div>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}