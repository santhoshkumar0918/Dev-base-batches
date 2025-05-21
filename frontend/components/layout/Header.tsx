// components/layout/Header.tsx
"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";
import {
  Zap,
  User,
  ChevronDown,
  LogOut,
  Settings,
  Home
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { isConnected, address } = useAccount();
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle hydration issues with NextJS
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // If the component hasn't mounted yet (client-side), don't render wallet-related elements
  if (!isMounted) {
    return (
      <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DEV</span>
          </div>
          
          <nav className="hidden md:flex gap-8 font-medium">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
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
            {/* Placeholder for wallet connection */}
            <Button variant="default" size="sm">Connect</Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">DEV</span>
        </div>

        <nav className="hidden md:flex gap-8 font-medium">
          <Link
            href="/"
            className="text-foreground hover:text-primary transition-colors"
          >
            Home
          </Link>
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
          {!isConnected ? (
            <>
              <Link href="/register">
                <Button variant="outline" size="sm">
                  Sign Up
                </Button>
              </Link>
              <ConnectButton.Custom>
                {(props: Parameters<NonNullable<React.ComponentProps<typeof ConnectButton.Custom>['children']>>[0]) => {
                  const { account, chain, openAccountModal, openChainModal, openConnectModal, mounted } = props;
                  return (
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={openConnectModal}
                    >
                      Connect Wallet
                    </Button>
                  );
                }}
              </ConnectButton.Custom>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-muted">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Disconnect</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;




// // components/layout/Header.tsx
// "use client";

// import { useState, useEffect } from "react";
// // Fix: Add type definitions for rainbowkit properties
// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { useAccount } from "wagmi";
// import Link from "next/link";
// import {
//   Zap,
//   User,
//   ChevronDown,
//   LogOut,
//   Settings,
//   Home
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// // Add type definitions for RainbowKit's ConnectButton.Custom props
// interface ConnectButtonProps {
//   openConnectModal?: () => void;
//   openAccountModal?: () => void;
//   openChainModal?: () => void;
//   account?: { address: string; displayName: string };
//   chain?: { id: number; name: string };
//   mounted?: boolean;
// }

// const Header = () => {
//   const { isConnected, address } = useAccount();
//   const [isMounted, setIsMounted] = useState(false);
  
//   // Handle hydration issues with NextJS
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);
  
//   // If the component hasn't mounted yet (client-side), don't render wallet-related elements
//   if (!isMounted) {
//     return (
//       <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md">
//         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Zap className="h-6 w-6 text-primary" />
//             <span className="text-xl font-bold">DEV</span>
//           </div>
          
//           <nav className="hidden md:flex gap-8 font-medium">
//             <Link
//               href="/"
//               className="text-foreground hover:text-primary transition-colors"
//             >
//               Home
//             </Link>
//             <Link
//               href="#features"
//               className="text-muted-foreground hover:text-primary transition-colors"
//             >
//               Features
//             </Link>
//             <Link
//               href="#how-it-works"
//               className="text-muted-foreground hover:text-primary transition-colors"
//             >
//               How It Works
//             </Link>
//             <Link
//               href="#join-network"
//               className="text-muted-foreground hover:text-primary transition-colors"
//             >
//               Join Network
//             </Link>
//           </nav>
          
//           <div className="flex items-center gap-4">
//             <Link href="/register">
//               <Button variant="outline" size="sm">
//                 Sign Up
//               </Button>
//             </Link>
//             {/* Placeholder for wallet connection */}
//             <Button variant="default" size="sm">Connect</Button>
//           </div>
//         </div>
//       </header>
//     );
//   }

//   return (
//     <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md">
//       <div className="container mx-auto px-4 h-16 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Zap className="h-6 w-6 text-primary" />
//           <span className="text-xl font-bold">DEV</span>
//         </div>

//         <nav className="hidden md:flex gap-8 font-medium">
//           <Link
//             href="/"
//             className="text-foreground hover:text-primary transition-colors"
//           >
//             Home
//           </Link>
//           <Link
//             href="#features"
//             className="text-muted-foreground hover:text-primary transition-colors"
//           >
//             Features
//           </Link>
//           <Link
//             href="#how-it-works"
//             className="text-muted-foreground hover:text-primary transition-colors"
//           >
//             How It Works
//           </Link>
//           <Link
//             href="#join-network"
//             className="text-muted-foreground hover:text-primary transition-colors"
//           >
//             Join Network
//           </Link>
//         </nav>

//         <div className="flex items-center gap-4">
//           {!isConnected ? (
//             <>
//               <Link href="/register">
//                 <Button variant="outline" size="sm">
//                   Sign Up
//                 </Button>
//               </Link>
//               <div className="fixed top-0 right-0 left-0 z-50">
//                 <ConnectButton.Custom>
//                   {({
//                     openConnectModal,
//                     // Only destructure what we need to avoid TypeScript errors
//                   }: ConnectButtonProps) => {
//                     return (
//                       <Button 
//                         variant="default" 
//                         size="sm" 
//                         onClick={openConnectModal}
//                       >
//                         Connect Wallet
//                       </Button>
//                     );
//                   }}
//                 </ConnectButton.Custom>
//               </div>
//             </>
//           ) : (
//             <div className="flex items-center gap-4">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-muted">
//                     <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
//                       <User className="h-4 w-4 text-primary" />
//                     </div>
//                     <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-56">
//                   <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem className="cursor-pointer">
//                     <User className="mr-2 h-4 w-4" />
//                     <span>Profile</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem className="cursor-pointer">
//                     <Home className="mr-2 h-4 w-4" />
//                     <span>Dashboard</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem className="cursor-pointer">
//                     <Settings className="mr-2 h-4 w-4" />
//                     <span>Settings</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem className="cursor-pointer">
//                     <LogOut className="mr-2 h-4 w-4" />
//                     <span>Disconnect</span>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;