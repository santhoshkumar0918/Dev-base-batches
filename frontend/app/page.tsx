// app/page.tsx
"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Zap,
  Shield,
  BadgePercent,
  Car,
  Home,
  Building2,
  Navigation,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("driver");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DEV</span>
          </div>

          <nav className="hidden md:flex gap-8 font-medium">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#join-network"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Join Network
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/register">
              <Button variant="outline" size="sm">
                Sign Up
              </Button>
            </Link>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-muted/50 to-background overflow-hidden">
          <div className="container mx-auto px-4 flex flex-col items-center">
            <div className="w-full max-w-3xl text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                India's First Decentralized{" "}
                <span className="text-primary">Electric Vehicle</span> Network
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Eliminating range anxiety with a community-powered charging
                network that connects drivers with thousands of charging points
                across the country.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  Find Charging Points <ChevronRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  Become a Host <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative w-full max-w-5xl h-72 md:h-96 bg-gray-200 rounded-xl overflow-hidden shadow-xl">
              {/* Map placeholder with centered location card */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-background flex items-center justify-center">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-background/80 backdrop-blur-md rounded-xl border shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Current Location</h3>
                      <p className="text-sm text-muted-foreground">
                        Finding nearest...
                      </p>
                    </div>
                    <MapPin className="text-primary h-5 w-5" />
                  </div>
                  <div className="space-y-3">
                    <div className="bg-background/90 p-3 rounded-lg border flex justify-between">
                      <div>
                        <p className="font-medium">Ananya's Home</p>
                        <p className="text-xs text-muted-foreground">
                          2.1 km • Available now
                        </p>
                      </div>
                      <div className="text-green-500 text-sm font-medium">
                        ₹12/kWh
                      </div>
                    </div>
                    <div className="bg-background/90 p-3 rounded-lg border flex justify-between">
                      <div>
                        <p className="font-medium">Central Mall</p>
                        <p className="text-xs text-muted-foreground">
                          3.5 km • 1 spot free
                        </p>
                      </div>
                      <div className="text-green-500 text-sm font-medium">
                        ₹15/kWh
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="w-full mt-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 md:gap-x-10 text-center">
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-primary">
                    2500+
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Virtual Charging Points
                  </p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-primary">
                    12
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Cities Covered
                  </p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-primary">
                    750+
                  </p>
                  <p className="text-sm text-muted-foreground">EV Drivers</p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-primary">
                    100%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Trustless Transactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Why Choose DEV Network?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our decentralized platform solves India's EV infrastructure
                challenge by instantly activating thousands of potential
                charging points.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="bg-background border">
                <CardHeader>
                  <Zap className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Smart Journey Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    AI-powered routing that considers your vehicle's battery
                    capacity, driving conditions, and real-time charging point
                    availability.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background border">
                <CardHeader>
                  <Shield className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Blockchain-Secured Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Transparent, trustless transactions between drivers and
                    hosts with no intermediaries taking a cut or imposing hidden
                    fees.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background border">
                <CardHeader>
                  <BadgePercent className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Smart Rewards System</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Earn tokens for flexible charging behavior, helping optimize
                    the entire network while saving money on your charging
                    costs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How DEV Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform connects EV drivers with charging point hosts
                through a secure blockchain network.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-muted transform md:-translate-x-1/2"></div>

                {/* Steps */}
                <div className="space-y-16">
                  {/* Step 1 */}
                  <div className="relative grid md:grid-cols-2 gap-8 items-center">
                    <div className="order-2 md:order-1 md:text-right">
                      <div className="relative">
                        <div className="absolute top-0 left-0 md:left-auto md:right-0 -translate-y-1/2 translate-x-2 md:translate-x-1/2 z-10 w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center font-bold shadow-lg">
                          1
                        </div>
                        <h3 className="text-xl font-bold mb-2 mt-2">
                          Register & Connect Wallet
                        </h3>
                        <p className="text-muted-foreground">
                          Create your account as a driver or host and connect
                          your wallet for secure transactions.
                        </p>
                      </div>
                    </div>
                    <div className="order-1 md:order-2 bg-muted/20 rounded-xl p-6 shadow-sm border">
                      <div className="rounded-lg bg-background p-4 border shadow">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">DEV Registration</h4>
                            <p className="text-xs text-muted-foreground">
                              Choose your role
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                          >
                            <Car className="h-4 w-4" /> I'm an EV Driver
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                          >
                            <Home className="h-4 w-4" /> I'm a Charging Host
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative grid md:grid-cols-2 gap-8 items-center">
                    <div className="bg-muted/20 rounded-xl p-6 shadow-sm border">
                      <div className="rounded-lg bg-background p-4 border shadow">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">
                              Find Charging Points
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Near your destination
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="rounded-md border p-2 flex justify-between items-center">
                            <div className="flex gap-2">
                              <Building2 className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">
                                  City Centre Mall
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  3.2 km away • 22kW
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="secondary">
                              Book
                            </Button>
                          </div>
                          <div className="rounded-md border p-2 flex justify-between items-center">
                            <div className="flex gap-2">
                              <Home className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">
                                  Rajesh's Parking
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  1.5 km away • 7kW
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="secondary">
                              Book
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <div className="absolute top-0 left-0 -translate-y-1/2 translate-x-2 z-10 w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center font-bold shadow-lg">
                          2
                        </div>
                        <h3 className="text-xl font-bold mb-2 mt-2">
                          Find or List Charging Points
                        </h3>
                        <p className="text-muted-foreground">
                          Drivers can find and book available charging points,
                          while hosts can list their electrical capacity.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative grid md:grid-cols-2 gap-8 items-center">
                    <div className="order-2 md:order-1 md:text-right">
                      <div className="relative">
                        <div className="absolute top-0 left-0 md:left-auto md:right-0 -translate-y-1/2 translate-x-2 md:translate-x-1/2 z-10 w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center font-bold shadow-lg">
                          3
                        </div>
                        <h3 className="text-xl font-bold mb-2 mt-2">
                          Charge & Pay Securely
                        </h3>
                        <p className="text-muted-foreground">
                          Arrive at your chosen location, charge your vehicle,
                          and payments are automatically processed through smart
                          contracts.
                        </p>
                      </div>
                    </div>
                    <div className="order-1 md:order-2 bg-muted/20 rounded-xl p-6 shadow-sm border">
                      <div className="rounded-lg bg-background p-4 border shadow">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <Zap className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">
                                Charging in Progress
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Ananya's Home Charger
                              </p>
                            </div>
                          </div>
                          <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            Active
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Energy delivered
                            </span>
                            <span className="font-medium">12.8 kWh</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Time elapsed
                            </span>
                            <span className="font-medium">2h 15m</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Current cost
                            </span>
                            <span className="font-medium">₹153.60</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: "65%" }}
                            ></div>
                          </div>
                          <Button className="w-full mt-2">
                            End Charging Session
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative grid md:grid-cols-2 gap-8 items-center">
                    <div className="bg-muted/20 rounded-xl p-6 shadow-sm border">
                      <div className="rounded-lg bg-background p-4 border shadow">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <BadgePercent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Rewards Summary</h4>
                            <p className="text-xs text-muted-foreground">
                              Your activity this month
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="rounded-md border p-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">
                                Off-peak charging
                              </span>
                              <span className="text-sm text-green-600">
                                +15 DEV
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Charged during grid low-demand hours
                            </p>
                          </div>
                          <div className="rounded-md border p-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">
                                Flexible schedule
                              </span>
                              <span className="text-sm text-green-600">
                                +8 DEV
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Accepted alternative charging time
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <div className="absolute top-0 left-0 -translate-y-1/2 translate-x-2 z-10 w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center font-bold shadow-lg">
                          4
                        </div>
                        <h3 className="text-xl font-bold mb-2 mt-2">
                          Earn Rewards & Build Network
                        </h3>
                        <p className="text-muted-foreground">
                          Both drivers and hosts earn DEV tokens for positive
                          behaviors that help optimize the network for everyone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Join the Network */}
        <section id="join-network" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Join the DEV Network</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether you're an EV driver looking for reliable charging or a
                potential host wanting to earn from your electrical capacity,
                we've got you covered.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="driver" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger
                    value="driver"
                    onClick={() => setActiveTab("driver")}
                  >
                    I'm an EV Driver
                  </TabsTrigger>
                  <TabsTrigger
                    value="host"
                    onClick={() => setActiveTab("host")}
                  >
                    I'm a Charging Host
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="driver" className="space-y-6">
                  <Card className="border">
                    <CardHeader>
                      <CardTitle>EV Driver Benefits</CardTitle>
                      <CardDescription>
                        Find reliable charging wherever you go
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Expanded Network</h4>
                          <p className="text-sm text-muted-foreground">
                            Access thousands of charging points across
                            residential, commercial, and municipal locations.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Navigation className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            Smart Journey Planning
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Eliminate range anxiety with AI-powered routing
                            tailored to your vehicle.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <BadgePercent className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Token Rewards</h4>
                          <p className="text-sm text-muted-foreground">
                            Earn DEV tokens for flexible charging behavior that
                            can be used for discounts.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Join as a Driver</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="host" className="space-y-6">
                  <Card className="border">
                    <CardHeader>
                      <CardTitle>Charging Host Benefits</CardTitle>
                      <CardDescription>
                        Monetize your electrical capacity
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Zap className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">New Revenue Stream</h4>
                          <p className="text-sm text-muted-foreground">
                            Earn income from your existing electrical
                            infrastructure with minimal investment.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Full Control</h4>
                          <p className="text-sm text-muted-foreground">
                            Set your own availability, pricing, and access
                            preferences with our flexible system.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Shield className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Secure Transactions</h4>
                          <p className="text-sm text-muted-foreground">
                            Receive guaranteed payments through
                            blockchain-secured smart contracts.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Become a Host</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Join India's EV Revolution?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Be part of the solution to India's EV infrastructure challenge
                while earning rewards and reducing your carbon footprint.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="gap-2">
                  Create Account <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-transparent text-white border-white hover:bg-white/10 hover:text-white"
                >
                  Learn More <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">DEV</span>
              </div>
              <p className="text-sm text-muted-foreground">
                India's first decentralized electric vehicle charging network
                powered by blockchain technology.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Find Charging Points
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Become a Host
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Journey Planning
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Reward System
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Partners
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2025 DEV Network. All rights reserved.
            </p>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
