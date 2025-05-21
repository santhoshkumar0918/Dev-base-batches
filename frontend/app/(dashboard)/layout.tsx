"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import {
  Home,
  MapPin,
  Battery,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Bell,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isConnected, address } = useAccount();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Battery className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DEV</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-muted">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-muted">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

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
          className={`fixed inset-y-0 left-0 top-16 transform lg:relative lg:translate-x-0 lg:w-64 
            bg-card border-r z-30 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-4 space-y-8">
            <div className="border-b pb-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium text-sm">
                  {address
                    ? `${address.slice(0, 6)}...${address.slice(-4)}`
                    : "Not Connected"}
                </div>
                <div className="text-xs text-muted-foreground">Driver</div>
              </div>
            </div>

            <nav className="space-y-1">
              <NavLink
                href="/dashboard"
                icon={<Home size={20} />}
                label="Dashboard"
              />
              <NavLink
                href="/journey-planner"
                icon={<MapPin size={20} />}
                label="Journey Planner"
                isActive={true}
              />
              <NavLink
                href="/charging-points"
                icon={<Battery size={20} />}
                label="Charging Points"
              />
              <NavLink
                href="/transactions"
                icon={<CreditCard size={20} />}
                label="Transactions"
              />
              <NavLink
                href="/analytics"
                icon={<BarChart3 size={20} />}
                label="Analytics"
              />
              <NavLink
                href="/settings"
                icon={<Settings size={20} />}
                label="Settings"
              />
            </nav>

            <div className="pt-4 border-t">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">DEV Balance</div>
                  <div className="text-sm font-bold">120 DEV</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Earn DEV tokens by using charging stations during off-peak
                  hours.
                </div>
              </div>
            </div>
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

function NavLink({
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
