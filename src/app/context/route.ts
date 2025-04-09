"use client";

import { useContext, createContext } from "react";

export interface Context {
  user: User | null;
  initialized: boolean;
  isPending: boolean;
  signup: (newUser: DBUser) => Promise<PromiseResult>;
  signin: (email: string, password: string) => Promise<PromiseResult>;
  signout: () => void;
}

export const initialState: Context = {
  user: null,

  initialized: false,
  isPending: false,

  signup: async () => ({}),
  signin: async () => ({}),
  signout: async () => ({}),
};

export const context = createContext(initialState);

export const use = () => useContext(context);
