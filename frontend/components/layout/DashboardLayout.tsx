"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import {
  Home,
  MapPin,
  Battery,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  X,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex">
        {/* Mobile sidebar toggle */}
        <div className="lg:hidden fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 lg:w-64 
            bg-card border-r z-30 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-4 space-y-8">
            <div className="flex items-center gap-2 border-b pb-4">
              <Battery className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">DEV Dashboard</span>
            </div>

            <nav className="space-y-1">
              <SidebarLink
                href="/dashboard"
                icon={<Home size={20} />}
                label="Dashboard"
              />
              <SidebarLink
                href="/journey-planner"
                icon={<MapPin size={20} />}
                label="Journey Planner"
                isActive
              />
              <SidebarLink
                href="/charging-points"
                icon={<Battery size={20} />}
                label="Charging Points"
              />
              <SidebarLink
                href="/transactions"
                icon={<CreditCard size={20} />}
                label="Transactions"
              />
              <SidebarLink
                href="/analytics"
                icon={<BarChart3 size={20} />}
                label="Analytics"
              />
              <SidebarLink
                href="/settings"
                icon={<Settings size={20} />}
                label="Settings"
              />
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  isActive = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
