export interface ClassroomType {
    class_id: number;
    classname: string;
    description: string;
    numliked: number;
    imageurl: string;
    progress: number;
    order: number;
}

export interface ClassroomFormValues {
  classname: string;
  description: string;
  imageurl: string;
  numliked: number;
  progress: number;
  order: number;
  class_id: string;
}
