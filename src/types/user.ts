export interface UserInfo {
    user_id: string;
    email: string;
    language: string;
    theme: string;
    mode: string;
    is_firstlogin: boolean;
}

export interface UserResponse {
    success: boolean;
    error?: string;
    data?: UserInfo;
}


