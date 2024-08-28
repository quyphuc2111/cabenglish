"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import Image from "next/image";
import GiftCard from "../gift-shop/gift-card";
import { Button } from "../ui/button";
import SectionTitle from "../section-title";
import SectionContent from "../section-content";
import { ACCOUNT_INFOMATION } from "@/mock/data";
import { formatDate } from "date-fns";
import UserInfoModal from "../modal/user-info-modal";
import LogoutButton from "./logout-button";
import { useRouter, useSearchParams } from "next/navigation";

const LeaderBoardData = [
  {
    rank: 1,
    name: "phongnh",
    score: 98,
    avatarUrl: "https://static.edupia.vn/images/avata_system/55.png"
  },
  {
    rank: 2,
    name: "nguyenyeunhi",
    score: 10,
    avatarUrl: "https://static.edupia.vn/images/avata_system/55.png"
  },
  {
    rank: 3,
    name: "nam15122012",
    score: 28,
    avatarUrl: "https://static.edupia.vn/images/avata_system/55.png"
  },
  {
    rank: 4,
    name: "beantom",
    score: 48,
    avatarUrl: "https://static.edupia.vn/images/avata_system/55.png"
  },
  {
    rank: 5,
    name: "John Doe",
    score: 18,
    avatarUrl: "https://static.edupia.vn/images/avata_system/55.png"
  }
];

const rankingImage = [
  {
    rank: 1,
    image:
      "https://static.edupia.vn/uploads/v3/assets/images/learning-report/top-1.png"
  },
  {
    rank: 2,
    image:
      "https://static.edupia.vn/uploads/v3/assets/images/learning-report/top-2.png"
  },
  {
    rank: 3,
    image:
      "https://static.edupia.vn/uploads/v3/assets/images/learning-report/top-3.png"
  }
];

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
      link: '/gift-shop',
      text: "Đổi quà"
    },
    backgroundImage:
      "https://static.edupia.vn/uploads/v3/assets/images/gift-shop/exchanged-bg.svg",
    image:
      "https://static.edupia.vn/uploads/v3/assets/images/gift-shop/giftbox.svg",
    type: ""
  }
];

const resolveRankingImage: any = (index: string) => {
  const rankImage = rankingImage.find(
    (image) => image.rank === parseInt(index)
  );
  return rankImage?.image;
};

const TabContent = [
  {
    index: 1,
    title: "Báo cáo học tập"
  },
  {
    index: 2,
    title: "Bảng vinh danh"
  },
  {
    index: 3,
    title: "Quà của tôi"
  },
  {
    index: 4,
    title: "Quản trị thông tin tài khoản"
  }
];

