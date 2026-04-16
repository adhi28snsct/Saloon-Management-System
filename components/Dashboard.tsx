"use client";

import {
  TrendingUp,
  Calendar,
  Users,
  Clock,
  MoreHorizontal,
  Plus,
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
    class: "bg-amber-100 text-amber-800 border-amber-200",
  },
  ACCEPTED: {
    label: "Confirmed",
    class: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  COMPLETED: {
    label: "Completed",
    class: "bg-blue-100 text-blue-800 border-blue-200",
  },
  CANCELLED: {
    label: "Cancelled",
    class: "bg-red-100 text-red-700 border-red-200",
  },
};

interface DashboardUIProps {
  totalRevenue: number;
  appointments: any[];
  customersCount: number;
  followUpsCount: number;
  todaysAppointments: any[];
}

export default function DashboardUI({
  totalRevenue,
  appointments,
  customersCount,
  followUpsCount,
  todaysAppointments,
}: DashboardUIProps) {
  return (
    <div className="flex flex-col gap-10 p-4">

      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif tracking-tight text-slate-900">
            Overview
          </h1>
          <p className="text-sm text-slate-600">
            Manage your salon operations and track growth metrics.
          </p>
        </div>

        <Button className="w-full md:w-auto bg-black text-white hover:bg-slate-800 rounded-lg px-6">
          <Plus className="mr-2 h-4 w-4" /> New Appointment
        </Button>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          description="From completed bookings"
          icon={<TrendingUp className="h-5 w-5 text-slate-500" />}
        />
        <StatCard
          label="Total Bookings"
          value={appointments.length.toString()}
          description="All appointments"
          icon={<Calendar className="h-5 w-5 text-slate-500" />}
        />
        <StatCard
          label="Active Clients"
          value={customersCount.toString()}
          description="Customer database"
          icon={<Users className="h-5 w-5 text-slate-500" />}
        />
        <StatCard
          label="Action Required"
          value={followUpsCount.toString()}
          description="Pending follow-ups"
          icon={<Clock className="h-5 w-5 text-slate-500" />}
          highlight={followUpsCount > 0}
        />
      </div>

      {/* TODAY'S SCHEDULE */}
      <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50 pb-4">
          <div>
            <CardTitle className="text-lg font-serif text-slate-900">
              Today's Schedule
            </CardTitle>
            <CardDescription className="text-slate-600">
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
            <div className="py-20 text-center text-slate-600">
              No bookings today
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-700">Client</TableHead>
                  <TableHead className="text-slate-700">Service</TableHead>
                  <TableHead className="text-slate-700">Time</TableHead>
                  <TableHead className="text-slate-700">Status</TableHead>
                  <TableHead className="text-right text-slate-700">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {todaysAppointments.map((appt: any) => {
                  const status =
                    statusMap[appt.status] || statusMap["BOOKED"];

                  return (
                    <TableRow key={appt.id}>
                      <TableCell className="text-slate-800">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarFallback>
                              {appt.name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          {appt.name}
                        </div>
                      </TableCell>

                      <TableCell className="text-slate-700">
                        {appt.serviceName || appt.service}
                      </TableCell>

                      <TableCell className="text-slate-700">
                        {appt.startTime || appt.time}
                      </TableCell>

                      <TableCell>
                        <Badge className={status.class}>
                          {status.label}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right text-slate-800">
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
}: any) {
  return (
    <Card
      className={`bg-white border border-slate-200 rounded-2xl shadow-sm ${
        highlight ? "ring-2 ring-slate-300" : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs text-slate-600">{label}</p>
            <h3 className="text-2xl font-bold text-slate-900">
              {value}
            </h3>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
          <div>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}