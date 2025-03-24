"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { BadgePlus, Pencil, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Image as ImageIcon, Bold, Italic, Heading1, Heading2, Underline as UnderlineIcon, Hash, Strikethrough, Subscript as SubscriptIcon, Superscript as SuperscriptIcon, Quote, Table as TableIcon, Code as CodeIcon, Minus } from "lucide-react";
import {
  useCheckSchoolWeekExists,
  useCreateSchoolWeek,
  useGetSingleSchoolWeek,
  useSchoolWeek,
  useUpdateSchoolWeek
} from "@/hooks/use-schoolweek";
import {
  schoolWeekFormSchema,
  SchoolWeekFormValues
} from "@/lib/validations/schoolweek";
import { showToast } from "@/utils/toast-config";
import { notiFormSchema, NotiFormValues } from "@/lib/validations/noti";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { useCreateNoti, useUpdateNoti } from "@/hooks/useNoti";
import { useNotiStore } from "@/store/useNoti";
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import FontFamily from '@tiptap/extension-font-family'
import FontSize from '@tiptap/extension-font-size'
import Highlight from '@tiptap/extension-highlight'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import Blockquote from '@tiptap/extension-blockquote'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { TipTapEditor } from "@/components/ui/tiptap-editor";

// Tách animation configs ra riêng
const ANIMATIONS = {
  form: {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5, ease: "easeOut" }
    })
  },
  title: {
    initial: { x: -50, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  }
};

function CreateUpdateNotiModal() {
  const { isOpen, onClose, type, data } = useModal();
  const formType = data?.formType;
  const notiId = formType === "update" ? data?.notification?.id : null;

  const form = useForm<NotiFormValues>({
    resolver: zodResolver(notiFormSchema),
    defaultValues: {
      notificationId: 0,
      ntId: 1,
      title: "",
      contentHtml: "",
      description: "",
      createdAt: new Date().toISOString(),
      lastSentTime: new Date().toISOString(),
    },
    mode: "onChange"
  });

  const {selectedNotiType} = useNotiStore();

  const { mutate: createNoti, isPending: isCreating } = useCreateNoti();
  const { mutate: updateNoti, isPending: isUpdating } = useUpdateNoti();

  const isPending = isCreating || isUpdating;

  const handleClose = React.useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  const handleSubmit = React.useCallback(
    async (values: NotiFormValues) => {
      try {
        const action =
          formType === "create"
            ? createNoti({
                ...values,
                ntId: selectedNotiType
            }, {
                onSuccess: () => {
                  showToast.success("Tạo thông báo thành công");
                  handleClose();
                },
                onError: (error: Error) => {
                  showToast.error(
                    error.message || "Có lỗi xảy ra khi tạo thông báo"
                  );
                }
              })
            : updateNoti(
                {
                  notiId: notiId as number,
                  data: values
                },
                {
                  onSuccess: () => {
                    showToast.success("Cập nhật thông báo thành công");
                    handleClose();
                  }
                }
              );

        await action;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra!");
      }
    },
    [formType, notiId, createNoti, updateNoti, handleClose]
  );

  if (!isOpen || type !== "createUpdateNoti") return null;

  return (
    <AnimatePresence mode="wait">
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] !rounded-3xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              <motion.div
                className="flex items-center gap-5 w-full"
                {...ANIMATIONS.title}
              >
                {formType === "create" ? (
                  <BadgePlus className="w-6 h-6" />
                ) : (
                  <Pencil className="w-6 h-6" />
                )}
                <p className="text-xl font-medium">
                  {formType === "create"
                    ? "Thêm mới thông báo"
                    : "Cập nhật thông báo"}
                </p>
              </motion.div>
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 overflow-y-auto pr-2 max-h-[calc(90vh-120px)]"
            >
              <div className=" gap-4">
                <motion.div
                  variants={ANIMATIONS.form}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Tiêu đề
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            disabled={isPending}
                            placeholder="Nhập tiêu đề..."
                            className="text-sm p-4 border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                          />
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

              <motion.div
                variants={ANIMATIONS.form}
                initial="hidden"
                animate="visible"
                custom={2}
              >
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Mô tả
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isPending}
                          placeholder="Nhập mô tả..."
                          className="resize-none h-[100px] text-sm p-3 rounded-lg border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                variants={ANIMATIONS.form}
                initial="hidden"
                animate="visible"
                custom={2}
              >
                <FormField
                  control={form.control}
                  name="contentHtml"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Nội dung
                      </FormLabel>
                      <FormControl>
                      <TipTapEditor 
                          content={field.value} 
                          onChange={(html) => field.onChange(html)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div className="flex justify-end gap-4 pt-2 sticky bottom-0 bg-white pb-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isPending}
                  className="text-sm px-4 py-2"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-blue-500 hover:bg-blue-600 text-sm px-4 py-2"
                >
                  {isPending
                    ? `Đang ${formType === "create" ? "tạo" : "cập nhật"}...`
                    : `${formType === "create" ? "Tạo" : "Cập nhật"}`}
                </Button>
              </motion.div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}

export default CreateUpdateNotiModal;