function ListGroup() {
  const { userInfo, parentInfo, studentInfo } = ACCOUNT_INFOMATION;

  const router = useRouter()
  const searchParams = useSearchParams();

  const tabParams = searchParams.get("tab")

  const handleChangeTab = (index: string) => {
    router.push(`?tab=${index}`)

  }
  console.log(tabParams);

  return (
    <div className="md:w-full">
      <Tabs defaultValue={tabParams ? tabParams.toString() : "4"} className="w-full mt-10 ">
        <TabsList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:w-full overflow-x-scroll md:overflow-x-hidden h-auto space-y-1">
          {TabContent.map((tab, index) => (
            <TabsTrigger
              key={index}
              className={`h-12 text-xl basis-1/3 2xl:basis-1/4`}
              value={tab.index.toString()}
              onClick={() => handleChangeTab(tab.index.toString())}
            >
              {tab.title}
            </TabsTrigger>
          ))}
          {/* <TabsTrigger
            className="h-12 text-xl basis-1/3 2xl:basis-1/4"
            value="1"
          >
            Báo cáo học tập
          </TabsTrigger>
          <TabsTrigger
            className="h-12 text-xl  basis-1/3 2xl:basis-1/4"
            value="2"
          >
            Bảng vinh danh
          </TabsTrigger>
          <TabsTrigger
            className="h-12 text-xl basis-1/3 2xl:basis-1/4"
            value="3"
          >
            Quà của tôi
          </TabsTrigger>
          <TabsTrigger
            className="h-12 text-xl basis-1/3 2xl:basis-1/4"
            value="4"
          >
            Quản trị thông tin tài khoản
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="1"></TabsContent>
        <TabsContent value="2">
          <div className="border-l-4 border-[#ff9213] pl-2 mt-12">
            <Select defaultValue="week1">
              <SelectTrigger className="w-[210px] font-semibold bg-white rounded-xl h-11">
                <SelectValue placeholder="Tuần" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="week1">Tuần 1 (08/18 - 08/25)</SelectItem>
                  <SelectItem value="week2">Tuần 2 (08/18 - 08/25)</SelectItem>
                  <SelectItem value="week3">Tuần 3 (08/18 - 08/25)</SelectItem>
                  <SelectItem value="week4">Tuần 4 (08/18 - 08/25)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-white p-4 mt-12 shadow-course-inset rounded-2xl overflow-x-auto w-[320px] md:w-4/5 lg:w-full">
            <table className="w-full min-w-[600px]">
              <tr className="text-xl">
                <th className="text-left w-[148px] pl-3">TT</th>
                <th className="text-left">Họ và tên</th>
                <th>Điểm</th>
              </tr>
              {LeaderBoardData.map((item, index) => (
                <tr key={index}>
                  <td className="flex gap-2 items-center lg:min-w-[148px] my-2">
                    <span className="font-semibold text-sm w-10 h-10 flex justify-center items-center">
                      {resolveRankingImage(item.rank) ? (
                        <Image
                          src={resolveRankingImage(item.rank)}
                          alt="ranking image"
                          width={40}
                          height={40}
                        />
                      ) : (
                        item.rank
                      )}
                    </span>
                    <div>
                      <Image
                        src={item.avatarUrl}
                        width={64}
                        height={64}
                        alt={item.name}
                      />
                    </div>
                  </td>
                  <td className="font-semibold">{item.name}</td>
                  <td className="font-semibold text-3xl text-center">
                    {item.score}
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </TabsContent>
        <TabsContent value="3">
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

          <div className="flex justify-between my-5 lg:my-10 items-center gap-2">
            <Select defaultValue="1">
              <SelectTrigger className="w-[200px] lg:w-[230px] font-semibold bg-white rounded-xl h-11 text-md shadow-md">
                <SelectValue placeholder="Tuần" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="1">Danh mục quà tặng</SelectItem>
                  <SelectItem value="2">Sticker Online</SelectItem>
                  <SelectItem value="3">Phần thưởng cuộc thi</SelectItem>
                  <SelectItem value="4">Nhóm quà cuộc thi</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button className="bg-white shadow-md text-black font-semibold text-md rounded-xl py-6">
              <Image
                src="https://static.edupia.vn/uploads/v3/assets/images/gift-shop/store.svg"
                width={28}
                height={26}
                alt="store"
              />
              <span className="ml-2">Gift Shop</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-7 gap-3 ">
            {Array(15)
              .fill("")
              .map((item, index) => {
                return (
                  <div
                    key={index}
                    className="bg-white shadow-course-inset border rounded-3xl overflow-hidden"
                  >
                    <div className=" relative w-full h-[150px] overflow-hidden bg-[#f9f9f9]">
                      <Image
                        src="https://static.edupia.vn/dungchung/dungchung/core_cms/resources/uploads/common/images/2022/06/14/property-1frame-8520.png"
                        alt="property"
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                    <h3 className="px-5 py-4">Avocado</h3>
                  </div>
                );
              })}
          </div>
        </TabsContent>
        <TabsContent value="4">
          <div className="flex flex-col gap-5">
            <div>
              <SectionTitle title="Thông tin tài khoản" index="2" />
              <SectionContent className="mt-5">
                <div className="grid grid-cols-2 font-semibold lg:w-1/2">
                  <div className="flex flex-col gap-3">
                    <div>Username</div>
                    <div>Mật khẩu</div>
                    <div>Số ngày vip</div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>{userInfo.username}</div>
                    <div>************</div>
                    <div>{userInfo.vipDays} ngày</div>
                  </div>
                </div>
              </SectionContent>
            </div>

            <div>
              <SectionTitle title="Thông tin học sinh" index="3"  />
              <SectionContent className="mt-5">
                <div className="grid grid-cols-2 font-semibold lg:w-1/2">
                  <div className="flex flex-col gap-3">
                    <div>Họ và tên</div>
                    <div>Ngày tháng năm sinh</div>
                    <div>Giới tính</div>
                    <div>Lớp</div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>{studentInfo.name}</div>
                    <div>
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour12: false
                      }).format(studentInfo.dateOfBirth)}
                    </div>
                    <div>{studentInfo.gender == 1 ? "Nam" : "Nữ"}</div>
                    <div>{studentInfo.className}</div>
                  </div>
                </div>
              </SectionContent>
            </div>

            <div>
              <SectionTitle title="Thông tin phụ huynh" index="4" />
              <SectionContent className="mt-5">
                <div className="grid grid-cols-2 font-semibold lg:w-1/2">
                  <div className="flex flex-col gap-3">
                    <div>Họ và tên</div>
                    <div>Ngày tháng năm sinh</div>
                    <div>Giới tính</div>
                    <div>Số điện thoại</div>
                    <div>Email</div>
                    <div>Địa chỉ</div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>{parentInfo.name}</div>
                    <div>
                      {!parentInfo.dateOfBirth ? (
                        <div>Không có</div>
                      ) : (
                        new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour12: false
                        }).format(parentInfo.dateOfBirth)
                      )}
                    </div>
                    <div>{parentInfo.gender == 1 ? "Nam" : "Nữ"}</div>
                    <div>{parentInfo.phoneNumber}</div>
                    <div>{parentInfo.email}</div>
                    <div>{parentInfo.address}</div>
                  </div>
                </div>
              </SectionContent>
            </div>
          </div>
          <LogoutButton />
        </TabsContent>
      </Tabs>

      <UserInfoModal />
    </div>
  );
}

export default ListGroup;
