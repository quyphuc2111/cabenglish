import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ModalData, ModalType } from "@/hooks/useModalStore";
import Image from "next/image";

interface ProgressStatsProps {
  onOpen: (type: ModalType, data?: ModalData) => void;
  t: (key: string) => string;
}

export function ProgressStats({ onOpen, t }: ProgressStatsProps) {
  return (
    <div className="w-full lg:w-1/2 px-2 lg:px-5 mb-8 lg:mb-0 relative">
      <div className="flex items-center gap-5 justify-center">
        <Image
          src="/percent.png"
          alt="percent"
          width={40}
          height={40}
          priority
        />
        <p className="text-xl">{t("statisticsOfTeachingProgress")}</p>
      </div>

      <p className="text-lg font-medium text-[#C35690] text-center">
        Giáo viên A
      </p>

      <div className="flex items-center mb-8 mt-6">
        <p className="w-1/6">{t("year")}:</p>
        <div className="border border-black px-3 py-1 rounded-lg flex items-center gap-5 justify-center w-5/6 relative">
          <Progress
            value={20}
            className="h-8 rounded-full [&>*]:bg-[#BEDF9F]"
          />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-sm">
            20%
          </span>
          <Image
            src="/reset_icon.png"
            alt="check_icon"
            width={45}
            height={45}
            priority
            className="ml-2"
          />
        </div>
      </div>

      <div className="flex items-center ">
        <p className="w-1/6">Unit:</p>
        <div className="flex w-5/6 gap-5">
          <div className="border border-black px-3 py-1 rounded-lg flex items-center gap-5 justify-center w-full relative">
            <Progress
              value={20}
              className="h-8 rounded-full [&>*]:bg-[#A7C6F5]"
            />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-sm">
              20%
            </span>
            <div onClick={() => onOpen("resetUnit")}>
              <Image
                src="/reset_icon.png"
                alt="check_icon"
                width={45}
                height={45}
                priority
                className="ml-2"
              />
            </div>
          </div>
          <Select>
            <SelectTrigger className="w-[150px] h-[55px] rounded-lg">
              <SelectValue placeholder="Chọn Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Units</SelectLabel>
                <SelectItem value="unit1">Unit 1</SelectItem>
                <SelectItem value="unit2">Unit 2</SelectItem>
                <SelectItem value="unit3">Unit 3</SelectItem>
                <SelectItem value="unit4">Unit 4</SelectItem>
                <SelectItem value="unit5">Unit 5</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-5 my-5 justify-end">
        <Select>
          <SelectTrigger className="w-[150px] h-[45px] rounded-lg">
            <SelectValue placeholder="3 - 4 tuổi" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Units</SelectLabel>
              <SelectItem value="unit1">Unit 1</SelectItem>
              <SelectItem value="unit2">Unit 2</SelectItem>
              <SelectItem value="unit3">Unit 3</SelectItem>
              <SelectItem value="unit4">Unit 4</SelectItem>
              <SelectItem value="unit5">Unit 5</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="absolute left-0 bottom-0">
        <Image
          src="/kilan_course.png"
          alt="kilan_course"
          width={60}
          height={60}
          priority
          className="transform scale-x-[-1]"
        />
      </div>
    </div>
  );
}
