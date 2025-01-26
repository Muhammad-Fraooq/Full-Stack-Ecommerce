import { SALE_QUERYResult } from "@/sanity.types";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import Image from "next/legacy/image";
import { urlFor } from "@/sanity/lib/image";
import { Button } from "./ui/button";
import Link from "next/link";

const DiscountBanner = ({ sales }: { sales: SALE_QUERYResult }) => {
  return (
    <Carousel className="w-full max-w-screen-xl mx-auto relative overflow-hidden">
      <CarouselContent>
        {sales?.map((sale) => (
          <CarouselItem key={sale?._id} className="p-4 pr-0">
            {/* Card Component */}
            <Card className="shadow-md hover:shadow-xl transition-shadow rounded-md overflow-hidden">
              <CardContent className="flex flex-col lg:flex-row items-center justify-around gap-6 p-6 lg:p-10">
                {/* Text Content */}
                <div className="flex flex-col justify-center items-start text-center">
                  <Badge
                    variant="secondary"
                    className="mb-4 text-darkBlue capitalize text-lg bg-blue-100 px-3 py-1"
                  >
                    {sale?.badge} {sale?.discountAmount}% OFF
                  </Badge>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                    {sale?.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{sale?.description}</p>
                  <p className="text-sm md:text-base font-medium mb-4">
                    Use code:{" "}
                    <span className="font-semibold uppercase text-primary">
                      {sale?.couponCode}
                    </span>{" "}
                    for{" "}
                    <span className="font-semibold">
                      {sale?.discountAmount}% OFF
                    </span>
                  </p>
                  <Link href="/shop">
                    <Button size={'lg'} className="bg-darkBlue font-semibold text-white hover:bg-blue-500 shadow-md">
                      Shop Now
                    </Button>
                  </Link>
                </div>

                {/* Image */}
                {sale?.image && (
                  <div className="w-full lg:w-1/2 h-auto flex items-center justify-center">
                    <Image
                      src={urlFor(sale?.image).url()}
                      alt="Sale Banner"
                      width={450}
                      height={450}
                      className="h-auto object-contain rounded-lg shadow-lg transition-transform hover:scale-105 duration-500 ease-in-out"
                      priority
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation Arrows */}
      <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 p-3 rounded-full shadow-md z-10 transition" />
      <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 p-3 rounded-full shadow-md z-10 transition" />
    </Carousel>
  );
};

export default DiscountBanner;
