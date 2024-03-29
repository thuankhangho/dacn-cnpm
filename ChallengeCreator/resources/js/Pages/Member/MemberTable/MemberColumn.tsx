"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/shadcn/ui/button"
import { Member } from "./MemberType"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "id",
    header: () => (
      <div
        style={{
          textAlign: "center"
        }}
      >ID</div>)
  },
  {
    accessorKey: "name",
    header: () => (
      <div
        style={{
          textAlign: "center"
        }}
      >Name</div>)
  },
  {
    accessorKey: "author",
    header: () => (
      <div
        style={{
          textAlign: "center"
        }}
      >Author</div>)
  },
  {
    accessorKey: "lastUpdated",
    header: () => (
      <div
        style={{
          textAlign: "center"
        }}
      >Last Updated</div>)
  },
]
export type { Member }