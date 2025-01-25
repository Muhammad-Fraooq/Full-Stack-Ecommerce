import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/legacy/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import PriceFomatter from "./PriceFomatter";

interface Props {
  order: MY_ORDERS_QUERYResult[number] | null;
  isOpen: boolean;
  onClose: () => void;
}
const OrdersDetialsDailog: React.FC<Props> = ({ order, isOpen, onClose }) => {
  if (!order) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
        </DialogHeader>
        <div>
          <p>
            <strong>Customer:</strong>
            {order?.customerName}
          </p>
          <p>
            <strong>Email:</strong>
            {order?.email}
          </p>
          <p>
            <strong>Data:</strong>
            {order?.orderDate && new Date(order.orderDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong>
            {order?.status}
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quntity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order?.products?.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-2">
                  {product?.product?.image && (
                    <Link href={`/product/${product?.product.slug?.current}`}>
                      <Image
                        src={urlFor(product?.product?.image).url()}
                        alt="productimage"
                        width={50}
                        height={50}
                        // objectFit="cover"
                        className="border rounded-sm hover:scale-105 hoverEffect"
                      />
                    </Link>
                  )}
                  {product?.product && product?.product?.name}
                </TableCell>
                <TableCell className="mr-3">{product?.quantity}</TableCell>
                <TableCell>
                  <PriceFomatter
                    className="text-black font-medium"
                    amount={product?.product?.price}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="text-right mt-4">
          <strong>Total:</strong>
          <PriceFomatter amount={order?.totalPrice} className="text-black font-bold" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrdersDetialsDailog;
