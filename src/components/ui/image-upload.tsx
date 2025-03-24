"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImagePlus, Link as LinkIcon } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { uploadFiles } from "@/app/api/actions/uploadFiles";
import { showToast } from "@/utils/toast-config";

interface ImageUploaderProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: {
      duration: 0.2
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const dropzoneAnimation = {
  dragOver: { 
    scale: 1.02,
    borderColor: "#3b82f6",
    backgroundColor: "rgba(59, 130, 246, 0.05)"
  }
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  value, 
  onChange,
  disabled 
}) => {
  const [preview, setPreview] = React.useState<string | null>(value || null);
  const [imageUrl, setImageUrl] = React.useState<string>(value || "");
  const [activeTab, setActiveTab] = React.useState<string>("upload");
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
    if (value) {
      if (value.startsWith('http')) {
        setActiveTab('url');
        setImageUrl(value);
      }
      setPreview(value);
    } else {
      setActiveTab('upload');
      setImageUrl('');
      setPreview(null);
    }
  }, [value]);

  const formSchema = z.object({
    image: z
      .instanceof(File)
      .refine((file) => file.size !== 0, "Vui lòng tải lên một hình ảnh")
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles[0]) return;

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);

        const result = await uploadFiles(formData);

        if (!result.success) {
          throw new Error(result.error);
        }

        // Log response để kiểm tra cấu trúc
        console.log('Upload response:', result.data);

        // Điều chỉnh theo cấu trúc response thực tế
        const fileUrl = result.data?.[0]?.file_url || '';

        // Kiểm tra URL hợp lệ
        if (!fileUrl || typeof fileUrl !== 'string') {
          throw new Error('URL không hợp lệ từ response');
        }

        // Kiểm tra URL có thể truy cập được
        const checkImage = new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => reject(new Error('Không thể tải ảnh từ URL'));
          img.src = fileUrl;
        });

        await checkImage;

        // Nếu mọi thứ OK, cập nhật state
        setPreview(fileUrl);
        if (onChange) {
          onChange(fileUrl);
        }
        form.setValue("image", acceptedFiles[0]);
        form.clearErrors("image");
        
        showToast.success('Tải ảnh lên thành công! 🎉');

      } catch (error: any) {
        console.error('Upload error:', error);
        setPreview(null);
        form.resetField("image");
        showToast.error(error.message || 'Có lỗi xảy ra khi tải ảnh! 😢');
      } finally {
        setIsUploading(false);
      }
    },
    [form, onChange],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 1000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
      disabled: disabled,
    });

  const handleUrlSubmit = () => {
    if (!imageUrl) {
      showToast.error('Vui lòng nhập URL hình ảnh!');
      return;
    }

    // Kiểm tra URL hình ảnh hợp lệ
    const img = new Image();
    img.onload = () => {
      setPreview(imageUrl);
      if (onChange) {
        onChange(imageUrl);
      }
      showToast.success('Thêm ảnh từ URL thành công! 🎉');
    };
    img.onerror = () => {
      showToast.error('URL hình ảnh không hợp lệ! 😢');
    };
    img.src = imageUrl;
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="w-full space-y-4"
    >
      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Tải ảnh lên
            </motion.span>
          </TabsTrigger>
          <TabsTrigger value="url">
            <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Nhập URL
            </motion.span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem className="mx-auto w-full">
                    <FormControl>
                      <div {...getRootProps()}>
                        <motion.div
                          variants={dropzoneAnimation}
                          whileHover={{ scale: 1.01 }}
                          whileDrag="dragOver"
                          className={`mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-dashed border-gray-300 p-8 transition-colors
                            ${disabled || isUploading ? 'cursor-not-allowed opacity-50' : ''}
                          `}
                        >
                          <AnimatePresence mode="wait">
                            {isUploading ? (
                              <motion.div
                                key="loading"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={fadeIn}
                                className="flex flex-col items-center"
                              >
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                <p className="mt-2 text-sm text-gray-500">Đang tải lên...</p>
                              </motion.div>
                            ) : preview ? (
                              <motion.img
                                key="preview"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={scaleIn}
                                src={preview}
                                alt="Ảnh đã tải lên"
                                className="max-h-[200px] rounded-lg object-cover"
                              />
                            ) : (
                              <motion.div
                                key="placeholder"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={fadeIn}
                              >
                                <ImagePlus className="h-20 w-20 text-gray-400" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <Input {...getInputProps()} type="file" />
                          {!isUploading && (
                            <motion.p 
                              variants={fadeIn}
                              className="text-sm text-gray-500"
                            >
                              {isDragActive ? "Thả ảnh vào đây!" : "Nhấp vào đây hoặc kéo thả ảnh để tải lên"}
                            </motion.p>
                          )}
                        </motion.div>
                      </div>
                    </FormControl>
                    <AnimatePresence>
                      {fileRejections.length !== 0 && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={fadeIn}
                        >
                          <FormMessage>
                            <p className="text-sm text-red-500">
                              Ảnh phải nhỏ hơn 1MB và có định dạng png, jpg hoặc jpeg
                            </p>
                          </FormMessage>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </TabsContent>

        <TabsContent value="url">
          <motion.div 
            variants={fadeIn}
            className="space-y-4"
          >
            <div className="flex gap-2">
              <motion.div className="flex-1" whileTap={{ scale: 0.995 }}>
                <Input
                  type="url"
                  placeholder="Nhập URL hình ảnh..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={disabled}
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="button"
                  onClick={handleUrlSubmit}
                  disabled={disabled || !imageUrl}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Thêm
                </Button>
              </motion.div>
            </div>
            <AnimatePresence>
              {preview && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={scaleIn}
                  className="rounded-lg border border-gray-200 p-2"
                >
                  <img
                    src={preview}
                    alt="Ảnh từ URL"
                    className="max-h-[200px] rounded-lg object-cover mx-auto"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </TabsContent>
      </Tabs>

      <AnimatePresence>
        {preview && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeIn}
          >
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setPreview(null);
                setImageUrl("");
                if (onChange) {
                  onChange("");
                }
              }}
              disabled={disabled}
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Xóa ảnh
              </motion.span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};