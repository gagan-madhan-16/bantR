"use client";

import { Button } from "@/components/ui/button";
import { Rocket, Stars } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const router = useRouter();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0E1B] text-white overflow-hidden relative">

      <div className="absolute inset-0 opacity-50">
        {[...Array(50)].map((_, i) => (
          <Stars
            key={i}
            className="absolute animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.5,
            }}
            size={Math.random() * 10 + 5}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 h-screen flex flex-col items-center justify-center">
        <div
          className="relative"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: "transform 0.2s ease-out",
          }}
        >

          <h1 className="text-[180px] font-bold leading-none text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 select-none">
            404
          </h1>

          <div className="absolute -top-20 -right-20 animate-bounce">
            <div className="relative">
              <Rocket size={100} className="text-white transform -rotate-45" />
              <div className="absolute -bottom-4 -left-2 w-16 h-16 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
            </div>
          </div>
        </div>

        <div className="text-center mt-8 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Houston, We Have a Problem!
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            The page you're looking for has drifted into deep space or never
            existed in this universe.
          </p>

            <Button
                className="relative z-50 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                onClick={() => {router.push("/")}}
            >
                <Link href="/">
                    Return to Home
                </Link>
            </Button>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20 animate-pulse -z-50 " />
    </div>
  );
}