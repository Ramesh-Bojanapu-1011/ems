"use client";

import useSWR, { mutate as globalMutate } from "swr";
import { getItem, setItem, removeItem } from "@/lib/storage";

export type User = { id: string; name: string; role: "admin" | "employee" };

const USER_KEY = "ems.currentUser";

const fetchUser = async (): Promise<User | null> => {
  return getItem<User | null>(USER_KEY, null);
};

export function useAuth() {
  const { data: user } = useSWR<User | null>("ems.user", fetchUser, {
    fallbackData: null,
    revalidateOnFocus: false,
  });

  const login = async (u: User) => {
    setItem(USER_KEY, u);
    await globalMutate("ems.user", u, { revalidate: false });
  };

  const logout = async () => {
    removeItem(USER_KEY);
    await globalMutate("ems.user", null, { revalidate: false });
  };

  return { user, login, logout };
}
