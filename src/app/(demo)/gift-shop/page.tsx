"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import GiftCard from "@/components/gift-shop/gift-card";
import ListGifts from "@/components/gift-shop/list-gifts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Icon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

 const GiftData = [
  {
    title: "Số xu còn lại",
    content: {
      image:
        "https://static.edupia.vn/uploads/v3/assets/images/gift-shop/coin.svg",
      value: 4
    },
    footer: {
      image:
        "https://static.edupia.vn/uploads/v3/assets/images/gift-shop/clock-outline.svg",
      link: null,
      text: "Lịch sử dùng xu"
    },
    backgroundImage:
      "https://static.edupia.vn/uploads/v3/assets/images/gift-shop/remain-coin-bg.svg",
    image:
      "https://static.edupia.vn/uploads/v3/assets/images/gift-shop/coint-gift.svg",
    type: "history"
  },
  {
    title: "Số quà đã đổi",
    content: {
      image:
        "https://static.edupia.vn/uploads/v3/assets/images/gift-shop/gift.svg",
      value: 2
    },
    footer: {
      image:
        "https://static.edupia.vn/uploads/v3/assets/images/gift-shop/gift-outline.svg",
      link: "/gift-shop",
      text: "Đổi quà"
    },
    backgroundImage:
      "https://static.edupia.vn/uploads/v3/assets/images/gift-shop/exchanged-bg.svg",
    image:
      "https://static.edupia.vn/uploads/v3/assets/images/gift-shop/giftbox.svg",
    type: ""
  }
];

export default function GiftShopPage() {
  const [categories, setCategories] = useState("1");

  return (
    <ContentLayout title="GiftShop">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row gap-5">
          {GiftData.map((item, index) => {
            return (
              <GiftCard
                key={index}
                className="md:w-1/2 px-8 py-6 rounded-3xl shadow-course-inset flex flex-col gap-3 relative"
                title={item.title}
                content={item.content}
                footer={item.footer}
                backgroundImage={item.backgroundImage}
                image={item.image}
              />
            );
          })}
        </div>

        <div
          className={`flex justify-between ${
            categories === "1" ? "my-14" : "mt-14 mb-4"
          }`}
        >
          <Select defaultValue="1" onValueChange={setCategories}>
            <SelectTrigger className="w-[200px] py-6 rounded-2xl font-semibold shadow-sm bg-white">
              <SelectValue placeholder="Danh mục quà tặng" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">Danh mục quà tặng</SelectItem>
                <SelectItem value="2">Sticker Online</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button className="bg-white text-black rounded-2xl py-6 shadow-md">
            <Image
              src="https://static.edupia.vn/uploads/v3/assets/images/gift-shop/incoming.svg"
              alt="gift"
              width={28}
              height={26}
            />
            <span className="font-semibold ml-1">Quà của tôi</span>
          </Button>
        </div>

        {categories === "1" ? (
          <>
            <ListGifts title="Mới nhất" />
            <ListGifts title="Sticker online" />
          </>
        ) : (
          <>
            <p className="font-semibold">Sắp xếp:</p>
            <Select defaultValue="1">
              <SelectTrigger className="xl:w-3/5 py-6 rounded-2xl font-semibold shadow-sm bg-white">
                <SelectValue placeholder="Mặc định" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="1">Mặc định</SelectItem>
                  <SelectItem value="2">Xu từ cao đến thấp</SelectItem>
                  <SelectItem value="3">Xu từ thấp đến cao</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <p className="font-semibold">Bộ lọc:</p>
            <div className="flex gap-5 p-4 bg-white rounded-2xl flex-wrap border xl:w-3/5 shadow-sm">
              <div className="flex items-center space-x-2">
                <Checkbox id="trafic" />
                <label
                  htmlFor="trafic"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Phương tiện giao thông
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="fruit" />
                <label
                  htmlFor="fruit"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Trái cây
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="villa" />
                <label
                  htmlFor="villa"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Biệt thự - Nhà lầu
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="hero" />
                <label
                  htmlFor="hero"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Siêu anh hùng
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="anime" />
                <label
                  htmlFor="anime"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Nhân vật hoạt hình
                </label>
              </div>
            </div>
            <ListGifts />
          </>
        )}
      </div>
    </ContentLayout>
  );
}
