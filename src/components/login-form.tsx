"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { useAuth } from "../../hooks/use-auth";

function LoginForm() {
  const { login } = useAuth();
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("employee");

  const canSubmit = employeeId.trim().length >= 3 && name.trim().length >= 2;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
  await login({ id: employeeId.trim(), name: name.trim(), role: role as 'employee' | 'admin' });
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <CardDescription>
        Enter your Employee ID and name to get started.
      </CardDescription>

      <div className="grid gap-2">
        <Label htmlFor="employeeId">Employee ID</Label>
        <Input
          id="employeeId"
          placeholder="e.g., EMP-1024"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
          autoComplete="username"
          aria-describedby="employeeIdHelp"
        />
        <p id="employeeIdHelp" className="text-xs text-muted-foreground">
          Minimum 3 characters.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          aria-describedby="nameHelp"
        />
        <p id="nameHelp" className="text-xs text-muted-foreground">
          Use your legal name as registered.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!canSubmit}
          size="lg"
          className="w-full sm:w-auto"
        >
          Login
        </Button>
      </div>
    </form>
  );
}

export { LoginForm };
