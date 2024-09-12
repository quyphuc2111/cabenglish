"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  time: string
  amount: number
  paymentype: string
  note: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "time",
    header: "Thời gian",
    cell: ({ row }) => {
        const timeValue: Date = row.getValue("time");
    
        const date = new Date(timeValue);
    
        const formattedDate = new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(date);
    
        return <div className="font-medium">{formattedDate}</div>;
      },
  },
  {
    accessorKey: "paymentype",
    header: "Loại giao dịch",
  },
  {
    accessorKey: "note",
    header: "Nội dung",
  },
  {
    accessorKey: "amount",
    header: "Số xu sử dụng",
  },
]
