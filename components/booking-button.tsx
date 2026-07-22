"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { openBooking } from "./motion-system";

type BookingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function BookingButton({ children, type = "button", ...props }: BookingButtonProps) {
  return (
    <button type={type} onClick={openBooking} {...props}>
      {children}
    </button>
  );
}
