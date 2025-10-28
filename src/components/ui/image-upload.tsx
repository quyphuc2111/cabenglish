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
import { motion } from "framer-motion";
import { uploadFiles } from "@/app/api/actions/uploadFiles";
import { showToast } from "@/utils/toast-config";
import Image from "next/image";

interface ImageUploaderProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

// Animation variants
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
      if (value.startsWith('http') || value.startsWith('https')) {
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
      .refine((file) => file.size <= 50 * 1024 * 1024, "File quá lớn. Kích thước tối đa cho phép là 50MB")
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles[0]) return;

      // Validation file size (50MB)
      const maxSize = 50 * 1024 * 1024;
      if (acceptedFiles[0].size > maxSize) {
        showToast.error('File quá lớn! Kích thước tối đa cho phép là 50MB.');
        return;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);

        const result = await uploadFiles(formData);

        if (!result.success) {
          throw new Error(result.error);
        }

        const fileUrl = result.data?.[0]?.file_url || '';

        if (!fileUrl || typeof fileUrl !== 'string') {
          throw new Error('URL không hợp lệ từ response');
        }

        const checkImage = new Promise((resolve, reject) => {
          const img = document.createElement('img');
          img.onload = () => resolve(true);
          img.onerror = () => reject(new Error('Không thể tải ảnh từ URL'));
          img.src = fileUrl;
        });

        await checkImage;

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
      maxSize: 100 * 1024 * 1024,
      accept: { 
        "image/png": [], 
        "image/jpg": [], 
        "image/jpeg": [], 
        "image/gif": [],
        "image/webp": [],
        "image/svg+xml": [],
        "image/bmp": [],
        "image/tiff": [],
        "image/ico": [],
        "image/avif": []
      },
      disabled: disabled,
    });

  const handleUrlSubmit = () => {
    if (!imageUrl) {
      showToast.error('Vui lòng nhập URL hình ảnh!');
      return;
    }

    const img = document.createElement('img');
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
    <div className="w-full space-y-4">
      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            Tải ảnh lên
          </TabsTrigger>
          <TabsTrigger value="url">
            Nhập URL
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
                          {isUploading ? (
                            <div className="flex flex-col items-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                              <p className="mt-2 text-sm text-gray-500">Đang tải lên...</p>
                            </div>
                          ) : preview ? (
                            <div>
                              <Image
                                src={preview}
                                alt="Ảnh đã tải lên"
                                width={400}
                                height={200}
                                className="max-h-[200px] rounded-lg object-cover"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div>
                              <ImagePlus className="h-20 w-20 text-gray-400" />
                            </div>
                          )}
                          <Input {...getInputProps()} type="file" />
                          {!isUploading && (
                            <div className="text-center">
                              <p className="text-sm text-gray-500">
                                {isDragActive ? "Thả ảnh vào đây!" : "Nhấp vào đây hoặc kéo thả ảnh để tải lên"}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Hỗ trợ: PNG, JPG, JPEG, GIF (tối đa 100MB)
                              </p>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </FormControl>
                    {fileRejections.length !== 0 && (
                      <FormMessage>
                        {fileRejections.map((rejection, index) => (
                          <div key={index} className="text-sm text-red-500 space-y-1">
                            {rejection.errors.map((error, errorIndex) => (
                              <p key={errorIndex}>
                                {error.code === 'file-too-large' 
                                  ? `File quá lớn. Kích thước tối đa cho phép là 50MB.`
                                  : error.code === 'file-invalid-type'
                                  ? `Định dạng file không hợp lệ. Vui lòng chọn file ảnh (png, jpg, jpeg, gif, webp, svg, bmp, tiff, ico, avif).`
                                  : error.message
                                }
                              </p>
                            ))}
                          </div>
                        ))}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </TabsContent>

        <TabsContent value="url">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="Nhập URL hình ảnh..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={disabled}
                />
              </div>
              <Button 
                type="button"
                onClick={handleUrlSubmit}
                disabled={disabled || !imageUrl}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Thêm
              </Button>
            </div>
            {preview && (
              <div className="rounded-lg border border-gray-200 p-2">
                <Image
                  src={preview}
                  alt="Ảnh từ URL"
                  width={400}
                  height={200}
                  className="max-h-[200px] rounded-lg object-cover mx-auto"
                  unoptimized
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {preview && (
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
          Xóa ảnh
        </Button>
      )}
    </div>
  );
};