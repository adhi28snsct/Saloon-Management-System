"use client";

import {
  TrendingUp,
  Calendar,
  Users,
  Clock,
  MoreHorizontal,
  Plus,
  CheckCircle2,
  AlertCircle,
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
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif tracking-tight text-[#111827]">
            Overview
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Manage your salon operations and track growth metrics.
          </p>
        </div>
        <Button className="w-full md:w-auto bg-[#111111] text-white hover:bg-[#111827] shadow-sm transition-all rounded-lg active:scale-95 px-6">
          <Plus className="mr-2 h-4 w-4" strokeWidth={2} /> New Appointment
        </Button>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          description="+12% from last month"
          icon={<TrendingUp className="h-5 w-5 text-[#6b7280]" />}
          trend="up"
        />
        <StatCard
          label="Total Bookings"
          value={appointments.length.toString()}
          description="Lifetime appointments"
          icon={<Calendar className="h-5 w-5 text-[#6b7280]" />}
        />
        <StatCard
          label="Active Clients"
          value={customersCount.toString()}
          description="Database size"
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

      {/* TODAY'S SCHEDULE TABLE */}
      <Card className="border-[#e5e7eb] bg-white shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#e5e7eb] bg-[#f8f6f2]/50 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-serif text-[#111827]">Today&apos;s Schedule</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Upcoming appointments for today
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-slate-200 text-slate-600">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>View Calendar</DropdownMenuItem>
              <DropdownMenuItem>Export CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="p-0">
          {todaysAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-900 font-semibold">No bookings today</p>
              <p className="text-slate-400 text-sm">New appointments will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Client</TableHead>
                    <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Service</TableHead>
                    <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Time</TableHead>
                    <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                    <TableHead className="py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Amount</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {todaysAppointments.map((appt: any) => (
                    <TableRow key={appt.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-slate-100">
                            <AvatarFallback className="bg-indigo-50 text-indigo-700 text-xs font-bold">
                              {appt.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-bold text-slate-700">{appt.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500 font-medium">
                        {appt.serviceName || appt.service}
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-600">
                          <Clock className="h-3 w-3" />
                          {appt.startTime || appt.time}
                        </div>
                      </TableCell>
                      <TableCell>
                        {appt.status === "BOOKED" || appt.status === "Confirmed" ? (
                          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/50 font-bold text-[10px] uppercase tracking-tighter">
                            Confirmed
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100/50 font-bold text-[10px] uppercase tracking-tighter">
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm font-black text-slate-900">₹{appt.price || 0}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value, description, icon, highlight, trend }: any) {
  return (
    <Card className={`group border-[#e5e7eb] bg-white transition-all duration-200 hover:shadow-md hover:border-[#d1d5db] ${highlight ? 'ring-2 ring-gray-200' : ''} rounded-2xl`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">{label}</p>
            <div className="flex flex-col gap-1">
              <h3 className="text-3xl font-serif tracking-tight text-[#111827]">{value}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                {trend === 'up' && <ArrowUpRight className="h-3 w-3 text-gray-400" />}
                <p className="text-[11px] font-medium text-gray-500">{description}</p>
              </div>
            </div>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8f6f2] transition-colors group-hover:bg-[#f1efe9]`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}