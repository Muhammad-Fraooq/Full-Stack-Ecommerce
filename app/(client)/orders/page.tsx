import Container from "@/components/Container";
import OrdersComponents from "@/components/OrdersComponents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMyOrders } from "@/sanity/helpers";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";


// Mark the component as an async function since it contains server-side logic
const OrdersPage = async () => {
  // Fetch the authenticated user ID from Clerk
  const { userId } = await auth();

  // Server-side redirect if no user is logged in
  if (!userId) {
    return redirect("/");
  }

  // Fetch orders using the userId
  const orders = await getMyOrders(userId);

  return (
    <Container className="py-10">
      {/* Conditionally render orders or an empty state */}
      {orders?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Order List</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] md:w-auto">Order Number</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                {/* Render the orders using the OrdersComponents */}
                <OrdersComponents orders={orders} />
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col justify-center items-center py-12 px-4"
      >
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl font-semibold text-gray-900"
        >
          No orders Found.
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-2 text-sm text-gray-600 max-w-md text-center"
        >
          It looks like you haven&apos;t placed any orders yet. Start shopping to
          see your orders here!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6"
        >
          <Link
            href="/shop"
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100 transition"
          >
            Browse Products
          </Link>
        </motion.div>
      </motion.div>
  
      )}
    </Container>
  );
};

export default OrdersPage;
