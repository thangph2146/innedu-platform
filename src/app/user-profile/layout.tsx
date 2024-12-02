import { Metadata } from "next";



export const metadata: Metadata = {
  title: 'Thông tin của bạn',
  description: 'Thông tin chi tiết của bạn',
};

function UserProfileLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default UserProfileLayout;