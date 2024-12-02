import { NextApiRequest, NextApiResponse } from 'next';
import { OAuth2Client } from 'google-auth-library';
import axiosInstance from '@/services/axiosInstance';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Phương thức không được hỗ trợ' });
  }

  try {
    const { token, ref } = req.body;

    // Xác thực token với Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    if (!payload) {
      return res.status(401).json({ 
        success: false,
        message: 'Token không hợp lệ' 
      });
    }

    // Gọi API đăng nhập
    const response = await axiosInstance.post('/api/login', {
      token,
      ref,
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    });

    return res.status(200).json(response.data);

  } catch (error) {
    console.error('Lỗi đăng nhập Google:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lỗi server'
    });
  }
} 