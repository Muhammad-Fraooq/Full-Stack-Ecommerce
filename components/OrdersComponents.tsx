"use client";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import React, { useState } from "react";
import { TableBody, TableCell, TableRow } from "./ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import PriceFomatter from "./PriceFomatter";
import OrdersDetialsDailog from "./OrdersDetailsDialog";

const OrdersComponents = ({ orders }: { orders: MY_ORDERS_QUERYResult }) => {
  const [selectedorders, setSelectedorders] = useState<
    MY_ORDERS_QUERYResult[number] | null
  >(null);
  const handleOrderClicked = (order: MY_ORDERS_QUERYResult[number]) => {
    setSelectedorders(order);
  };
  return (
    <>
      <TableBody>
        <TooltipProvider>
          {orders?.map((order) => (
            <Tooltip key={order?.orderNumber}>
              <TooltipTrigger asChild>
                <TableRow
                  onClick={() => handleOrderClicked(order)}
                  className="cursor-pointer hover:bg-gray-100 h-12"
                >
                  <TableCell className="font-medium">
                    {order?.orderNumber?.slice(-10) ?? "N/A"}...
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {order?.orderDate &&
                      new Date(order?.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {order?.customerName}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {order?.email}
                  </TableCell>
                  <TableCell>
                    <PriceFomatter
                      amount={order?.totalPrice}
                      className="text-black font-medium"
                    />
                  </TableCell>
                  <TableCell>
                    {order?.status && (
                      <span
                        className={`capitalize px-2 py-1 rounded-lg text-sm font-semibold ${order?.status === "paid" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}
                      >
                        {order?.status}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to see orders details</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </TableBody>
      <OrdersDetialsDailog
        order={selectedorders}
        isOpen={!!selectedorders}
        onClose={() => setSelectedorders(null)}
      />
    </>
  );
};

export default OrdersComponents;
