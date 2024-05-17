"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Tooltip,
} from "@nextui-org/react";
import Login from "../http/login";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { FaKey } from "react-icons/fa";

export default function LoginPage() {
  const loginHttp = new Login();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const login = ()=>{
    setIsLoading(true);
    loginHttp.login(username, password).then((value) => {
      if (value.success == false) {
        toast.error(value.error!);
        setIsLoading(false);
      } else {
        toast.success("Welcome");
        setTimeout(() => {
          localStorage.setItem(
            "token",
            value.data?.access_token!
          );
          router.push("/panel/overview",{scroll : false});
        }, 1000);
      }
    });
  }

  return (
    
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            border: "10px",
            background: "#27272A",
            color: "#fff",
          },
        }}
      />
      <main className="flex h-screen justify-center mt-16 md:mt-0 md:items-center">
        <div className="hidden md:flex flex-col w-[380px] gap-4 border-1 pb-6 p-4 rounded-xl ">
          <div>
            <p className="font-bold text-xl">Login</p>
            <p className="text-xs">
              User and password you set for panel in server
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Input
              size="sm"
              label="Username"
              value={username}
              onChange={(value) => setUsername(value.target.value)}
              
            ></Input>
            <Input
              label="Password"
              size="sm"
              type="password"
              value={password}
              onChange={(value) => setPassword(value.target.value)}
            ></Input>
            <div className="flex w-full flex-col gap-2">
              <Button
                color="primary"
                isLoading={isLoading}
                onClick={() => login()}
              >
                Login
              </Button>
              <Button className="self-center" variant="light">
                <FaKey /> Forgot password
              </Button>
            </div>
          </div>
        </div>
        <div className="flex md:hidden flex-col w-full gap-24 p-4 rounded-xl ">
          <div className="flex flex-col gap-4 ">
            <p className="text-center font-bold text-5xl">Login</p>
            <p className="text-center text-sm">
              User and password you set for panel in server
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Input
              size="sm"
              label="Username"
              value={username}
              onChange={(value) => setUsername(value.target.value)}
            ></Input>
            <Input
              label="Password"
              size="sm"
              type="password"
              value={password}
              onChange={(value) => setPassword(value.target.value)}
            ></Input>
            <div className="flex w-full flex-col gap-4">
              <Button
                color="primary"
                isLoading={isLoading}
                onClick={() => login()}
              >
                Login
              </Button>
              <Button className="self-center" variant="light">
                <FaKey /> Forgot password
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
