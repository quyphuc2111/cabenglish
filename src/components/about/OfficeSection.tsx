import Image from "next/image";
import React from "react";
import BKT_Image from "@/assets/bkt.png";

import {MapPinnedIcon, PhoneCall, Mail, Globe} from 'lucide-react'

const OfficeData = [
  {
    title: "Address",
    text: "Liền kề C39 Embassy Garden, Đ. Hoàng Minh Thảo, Khu đô thị Tây Hồ Tây, Bắc Từ Liêm, Hà Nội",
    icon: <MapPinnedIcon className="w-6 h-6" />,
    link: 'https://maps.app.goo.gl/rq76hcPDX914jLiNA'
  },
  {
    title: "Hotline",
    text: "0243 752 5253",
    icon: <PhoneCall className="w-6 h-6" />,
    link: "tel:02437525253",
  },
  {
    title: "Information",
    text: "bktjsc@gmail.com",
    icon:  <Mail className="w-6 h-6" />,
    link: "mailto:bktjsc@gmail.com",
  },
  {
    title: "Website",
    text: "bkt.net.vn",
    icon:  <Globe className="w-6 h-6" />,
    link: "https://bkt.net.vn/",
  }
];

function OfficeSection() {
  return (
    <div className="bg-gray-100">
      <div className="container flex py-2 md:py-10">
        <div className="bg-white rounded-xl px-5 md:px-16 py-5 md:py-10 my-12">
          <h2 className="text-2xl md:text-3xl font-bold border-b border-gray-300 py-2 mb-5">
            Văn phòng của BKT
          </h2>
          <div>
              {OfficeData &&
                OfficeData.map((item, index) => {
                  return (
                    <div key={index} className="flex items-center gap-5 py-1">
                      <div>
                        {item.icon}
                      </div>
                      <div>
                       
                        <p className="text-xl font-semibold">{item.title}</p>
                        {
                            item.link ? (
                              <a href={item.link} target="_blank" rel="noopener noreferrer">
                                <span className="text-blue-500 hover:text-blue-600">
                                <p className="text-md">{item.text}</p>
                                </span>
                              </a>
                            ) : (
                                <p className="text-md">{item.text}</p>
                            )
                        }
                        
                      </div>
                    </div>
                  );
                })}
            </div>
        </div>
        <div className="relative w-[450px] h-[500px] -ml-10 rounded-xl overflow-hidden shadow-lg hidden md:block">
          <Image
            src={BKT_Image}
            alt={"BKT Logo"}
            className="border border-gray-50"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </div>
  );
}

export default OfficeSection;
