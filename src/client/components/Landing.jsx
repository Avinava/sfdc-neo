import React, { useContext } from "react";

import { Button } from "@/components/ui/button";
import AuthContext from "./AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Link } from "react-router-dom";

export default function Hero() {
  const { session } = useContext(AuthContext);
  return (
    <React.Fragment>
      {session?.org?.Id && (
        <Card>
          <CardHeader>
            <CardTitle>Connected</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              You are connected to Salesforce as {session?.displayName} to the
              organization {session?.org?.Name}.
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Link to="/app">
              <Button variant="primary">Get Started</Button>
            </Link>
          </CardFooter>
        </Card>
      )}

      <div className="md:flex lg:flex md:gap-4 lg:gap-4">
        <Card className="md:w-1/2 lg:w-1/2">
          <CardHeader>
            <CardTitle>Production</CardTitle>
            <CardDescription>
              Connect to your Salesforce production environment.
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter className="border-t px-6 py-4">
            <a href="/api/v1/oauth/authorization/production">
              <Button>Get Started</Button>
            </a>
          </CardFooter>
        </Card>

        <Card className="md:w-1/2 lg:w-1/2">
          <CardHeader>
            <CardTitle>Sandbox</CardTitle>
            <CardDescription>
              Connect to your Salesforce sandbox environment.
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter className="border-t px-6 py-4">
            <a href="/api/v1/oauth/authorization/sandbox">
              <Button>Get Started</Button>
            </a>
          </CardFooter>
        </Card>
      </div>
    </React.Fragment>
  );
}
