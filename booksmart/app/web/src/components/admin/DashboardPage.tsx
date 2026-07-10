import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Calendar, Users, TrendingUp, DollarSign, Clock } from "lucide-react";
import { get } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import type { Appointment, BookingStatus } from "@/lib/api";

export function DashboardPage() {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    todayCount: 0,
    noShowRate: 0,
    reviewResponseRate: 0,
    newClients30d: 0,
    noShowCostSavings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [today, upcoming, dashboardStats] = await Promise.all([
          get<Appointment[]>("/appointments?date=today"),
          get<Appointment[]>("/appointments?range=upcoming&days=7"),
          get<{
            today_count: number;
            no_show_rate: number;
            review_response_rate: number;
            new_clients_30d: number;
            no_show_cost_savings: number;
          }>("/dashboard/stats"),
        ]);

        setTodayAppointments(today);
        setUpcomingAppointments(upcoming);
        setStats({
          todayCount: dashboardStats.today_count,
          noShowRate: dashboardStats.no_show_rate,
          reviewResponseRate: dashboardStats.review_response_rate,
          newClients30d: dashboardStats.new_clients_30d,
          noShowCostSavings: dashboardStats.no_show_cost_savings,
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Today's Appointments",
      value: stats.todayCount,
      icon: Calendar,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "No-Show Rate (30d)",
      value: `${(stats.noShowRate * 100).toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-red-600 bg-red-100",
    },
    {
      title: "Review Response Rate",
      value: `${(stats.reviewResponseRate * 100).toFixed(1)}%`,
      icon: Users,
      color: "text-green-600 bg-green-100",
    },
    {
      title: "New Clients (30d)",
      value: stats.newClients30d,
      icon: Users,
      color: "text-purple-600 bg-purple-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No appointments today.
              </p>
            ) : (
              <div className="space-y-3">
                {todayAppointments
                  .sort(
                    (a, b) =>
                      new Date(a.start_time).getTime() -
                      new Date(b.start_time).getTime()
                  )
                  .map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center gap-4 rounded-lg border border-gray-100 p-3"
                    >
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900">
                          {format(parseISO(apt.start_time), "h:mm")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(parseISO(apt.start_time), "a")}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {apt.client_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {apt.client_email}
                        </p>
                      </div>
                      <Badge
                        className={STATUS_COLORS[apt.status as BookingStatus]}
                      >
                        {STATUS_LABELS[apt.status as BookingStatus]}
                      </Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">No-Show Cost Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  ${stats.noShowCostSavings.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Saved this month from no-show prevention
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
              Your no-show rate of {(stats.noShowRate * 100).toFixed(1)}% is{" "}
              {stats.noShowRate < 0.05 ? "excellent" : stats.noShowRate < 0.1 ? "good" : "needs improvement"}.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upcoming (Next 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">
              No upcoming appointments.
            </p>
          ) : (
            <div className="space-y-2">
              {upcomingAppointments.slice(0, 10).map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 rounded-lg border border-gray-100 p-3"
                >
                  <div className="text-center min-w-[60px]">
                    <p className="text-xs font-medium text-gray-500">
                      {format(parseISO(apt.start_time), "MMM d")}
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {format(parseISO(apt.start_time), "h:mm a")}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {apt.client_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {apt.client_email}
                    </p>
                  </div>
                  <Badge
                    className={STATUS_COLORS[apt.status as BookingStatus]}
                  >
                    {STATUS_LABELS[apt.status as BookingStatus]}
                  </Badge>
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
