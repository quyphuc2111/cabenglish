'use server'

export async function uploadFiles(formData: FormData) {
  try {
    const files = formData.getAll('file');
    
    if (!files || files.length === 0) {
      throw new Error('Không có file nào được upload');
    }

    const uploadPromises = files.map(async (file: any) => {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const response = await fetch(process.env.NEXT_PUBLIC_UPLOAD_URL || '', {
        method: 'POST',
        headers: {
          'Authorization': process.env.NEXT_PUBLIC_UPLOAD_TOKEN || '',
          'AppName': process.env.NEXT_PUBLIC_UPLOAD_APP_NAME || ''
        },
        body: uploadData
      });

      if (!response.ok) {
        throw new Error('Upload thất bại');
      }

      const result = await response.json();
      // Trả về phần tử đầu tiên của mảng nếu response là mảng
      return Array.isArray(result) ? result[0] : result;
    });

    const results = await Promise.all(uploadPromises);
    return { success: true, data: results }; 

  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Có lỗi xảy ra khi upload file' 
    };
  }
} 