import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import UnitBound from "./course-card/unit-bound";

function UnitsSection() {
  return (
    <Tabs defaultValue="1" >
      <TabsList className="grid lg:w-1/3 grid-cols-3">
        <TabsTrigger value="1">Học kì 1</TabsTrigger>
        <TabsTrigger value="2">Học kì 2</TabsTrigger>
        <TabsTrigger value="3">Học kì hè</TabsTrigger>
      </TabsList>
      <TabsContent value="1" className="pt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-5">
          <UnitBound />
          <UnitBound />
          <UnitBound />
          <UnitBound />
          <UnitBound />
        </div>
      </TabsContent>
      <TabsContent value="2"  className="pt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-5">
          <UnitBound />
          <UnitBound />
          <UnitBound />
          <UnitBound />
          <UnitBound />
          <UnitBound />
          <UnitBound />
          <UnitBound />
        </div>
      </TabsContent>
      <TabsContent value="3"  className="pt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-5">
          <UnitBound />
          <UnitBound />
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default UnitsSection;
