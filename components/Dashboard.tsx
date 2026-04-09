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
} from "lucide-react";

// SHADCN / BASE UI COMPONENTS
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
return ( <div className="flex flex-col gap-8">


  {/* HEADER */}
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Monitoring your salon's growth and daily schedule.
      </p>
    </div>
    <Button className="w-full md:w-auto shadow-md active:scale-95 transition">
      <Plus className="mr-2 h-4 w-4" /> New Appointment
    </Button>
  </div>

  {/* KPI CARDS */}
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <StatCard
      label="Total Revenue"
      value={`₹${totalRevenue.toLocaleString()}`}
      description="Total from all bookings"
      icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
    />
    <StatCard
      label="Total Bookings"
      value={appointments.length.toString()}
      description="Lifetime appointments"
      icon={<Calendar className="h-4 w-4 text-blue-500" />}
    />
    <StatCard
      label="Active Clients"
      value={customersCount.toString()}
      description="Customers in database"
      icon={<Users className="h-4 w-4 text-orange-500" />}
    />
    <StatCard
      label="Pending Follow-ups"
      value={followUpsCount.toString()}
      description="Requires attention"
      icon={<Clock className="h-4 w-4 text-purple-500" />}
    />
  </div>

  {/* TODAY'S SCHEDULE */}
  <Card className="shadow-sm border-muted/60">
    <CardHeader className="flex flex-row items-center justify-between space-y-0">
      <div>
        <CardTitle className="text-xl">Today's Schedule</CardTitle>
        <CardDescription>
          You have {todaysAppointments.length} appointments scheduled for today.
        </CardDescription>
      </div>

      {/* ✅ FIXED DROPDOWN (CORRECT) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Full Calendar</DropdownMenuItem>
          <DropdownMenuItem>Download Report</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardHeader>

    <CardContent>
      {todaysAppointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg border-muted">
          <Calendar className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-medium">
            No appointments today
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[250px]">Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {todaysAppointments.map((appt: any) => (
              <TableRow key={appt.id} className="group transition-colors">
                
                {/* CLIENT */}
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                        {appt.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{appt.name}</span>
                  </div>
                </TableCell>

                {/* SERVICE */}
                <TableCell className="text-muted-foreground">
                  {appt.serviceName || appt.service}
                </TableCell>

                {/* TIME */}
                <TableCell className="font-medium">
                  {appt.startTime || appt.time}
                </TableCell>

                {/* STATUS */}
                <TableCell>
                  {appt.status === "BOOKED" || appt.status === "Confirmed" ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Confirmed
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-50 text-amber-700 border-amber-100 gap-1">
                      <AlertCircle className="h-3 w-3" /> Pending
                    </Badge>
                  )}
                </TableCell>

                {/* PRICE */}
                <TableCell className="text-right font-bold">
                  ₹{appt.price || 0}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </CardContent>
  </Card>
</div>


);
}

/* =========================
KPI CARD COMPONENT
========================= */
function StatCard({ label, value, description, icon }: any) {
return ( <Card className="hover:shadow-md transition-shadow border-muted/60"> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"> <CardTitle className="text-sm font-medium text-muted-foreground">
{label} </CardTitle> <div className="bg-muted/50 p-2 rounded-md">{icon}</div> </CardHeader> <CardContent> <div className="text-2xl font-bold tracking-tight">{value}</div> <p className="text-xs text-muted-foreground mt-1">{description}</p> </CardContent> </Card>
);
}
