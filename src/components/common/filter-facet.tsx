import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

function FilterFacet() {
  return (
    <div className="flex gap-4 md:gap-6 lg:gap-10 flex-wrap w-full ">
      <div className="w-full md:w-1/2 lg:w-1/4">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="unit1">Unit 1</SelectItem>
              <SelectItem value="unit2">Unit 2</SelectItem>
              <SelectItem value="unit3">Unit 3</SelectItem>
              <SelectItem value="unit4">Unit 4</SelectItem>
              <SelectItem value="unit5">Unit 5</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-1/2 lg:w-1/4">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tuần học" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="week1">Tuần học 1</SelectItem>
              <SelectItem value="week2">Tuần học 2</SelectItem>
              <SelectItem value="week3">Tuần học 3</SelectItem>
              <SelectItem value="week4">Tuần học 4</SelectItem>
              <SelectItem value="week5">Tuần học 5</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-1/2 lg:w-1/4">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Lớp học" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1">Nhà trẻ</SelectItem>
              <SelectItem value="2">3 - 4 tuổi</SelectItem>
              <SelectItem value="3">4 - 5 tuổi</SelectItem>
              <SelectItem value="4">5 - 6 tuổi</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default FilterFacet