import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * /register — previously used for mascot hunt sign-up.
 * Now redirects to the homepage.
 */
export default function Register() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/");
  }, [setLocation]);

  return null;
}
