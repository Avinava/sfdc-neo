import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import rsmLogo from "../../../public/rsm-logo.png";

export default function Login() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <img src={rsmLogo} alt="RSM Logo" className="w-20 mx-auto" />
            <h1 className="text-3xl font-bold">Login</h1>
            {/* <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p> */}
          </div>
          <div className="grid gap-4">
            <a href="/api/v1/auth/production">
              <Button type="submit" className="w-full">
                Login using RSM Production
              </Button>
            </a>
            <a href="/api/v1/auth/production">
              <Button variant="outline" className="w-full">
                Login using RSM Community
              </Button>
            </a>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block"></div>
    </div>
  );
}
